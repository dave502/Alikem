// ws/index.js
let websocket = (newMessage, jwt) => {
  console.log("connecting")
  const host = window.location.hostname;
  console.log("const host", host)
  var socket = new WebSocket("ws://" + host + "/chat/v1/ws");

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
