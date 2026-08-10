import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import socket from "./services/socket";

function App({ darkMode, toggleTheme }) {
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    console.log(
      "🔑 Access Token:",
      accessToken ? "Available" : "Not Found"
    );

    if (!accessToken) {
      console.log("❌ Access token not found");
      return;
    }

    // ==========================================
    // AUTH
    // ==========================================

    socket.auth = {
      access_token: accessToken,
    };

    // ==========================================
    // EVENTS
    // ==========================================

    const handleConnect = () => {
      console.log("🟢 Global Socket connected:", socket.id);
    };

    const handleConnectError = (error) => {
      console.error(
        "❌ Global Socket connection error:",
        error.message
      );
    };

    const handleUserOnline = (data) => {
      console.log("🟢 User online:", data);
    };

    const handleUserOffline = (data) => {
      console.log("⚪ User offline:", data);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    // ==========================================
    // CONNECT
    // ==========================================

    if (!socket.connected) {
      socket.connect();
    }

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);

      // IMPORTANT:
      // Do not disconnect the socket here.
      // React StrictMode can run cleanup during development.
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