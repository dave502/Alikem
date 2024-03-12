package routes

import (
	"github.com/gorilla/mux"

	"chat/chat_service"
	"chat/logger"
)

var RegisterChatRoutes = func(router *mux.Router) {

	sb := router.PathPrefix("/wschat/v1/api/chat").Subrouter()
	// sb.Use(middlewares.HeaderMiddleware)
	// sb.Use(middlewares.Authenticated)

	chat_serv := chat_service.New()

	logger.Trace("call RegisterChatRoutes")

	sb.HandleFunc("/messages", chat_serv.HttpChatMessages).Methods("GET")
}
