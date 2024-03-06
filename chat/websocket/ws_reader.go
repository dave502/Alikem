package websocket

import (
	"encoding/json"

	"chat/chat_service"
	"chat/logger"

	"github.com/gorilla/websocket"
)

type WSReader struct {
	ID         string
	Connection *websocket.Conn
	Pool       *Pool
	UserID     uint
}

// type Message struct {
// 	Type        int    `json:"Type,omitempty"`
// 	ChatId      int32  `json:"chatRoomId,omitempty"`
// 	ChatMessage string `json:"chatMessage,omitempty"`
// 	ChatUser    string `json:"chatUser,omitempty"`
// }

func (c *WSReader) Read(bodyChan chan []byte) {
	defer func() {
		c.Pool.Unregister <- c
		c.Connection.Close()
	}()
	defer c.Pool.ReviveWebsocket()

	for {
		messageType, bMessage, err := c.Connection.ReadMessage()
		logger.PanicIfErr(err)

		logger.Trace("messageType", messageType)

		var msg chat_service.Message
		err = json.Unmarshal(bMessage, &msg)
		logger.PanicIfErr(err)

		logger.Trace("message text", msg.MessageText)

		message := wsMessage{Type: messageType, Info: "msg recieved", Message: msg}
		c.Pool.Broadcast <- message
		logger.Trace("info:", "Message received: ", msg, "messageType: ", messageType)

		chat_serv := chat_service.New()
		go chat_serv.SaveChatMessage(msg)
	}
}
