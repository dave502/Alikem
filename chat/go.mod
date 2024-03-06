module chat

go 1.19

require (
	github.com/go-kit/log v0.2.1
	github.com/golang-jwt/jwt v3.2.2+incompatible // indirect
	github.com/gorilla/websocket v1.5.0
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.19.1
	// github.com/jinzhu/gorm v1.9.16
	github.com/joho/godotenv v1.4.0
	github.com/rabbitmq/amqp091-go v1.9.0
	github.com/sirupsen/logrus v1.9.3 // indirect
	github.com/stretchr/testify v1.8.1
	golang.org/x/crypto v0.19.0 // indirect
	google.golang.org/genproto/googleapis/api v0.0.0-20240213162025-012b6fc9bca9
	google.golang.org/grpc v1.61.1
	google.golang.org/protobuf v1.32.0
	gorm.io/driver/postgres v1.5.6
	gorm.io/gorm v1.25.7
)

require (
	github.com/infobloxopen/atlas-app-toolkit v1.4.0
	github.com/infobloxopen/protoc-gen-gorm v1.1.2
	github.com/jinzhu/gorm v1.9.16
	github.com/ong-gtp/go-chat v0.0.0-20230205165244-d8b7ecca4da7
	google.golang.org/genproto v0.0.0-20240213162025-012b6fc9bca9
)

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/go-logfmt/logfmt v0.5.1 // indirect
	github.com/go-sql-driver/mysql v1.6.0 // indirect
	github.com/golang-jwt/jwt/v4 v4.4.1 // indirect
	github.com/golang/protobuf v1.5.3 // indirect
	github.com/google/uuid v1.4.0 // indirect
	github.com/gorilla/mux v1.8.1 // indirect
	github.com/grpc-ecosystem/go-grpc-middleware v1.2.2 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/pgx/v5 v5.4.3 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/lestrrat/go-strftime v0.0.0-20180220042222-ba3bf9c1d042 // indirect
	github.com/lib/pq v1.3.1-0.20200116171513-9eb3fc897d6f // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/rogpeppe/go-internal v1.12.0 // indirect
	github.com/rs/cors v1.10.1 // indirect
	golang.org/x/net v0.21.0 // indirect
	golang.org/x/sys v0.17.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20240213162025-012b6fc9bca9 // indirect
	gopkg.in/natefinch/lumberjack.v2 v2.2.1 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	gorm.io/driver/mysql v1.4.4 // indirect
)

// go get -u google.golang.org/grpc
// go get -u google.golang.org/protobuf
// protoc -I=. --go_out=services/grpc chat.proto
