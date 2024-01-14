package redisrepo

import (
	"context"
	"log"
	"os"

	redis "github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

func InitialiseRedis() *redis.Client {

	redis_host := os.Getenv("REDIS_HOST")
	if redis_host == "" {
		redis_host = "localhost:6379"
	}

	redis_password := os.Getenv("REDIS_PASSWORD")

	conn := redis.NewClient(&redis.Options{
		Addr:     redis_host,
		Password: redis_password,
		DB:       0,
	})

	// checking if redis is connected
	pong, err := conn.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("Redis Connection Failed",
			err)
	}

	log.Println("Redis Successfully Connected.",
		"Ping", pong)

	redisClient = conn

	return redisClient
}
