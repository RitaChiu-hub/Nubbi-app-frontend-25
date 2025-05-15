const { io } = require("socket.io-client");

const socket = io("https://coral-app-n96bn.ondigitalocean.app", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
