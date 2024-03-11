package routes

import (
	"chat/chat_service"
	"chat/logger"
	"net/http"
)

var RegisterChatRoutes = func(router *http.ServeMux) {

	//sb := router.PathPrefix("/v1/api/chat").Subrouter()
	// sb.Use(middlewares.HeaderMiddleware)
	// sb.Use(middlewares.Authenticated)

	chat_serv := chat_service.New()

	logger.Trace("call RegisterChatRoutes")

	router.HandleFunc("/v1/api/chat/messages", chat_serv.HttpChatMessages)
	//.Methods("GET")
}
