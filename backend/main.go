package main

import (
	// "flag"
	// "fmt"
	l "log"
	"net"

	// "backend/pkg/httpserver"
	// "backend/pkg/ws"

	pb "backend/user_api"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

func init() {
	// Load the environment file .env
	err := godotenv.Load()
	if err != nil {
		l.Fatal("Unable to Load the env file.", err)
	}
}

func main() {

	lis, err := net.Listen("tcp", port)
	if err != nil {
		l.Fatalf("Failed to listen %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterUserAPIServer(s, &server{})

	l.Printf("Starting gRPC listener on port " + port)
	if err := s.Serve(lis); err != nil {
		l.Fatalf("Failed to serve: %v", err)
	}
	// server := flag.String("server", "", "http,websocket")
	// flag.Parse()

	// if *server == "http" {
	// 	fmt.Println("http server is starting on :8080")
	// 	httpserver.StartHTTPServer()
	// } else if *server == "websocket" {
	// 	fmt.Println("websocket server is starting on :8081")
	// 	ws.StartWebsocketServer()
	// } else {
	// 	fmt.Println("invalid server. Available server: http or websocket")
	// }
}
