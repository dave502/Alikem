package http_api

import (
	"chat/logger"
	"encoding/json"
	"errors"
	"net/http"
)

var errCodes = map[error]int{
	errors.New("invalid credentials"):             http.StatusBadRequest,
	errors.New("invalid/bad request paramenters"): http.StatusBadRequest,
	errors.New("malformed jwt token"):             http.StatusBadRequest,
}

func errCode(err error) int {

	err_code, internal := errCodes[err]
	if internal {
		return err_code
	} else {
		return http.StatusInternalServerError
	}
}

type emptyOk struct {
	Message string
}

type ErrorResponse struct {
	Message string `json:"Message"`
	Code    int    `json:"Code"`
	Status  bool   `json:"Status"`
}

func ErrResponse(err error, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	errCode := errCode(err)
	w.WriteHeader(errCode)
	res := ErrorResponse{Message: err.Error(), Status: false, Code: errCode}
	data, err := json.Marshal(res)
	logger.PanicIfErr(err)
	w.Write(data)
}

func OkResponse(res []byte, w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func ErrResponseIfErr(err error, w http.ResponseWriter) error {
	if err != nil {
		ErrResponse(err, w)
		return err
	}
	return nil
}
