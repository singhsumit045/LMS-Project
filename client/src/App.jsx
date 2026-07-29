import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

function App({ darkMode, toggleTheme }) {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/register",
  ];

  const showNavbar = !hideNavbarRoutes.includes(
    location.pathname
  );

  return (
    <>
      {showNavbar && (
        <Navbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      )}

      <AppRoutes />
    </>
  );
}

export default App;