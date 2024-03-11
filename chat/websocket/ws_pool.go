package websocket

import (
	"log"
	"os"
	"runtime/debug"

	"chat/chat_service"
	"chat/logger"
)

type wsMessage struct {
	Type    int                  `json:"Type,omitempty"`
	Message chat_service.Message `json:"Message,omitempty"`
	Info    string               `json:"Info,omitempty"`
}

type Pool struct {
	Register   chan *WSReader
	Unregister chan *WSReader
	Clients    map[*WSReader]bool
	Broadcast  chan wsMessage
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *WSReader),
		Unregister: make(chan *WSReader),
		Clients:    make(map[*WSReader]bool),
		Broadcast:  make(chan wsMessage),
	}
}

func (p *Pool) Start() {

	logger.Trace("Pool Start")

	defer p.ReviveWebsocket()
	for {
		select {
		case client := <-p.Register:
			p.Clients[client] = true
			logger.Info("New client. Size of connection pool:", len(p.Clients))
			for c := range p.Clients {
				err := c.Connection.WriteJSON(wsMessage{Type: 1, Info: "new user joined..."})
				logger.PanicIfErr(err)
			}

		case client := <-p.Unregister:
			delete(p.Clients, client)
			logger.Info("disconnected a client. size of connection pool:", len(p.Clients))
			for c := range p.Clients {

				err := c.Connection.WriteJSON(wsMessage{Type: 1, Info: "user disconnected..."})
				logger.PanicIfErr(err)
			}

		case msg := <-p.Broadcast:
			log.Println("info", "broadcast message to clients in pool")
			for c := range p.Clients {
				err := c.Connection.WriteJSON(msg)
				logger.PanicIfErr(err)
			}
		}
	}
}

func (p *Pool) ReviveWebsocket() {
	if err := recover(); err != nil {
		if os.Getenv("LOG_PANIC_TRACE") == "true" {
			log.Println(
				"level:", "error",
				"err: ", err,
				"trace", string(debug.Stack()),
			)
		} else {
			log.Println(
				"level", "error",
				"err", err,
			)
		}
		go p.Start()
	}
}
