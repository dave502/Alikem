// ws/index.js
let websocket = (newMessage, jwt) => {
  
  const host = window.location.hostname;
  
  console.log("connecting to", "wss://" + host + "/wschat/v1/ws");
  
  var socket = new WebSocket("wss://" + host + "/wschat/v1/ws");

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
