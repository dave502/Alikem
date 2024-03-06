package models

import (
	"chat/dbconnection"
	time "time"

	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	ChatId              string `gorm:"index"`
	CreatedAt           time.Time
	ForwardedFromChatId string
	MessageAuthor       string
	ID                  uint
	MessageText         string
	RepliedToMessageId  uint64
	UpdatedAt           time.Time
}

func (msg *Message) List(chat string, msgs *[]Message) *gorm.DB {

	db := dbconnection.GetDB()
	db = db.Where(&Message{ChatId: chat}).Find(msgs).Limit(50)
	//.Preload("ChatRoom").Preload("User")

	// m, _ := json.Marshal((*msgs)[1])
	// logger.Trace("recieved from DB msgs: ", string(m))

	return db
}

func (msg *Message) Add() (uint, error) {
	db := dbconnection.GetDB()
	// logger.Trace("add msg = ", *msg)
	result := db.Create(msg)
	return msg.ID, result.Error
}
