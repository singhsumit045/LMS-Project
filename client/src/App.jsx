import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

function App({ darkMode, toggleTheme }) {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/login",
    "/register",
  ];

  const showLayout = !hideLayoutRoutes.includes(
    location.pathname
  );

  return (
    <>
      {showLayout && (
        <Navbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      )}

      <AppRoutes />

      {showLayout && <Footer />}
    </>
  );
}

export default App;