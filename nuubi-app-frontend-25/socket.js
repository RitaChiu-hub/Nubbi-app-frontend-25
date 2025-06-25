const { io } = require("socket.io-client");

// const socket = io("https://coral-app-n96bn.ondigitalocean.app", {
//   autoConnect: false,
//   withCredentials: true,
//   transports: ["websocket"],
// });
const socket = io(
  "https://coral-app-n96bn.ondigitalocean.app",
  {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket"],
  }
);

export default socket;
