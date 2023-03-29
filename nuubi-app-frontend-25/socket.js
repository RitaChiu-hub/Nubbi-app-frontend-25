const { io } = require("socket.io-client");

//const socket = io("https://coral-app-n96bn.ondigitalocean.app", {
const socket = io("http://localhost:4000", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
