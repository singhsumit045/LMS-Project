
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ darkMode, toggleTheme }) => {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
      <Outlet />

      <Footer />
    </>
  );
};

export default MainLayout;

