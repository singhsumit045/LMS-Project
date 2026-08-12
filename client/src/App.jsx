import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import socket from "./services/socket";

function App({ darkMode, toggleTheme }) {
  useEffect(() => {

    // ==========================================
    // GET ACCESS TOKEN
    // ==========================================

    const accessToken =
      localStorage.getItem("access_token");

    console.log(
      "🔑 Access Token:",
      accessToken ? "Available" : "Not Found"
    );

    // ==========================================
    // NO TOKEN
    // ==========================================

    if (!accessToken) {
      console.log(
        "❌ Access token not found. Socket will not connect."
      );

      return;
    }

    // ==========================================
    // SOCKET AUTH
    // IMPORTANT:
    // Backend LiveClassGateway expects:
    // socket.handshake.auth.token
    // ==========================================

    socket.auth = {
      token: accessToken,
    };

    // ==========================================
    // CONNECT
    // ==========================================

    const handleConnect = () => {
      console.log(
        "🟢 Global Socket connected:",
        socket.id
      );
    };

    // ==========================================
    // CONNECT ERROR
    // ==========================================

    const handleConnectError = (error) => {
      console.error(
        "❌ Global Socket connection error:",
        error.message
      );

      // JWT expired
      if (
        error.message
          ?.toLowerCase()
          .includes("expired")
      ) {
        console.error(
          "🔴 JWT token has expired. Please login again."
        );
      }
    };

    // ==========================================
    // DISCONNECT
    // ==========================================

    const handleDisconnect = (reason) => {
      console.log(
        "🟡 Global Socket disconnected:",
        reason
      );
    };

    // ==========================================
    // USER ONLINE
    // ==========================================

    const handleUserOnline = (data) => {
      console.log(
        "🟢 User online:",
        data
      );
    };

    // ==========================================
    // USER OFFLINE
    // ==========================================

    const handleUserOffline = (data) => {
      console.log(
        "⚪ User offline:",
        data
      );
    };

    // ==========================================
    // SOCKET AUTHENTICATED
    // ==========================================

    const handleSocketAuthenticated = (data) => {
      console.log(
        "🔐 Socket authenticated:",
        data
      );
    };

    // ==========================================
    // SOCKET AUTH ERROR
    // ==========================================

    const handleSocketAuthError = (data) => {
      console.error(
        "❌ Socket authentication error:",
        data
      );
    };

    // ==========================================
    // REGISTER EVENTS
    // ==========================================

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "user-online",
      handleUserOnline
    );

    socket.on(
      "user-offline",
      handleUserOffline
    );

    socket.on(
      "socket-authenticated",
      handleSocketAuthenticated
    );

    socket.on(
      "socket-auth-error",
      handleSocketAuthError
    );

    // ==========================================
    // CONNECT SOCKET
    // ==========================================

    if (!socket.connected) {
      console.log(
        "🔌 Connecting global socket..."
      );

      socket.connect();
    }

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "user-online",
        handleUserOnline
      );

      socket.off(
        "user-offline",
        handleUserOffline
      );

      socket.off(
        "socket-authenticated",
        handleSocketAuthenticated
      );

      socket.off(
        "socket-auth-error",
        handleSocketAuthError
      );

      // Do NOT disconnect here.
      // This prevents React StrictMode
      // from causing unnecessary disconnects.
    };
  }, []);

  // ==========================================
  // APP
  // ==========================================

  return (
    <AppRoutes
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;