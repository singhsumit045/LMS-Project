import { io } from "socket.io-client";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const socket = io(API_BASE_URL, {
  autoConnect: false,
  withCredentials: true,

  // WebSocket ko prefer karo.
  // Isse polling ke repeated 400 requests avoid karne me help milegi.
  transports: ["websocket"],
});

export default socket;