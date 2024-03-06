package dbconnection

import (
	"log"
	"os"
	"time"

	"chat/logger"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	db_logger "gorm.io/gorm/logger"
)

var (
	db *gorm.DB
)

func ConnectDB() {
	dbHost := ""

	dbName := os.Getenv("DB_DATABASE")
	if dbName == "" {
		err := godotenv.Load("../.env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}
		dbHost = "172.26.0.4"
	} else {
		dbHost = os.Getenv("DB_HOST")
	}
	dbName = os.Getenv("DB_DATABASE")
	dbUserName := os.Getenv("DB_USERNAME")
	dbUserPassword := os.Getenv("DB_PASSWORD")
	dbPort := os.Getenv("DB_PORT")

	metricsLogger := db_logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		db_logger.Config{
			SlowThreshold:             time.Second,      // Slow SQL threshold
			LogLevel:                  db_logger.Silent, // Log level
			IgnoreRecordNotFoundError: true,             // Ignore ErrRecordNotFound error for logger
			Colorful:                  false,            // Disable color
		},
	)

	dsn :=
		"host=" + dbHost +
			" user=" + dbUserName +
			" password=" + dbUserPassword +
			" dbname=" + dbName +
			" port=" + dbPort +
			" sslmode=disable"
		//TimeZone=Asia/Shanghai"
	d, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: metricsLogger})

	logger.PanicIfErr(err)
	db = d
}

func GetDB() *gorm.DB {
	return db
}
