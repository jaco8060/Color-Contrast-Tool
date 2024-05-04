import Brightness4Icon from "@mui/icons-material/Brightness4"; // Icon for dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Icon for light mode
import {
  CssBaseline,
  IconButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import "./App.css";
import { ColourInput } from "./ColourInput";
import { DisplayCombinations } from "./DisplayCombinations";
import ImageColorExtractor from "./ImageColorExtractor"; // Import the new component

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
      alert("Please select a valid color that has not been added yet.");
    }
  };
  const moveColourUp = (index) => {
    if (index === 0) return; // Can't move the first element up
    const newColours = [...colours];
    [newColours[index], newColours[index - 1]] = [
      newColours[index - 1],
      newColours[index],
    ];
    setColours(newColours);
  };

  const moveColourDown = (index) => {
    if (index === colours.length - 1) return; // Can't move the last element down
    const newColours = [...colours];
    [newColours[index], newColours[index + 1]] = [
      newColours[index + 1],
      newColours[index],
    ];
    setColours(newColours);
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
      <CssBaseline />
      <div className="headerContainer">
        <h1>Color Contrast Tool</h1>
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="Toggle theme"
        >
          {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>
      <div className="mainContainer">
        <ImageColorExtractor />
        {colours.map((colour, index) => (
          <ColourInput
            label={`Color ${index + 1}:`}
            key={colour.id}
            initialColour={colour.hex}
            onColourChange={(newHex) => updateColour(colour.id, newHex)}
            onRemove={() => removeColour(colour.id)}
            onMoveUp={() => moveColourUp(index)}
            onMoveDown={() => moveColourDown(index)}
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
