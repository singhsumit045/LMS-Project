import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import socket from "./services/socket";

function App({ darkMode, toggleTheme }) {
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    console.log("🔑 Access Token:", token);

    if (!token) {
      console.log("❌ Access token not found");
      return;
    }

    socket.auth = {
      token,
    };

    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("user-online", (data) => {
      console.log("🟢 User online:", data);
    });

    socket.on("user-offline", (data) => {
      console.log("⚪ User offline:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("user-online");
      socket.off("user-offline");

      socket.disconnect();
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