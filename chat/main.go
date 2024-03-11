package main

import (
	"chat/dbconnection"
	"fmt"

	"net/http"
	"os"

	"chat/http_api/routes"
	"chat/logger"
	"chat/models"

	"github.com/gorilla/mux"
	level "github.com/sirupsen/logrus"
	// "gorm.io/gorm/logger"
	// 	"chat/services/rabbitmq"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%v", err)
		os.Exit(1)
	}
}

func run() error {
	logger.InitLogger(level.TraceLevel)

	// // Load env values
	// err := godotenv.Load()
	// if err != nil {
	// 	stdlog.Println("Error loading .env file")
	// 	return err
	// }

	// Setup Database and migrate models
	dbconnection.ConnectDB()
	db := dbconnection.GetDB()
	db.AutoMigrate(models.All...)
	logger.Info("Database migration is completed")

	// // Connect Rabbit MQ
	// conn, ch := rabbitmq.InitilizeBroker(logger)
	// defer conn.Close()
	// defer ch.Close()

	// // JWT_SECRET must be set for Auth signing
	// jwtSecret := os.Getenv("JWT_SECRET")
	// if jwtSecret == "" {
	// 	stdlog.Println("JWT Secret not set")
	// 	return errors.New("JWT Secret not set")
	// }

	// Setup app routes
	r := mux.NewRouter()
	routes.RegisterChatRoutes(r)
	routes.RegisterWebsocketRoute(r)

	// // Wrap routes with logging and cors middlewares
	// loggingMiddleware := middlewares.LoggingMiddleware(logger)
	// loggedRoutes := loggingMiddleware(r)
	// handler := middlewares.Cors(loggedRoutes)

	// corsDebug := os.Getenv("CORS_DEBUG")

	// handler := cors.New(cors.Options{
	// 	Debug:          (corsDebug == "true"),
	// 	AllowedOrigins: []string{"*"},
	// 	AllowedMethods: []string{"GET", "POST", "PATCH", "DELETE"},
	// 	AllowedHeaders: []string{"Authorization", "content_type"},
	// }).Handler(r)

	// Start api server
	port := os.Getenv("CHAT_SERVER_PORT")
	logger.Info("Server is starting on port", port)
	// err := http.ListenAndServe(fmt.Sprintf(":%s", port), handler)
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil)

	return err
}
