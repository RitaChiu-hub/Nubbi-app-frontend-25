import { io } from "socket.io-client";

// Toggle this to switch between development and production
const DEV = true;

// Development backend: your computer’s LAN IP and port
// Make sure your phone/device is on the same network
const DEV_URL = "http://localhost:8080";

// Production backend
const PROD_URL = "https://api.nuubi.com";

// Pick the URL based on DEV flag
const SOCKET_URL = DEV ? DEV_URL : PROD_URL;

const socket = io(SOCKET_URL, {
  autoConnect: false, // only connect when you explicitly call socket.connect()
  withCredentials: true, // send cookies if your backend needs auth
  reconnection: true, // auto reconnect if disconnected
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket"], // force websocket
});

// Optional: log connection events
socket.on("connect", () => {
  console.log("Connected to backend:", SOCKET_URL, "Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from backend:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

export default socket;
