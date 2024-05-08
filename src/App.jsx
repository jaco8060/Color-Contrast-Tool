import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import "./App.css";
import ResponsiveAppBar from "./Appbar.jsx";
import ColorContrastTool from "./ColorContrastTool.jsx";

function App() {
  const [themeMode, setThemeMode] = useState("dark"); // Default to dark mode

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode] // Recalculate the theme only if themeMode changes
  );

  const toggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="home"></div>
      {/* nav bar */}
      <ResponsiveAppBar
        themeMode={themeMode}
        toggleTheme={() => toggleTheme()}
      />
      {/* main program */}
      <ColorContrastTool />
    </ThemeProvider>
  );
}

export default App;
