import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import { createAppTheme } from "./theme/theme";

function Root() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const theme = useMemo(
    () => createAppTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;

      localStorage.setItem(
        "theme",
        newMode ? "dark" : "light"
      );

      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <App
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);