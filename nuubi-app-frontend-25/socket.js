const { io } = require("socket.io-client");

const socket = io("https://coral-app-n96bn.ondigitalocean.app/", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
