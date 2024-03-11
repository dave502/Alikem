package routes

import (
	"chat/logger"

	"net/http"

	// "chat/services/rabbitmq"

	// "github.com/golang-jwt/jwt"
	"github.com/golang-jwt/jwt"
	// "github.com/gorilla/mux"

	// "github.com/ong-gtp/go-chat/http/responses"
	"chat/websocket"
	// "github.com/ong-gtp/go-chat/utils/errors"
)

var RegisterWebsocketRoute = func(router *http.ServeMux) {
	pool := websocket.NewPool()

	logger.Trace("RegisterWebsocketRoute")

	go pool.Start()
	// sb := router.PathPrefix("/v1").Subrouter()

	router.HandleFunc("/v1/ws", func(w http.ResponseWriter, r *http.Request) {
		// jwtToken := r.URL.Query().Get("jwt")
		// jwtSecret := os.Getenv("JWT_SECRET")
		// token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		// 	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		// 		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		// 	}
		// 	return []byte(jwtSecret), nil
		// })

		// if err != nil {
		// 	handleWebsocketAuthenticationErr(w, err)
		// 	return
		// }
		// claims, ok := token.Claims.(jwt.MapClaims)
		// if !ok || !token.Valid {
		// 	handleWebsocketAuthenticationErr(w, err)
		// 	return
		// }

		//serveWS(pool, w, r, claims)

		serveWS(pool, w, r, nil)
	})

}

func serveWS(pool *websocket.Pool, w http.ResponseWriter, r *http.Request, claims jwt.MapClaims) {

	logger.Trace("called serveWS")

	conn, err := websocket.Upgrade(w, r)
	logger.PanicIfErr(err)
	// rabbitBroker := rabbitmq.GetRabbitMQBroker()

	wsReader := &websocket.WSReader{
		Connection: conn,
		Pool:       pool,
	}

	pool.Register <- wsReader
	requestBody := make(chan []byte) // websocket.Message byte array channel
	go wsReader.Read(requestBody)
	// go rabbitBroker.ReadMessages(pool)
	// go rabbitBroker.PublishMessage(requestBody)
}

// func handleWebsocketAuthenticationErr(w http.ResponseWriter, err error) {
// 	logger.Trace("websocket authentication error: ", err)
// 	w.WriteHeader(http.StatusUnauthorized)
// 	w.Header().Set("Content-Type", "application/json; charset=utf-8")
// 	res := responses.ErrorResponse{Message: err.Error(), Status: false, Code: http.StatusUnauthorized}
// 	data, err := json.Marshal(res)
// 	errors.ErrorCheck(err)
// 	w.Write(data)
// }
