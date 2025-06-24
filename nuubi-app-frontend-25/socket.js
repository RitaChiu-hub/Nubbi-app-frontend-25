const { io } = require("socket.io-client");

// const socket = io("http://localhost:8080", {
//   autoConnect: false,
//   withCredentials: true,
//   transports: ["websocket"],
// });
const socket = io(
  //"http://localhost:8080"
  "http://localhost:8080",
  {
    autoConnect: false,
    // autoConnect: true,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    // reconnectionDelay: 1000,
    transports: ["websocket"],
  }
);

export default socket;
