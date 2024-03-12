package chat_service

import (
	"chat/http_api"
	"chat/logger"
	"chat/models"
	"encoding/json"
	"net/http"
	"time"
)

type ChatMessagesResponse struct {
	Messages []Message `json:"Messages"`
}

type ChatIDRequestPayload struct {
	ChatId string `json:"chatID"`
}

type Message struct {
	ChatId              string    `json:"chat_id"`
	CreatedAt           time.Time `json:"created_at",omitempty`
	ForwardedFromChatId string    `json:"forward_from_chat_id",omitempty`
	MessageAuthor       string    `json:"author"`
	ID                  uint      `json:"msg_id",omitempty`
	MessageText         string    `json:"text"`
	RepliedToMessageId  uint64    `json:"reply_to_msg_id",omitempty`
	UpdatedAt           time.Time `json:"updated_at",omitempty`
}

type chat struct{}

func (c *chat) ChatMessages(chatId string) (ChatMessagesResponse, error) {

	var msgList []models.Message
	var msgModel models.Message
	_ = msgModel.List(chatId, &msgList)

	// transform chats
	chatMsgList := []Message{}
	for _, msg := range msgList {
		chatMsgList = append(chatMsgList, Message{
			ChatId:             msg.ChatId,
			MessageText:        msg.MessageText,
			ID:                 msg.ID,
			MessageAuthor:      msg.MessageAuthor,
			RepliedToMessageId: msg.RepliedToMessageId,
			CreatedAt:          msg.CreatedAt,
			UpdatedAt:          msg.UpdatedAt,
		})
	}
	return ChatMessagesResponse{Messages: chatMsgList}, nil
}

func (c *chat) SaveChatMessage(msg Message) uint {
	// logger.Trace(fmt.Sprintf("SaveChatMessage msg %+v\n", msg))

	//converting
	message := models.Message{
		ChatId:              msg.ChatId,
		ForwardedFromChatId: msg.ForwardedFromChatId,
		MessageAuthor:       msg.MessageAuthor,
		MessageText:         msg.MessageText,
		RepliedToMessageId:  msg.RepliedToMessageId,
	}

	// logger.Trace("new model Message", message)

	id, err := message.Add()
	if err != nil {
		logger.Error("Failed to save message", err)
	}

	return id
}

func (c *chat) HttpChatMessages(resp http.ResponseWriter, req *http.Request) {

	resp.Header().Set("Content-Type", "application/json")

	chat_id := req.URL.Query().Get("chat_id")

	logger.Info("chat_id", chat_id)

	messages, err := c.ChatMessages(chat_id)
	if http_api.ErrResponseIfErr(err, resp) != nil {
		return
	}

	data, err := json.Marshal(messages)
	if http_api.ErrResponseIfErr(err, resp) != nil {
		return
	}

	http_api.OkResponse(data, resp)
}

func New() *chat {
	return &chat{}
}
