import { Button, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import "./App.css";
import { ColourInput } from "./ColourInput";
import { DisplayCombinations } from "./DisplayCombinations";

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

  const [colours, setColours] = useState([]);

  const addColour = (newColour) => {
    if (
      !colours.some((colour) => colour.hex === newColour.hex) &&
      /^#[0-9A-F]{6}$/i.test(newColour.hex)
    ) {
      setColours([
        ...colours,
        { hex: newColour.hex, id: new Date().getTime() },
      ]);
    } else {
      alert("Please select a valid colour that has not been added yet.");
    }
  };

  const updateColour = (id, newHex) => {
    setColours(
      colours.map((colour) =>
        colour.id === id ? { ...colour, hex: newHex } : colour
      )
    );
  };

  const removeColour = (id) => {
    setColours(colours.filter((colour) => colour.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* Ensures that the background color covers the whole page */}
      <div className="mainContainer">
        <h1>Colour Palette Tester</h1>
        <Button onClick={toggleTheme} variant="contained" color="primary">
          Switch to {themeMode === "dark" ? "Light" : "Dark"} Mode
        </Button>
        {colours.map((colour) => (
          <ColourInput
            key={colour.id}
            initialColour={colour.hex}
            onColourChange={(newHex) => updateColour(colour.id, newHex)}
            onRemove={() => removeColour(colour.id)}
          />
        ))}
        <ColourInput addColour={addColour} />
        {colours.length > 1 && (
          <DisplayCombinations colours={colours.map((col) => col.hex)} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
