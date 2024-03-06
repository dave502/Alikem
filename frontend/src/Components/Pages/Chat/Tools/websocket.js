// ws/index.js
let websocket = (newMessage, jwt) => {
  console.log("connecting")
  var socket = new WebSocket(`ws://172.26.0.6:9010/v1/ws`);

  socket.onopen = () => {
    console.log("Successfully Connected");
  }

  socket.onmessage = (msg) => {
    // console.log("Message from WebSocket: ", msg);
    newMessage(msg);
  }

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event)
  }

  socket.onerror = (error) => {
    console.log("Socket Error: ", error)
  }
  return socket
};

export { websocket };
