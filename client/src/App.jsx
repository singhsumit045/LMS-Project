
import AppRoutes from "./routes/AppRoutes";

function App({ darkMode, toggleTheme }) {
  return (
    <AppRoutes
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;

