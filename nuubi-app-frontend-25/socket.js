const { io } = require("socket.io-client");
import config from './config';

// Use local development server
const socket = io(config.SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

export default socket;
