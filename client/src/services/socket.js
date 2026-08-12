import { io } from "socket.io-client";

// =====================================================
// SOCKET SERVER URL
// =====================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

// =====================================================
// SOCKET INSTANCE
// =====================================================

const socket = io(API_BASE_URL, {
  autoConnect: false,

  withCredentials: true,

  // IMPORTANT:
  // Allow polling first and then upgrade to websocket.
  transports: ["polling", "websocket"],

  timeout: 10000,

  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// =====================================================
// DEBUG EVENTS
// =====================================================

socket.on("connect", () => {
  console.log(
    "🟢 Socket connected:",
    socket.id
  );
});

socket.on("connect_error", (error) => {
  console.error(
    "❌ Socket connection error:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log(
    "🟡 Socket disconnected:",
    reason
  );
});

socket.on("socket-authenticated", (data) => {
  console.log(
    "🔐 Socket authenticated:",
    data
  );
});

socket.on("socket-auth-error", (data) => {
  console.error(
    "🔴 Socket authentication error:",
    data
  );
});

export default socket;