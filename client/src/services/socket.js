import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,

  // WebSocket ko prefer karo.
  // Isse polling ke repeated 400 requests avoid karne me help milegi.
  transports: ["websocket"],
});

export default socket;