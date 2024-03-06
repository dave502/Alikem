package logger

import (
	"fmt"
	"io"
	"os"

	"github.com/sirupsen/logrus"
	rotatelogs "gopkg.in/natefinch/lumberjack.v2"
	// https://www.golinuxcloud.com/golang-logrus/
)

var (
	logger      *logrus.Logger
	traceLogger *logrus.Logger
	log         *logrus.Entry
)

func InitLogger(level logrus.Level) error {

	formatter := logrus.TextFormatter{
		DisableTimestamp: false,
		TimestampFormat:  "2006-01-02 15:04:05",
		DisableColors:    false,
		QuoteEmptyFields: true,
		// ForceFormatting:        false,
		DisableLevelTruncation: true,
		PadLevelText:           true,
		FullTimestamp:          false,
		// Customizing delimiters
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "@timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
			logrus.FieldKeyFunc:  "caller",
		},
	}

	// Logging setup
	fileLogging := os.Getenv("LOG_TO_FILE")
	if fileLogging == "true" {
		file_path := "./chatapp_log.txt"
		f, err := os.OpenFile(file_path, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
		if err != nil {
			fmt.Println("Could not create log file: ", err)
			return err
		}
		defer f.Close()

		rotated_file := &rotatelogs.Logger{
			Filename:   file_path,
			MaxSize:    5, // MB
			MaxBackups: 10,
			MaxAge:     30,   // days
			Compress:   true, // disabled by default
		}

		logger = &logrus.Logger{
			// Log into f file handler and on os.Stdout
			Out:       io.MultiWriter(rotated_file, os.Stdout),
			Level:     level,
			Formatter: &formatter,
		}

	} else {
		logger = logrus.New()
		logger.SetLevel(level)
		// Output to stdout instead of the default stderr
		logger.SetOutput(os.Stdout)
		logger.SetFormatter(&formatter)
	}

	traceLogger = logrus.New()
	traceLogger.SetLevel(level)
	traceLogger.SetOutput(os.Stdout)
	traceLogger.SetFormatter(&formatter)
	// // Direct any attempts to use Go's log package to our structured logger
	// stdlog.SetOutput(log.NewStdlibAdapter(logger))
	// // Log the timestamp (in UTC) and the callsite (file + line number) of the logging
	// // call for debugging in the future.
	// logger = log.With(logger, "ts", log.DefaultTimestampUTC, "loc", log.DefaultCaller)

	return nil
}

func Logger() *logrus.Logger {
	return logger
}

func PanicIfErr(err error) {
	if err != nil {
		logger.Panic(err)
	}
}

func LogIfErr(err error) {
	if err != nil {
		logger.Error(err)
	}
}

func Error(args ...interface{}) {
	logger.Error(args)
}

func Info(args ...interface{}) {
	logger.Info(args)
}

func Trace(args ...interface{}) {
	traceLogger.Trace(args)
}

func Debug(args ...interface{}) {
	logger.Debug(args)
}

func ContextLogger() *logrus.Entry {
	contextLogger := log.WithFields(logrus.Fields{
		"test": "test",
	})
	return contextLogger
}
