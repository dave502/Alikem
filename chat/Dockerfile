ARG exec_file_name=chat_server 
ARG workdir=/app  
ARG expose_port=9010

# этап I:
FROM golang AS build



ARG workdir
ARG exec_file_name

WORKDIR ${workdir}
COPY . ./
# Собираем серверное приложение
RUN CGO_ENABLED=0 GOOS=linux go build -o /${exec_file_name} 

# # air
# RUN go install github.com/cosmtrek/air@latest
# ENTRYPOINT ["air"]

# этап II: 
FROM scratch

ARG workdir
ARG exec_file_name
ARG expose_port
ENV exec_file_name=$exec_file_name


WORKDIR /
# Копируем двоичный файл, собранный на предыдущем этапе, в новое место
COPY --from=build /${exec_file_name} /${exec_file_name} 
EXPOSE $expose_port

ENTRYPOINT ["/chat_server"]


