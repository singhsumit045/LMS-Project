import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import socket from "./services/socket";

function App({ darkMode, toggleTheme }) {
  useEffect(() => {
    const accessToken =
      localStorage.getItem("access_token");

    console.log(
      "🔑 Access Token:",
      accessToken ? "Available" : "Not Found"
    );

    if (!accessToken) {
      console.log("❌ Access token not found");
      return;
    }

    // ==========================================
    // Send access_token to WebSocket
    // ==========================================

    socket.auth = {
      access_token: accessToken,
    };

    // ==========================================
    // Socket Events
    // ==========================================

    const handleConnect = () => {
      console.log(
        "🟢 Socket connected:",
        socket.id
      );
    };

    const handleConnectError = (error) => {
      console.error(
        "❌ Socket connection error:",
        error.message
      );
    };

    const handleUserOnline = (data) => {
      console.log(
        "🟢 User online:",
        data
      );
    };

    const handleUserOffline = (data) => {
      console.log(
        "⚪ User offline:",
        data
      );
    };

    socket.on("connect", handleConnect);
    socket.on(
      "connect_error",
      handleConnectError
    );
    socket.on(
      "user-online",
      handleUserOnline
    );
    socket.on(
      "user-offline",
      handleUserOffline
    );

    // ==========================================
    // Connect socket
    // ==========================================

    if (!socket.connected) {
      socket.connect();
    }

    // ==========================================
    // Cleanup
    // ==========================================

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "connect_error",
        handleConnectError
      );
      socket.off(
        "user-online",
        handleUserOnline
      );
      socket.off(
        "user-offline",
        handleUserOffline
      );

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <AppRoutes
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;