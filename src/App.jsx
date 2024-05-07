import Brightness4Icon from "@mui/icons-material/Brightness4"; // Icon for dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Icon for light mode
import {
  Alert,
  Button,
  CssBaseline,
  IconButton,
  Snackbar,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ColourInput } from "./ColourInput";
import { DisplayCombinations } from "./DisplayCombinations";
import ImageColorExtractor from "./ImageColorExtractor";
import Palette from "./Palette.jsx";
import SavedPalettes from "./SavedPalettes"; // Ensure the path is correct

function App() {
  const [themeMode, setThemeMode] = useState("dark"); // Default to dark mode
  const [colours, setColours] = useState([]);
  const [stickyIndex, setStickyIndex] = useState(null); // New state to track sticky form
  const [selectedCombinations, setSelectedCombinations] = useState([]); //new state to save selected combinations in a list
  const [lastPaletteSave, setLastPaletteSave] = useState(Date.now());
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const toggleSticky = (index) => {
    if (stickyIndex === index) {
      setStickyIndex(null); // Unstick if the same index is clicked again
    } else {
      setStickyIndex(index); // Stick the new index
    }
  };

  const addColoursFromPalette = (palette) => {
    const newColours = palette.filter(
      (color) => !colours.some((col) => col.hex === color)
    );
    setColours((prevColours) => [
      ...prevColours,
      ...newColours.map((hex) => ({ hex, id: new Date().getTime() + hex })),
    ]);
  };
  const addPaletteColour = (color) => {
    if (!colours.some((colour) => colour.hex === color)) {
      setColours((prevColours) => [
        ...prevColours,
        { hex: color, id: new Date().getTime() + color },
      ]);
    } else {
      alert("This color has already been added.");
    }
  };

  //clear the colours state array
  const resetColours = () => {
    console.log("Resetting colours...");
    setColours([]);
    setSelectedCombinations([]);
    setStickyIndex(null);
  };

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
    // Find the old color value that is being updated.
    const oldHex = colours.find((colour) => colour.id === id)?.hex;

    // Update the colours array with the new hex value.
    setColours(
      colours.map((colour) =>
        colour.id === id ? { ...colour, hex: newHex } : colour
      )
    );

    // Remove any selected combinations that include the old color
    if (oldHex) {
      setSelectedCombinations(
        selectedCombinations.filter((combination) => {
          const [bgColor, textColor] = combination.split("-");
          return bgColor !== oldHex && textColor !== oldHex;
        })
      );
    }
  };

  const removeColour = (id, index) => {
    const colorToBeRemoved = colours.find((colour) => colour.id === id)?.hex;
    if (!colorToBeRemoved) return;

    if (stickyIndex === index) {
      setStickyIndex(null); // Unstick if the deleted color input is sticky
    }
    // Filter out the color from the colours list
    setColours(colours.filter((colour) => colour.id !== id));

    // Also remove any combinations that involve this color
    setSelectedCombinations(
      selectedCombinations.filter((combination) => {
        const [bgColor, textColor] = combination.split("-");
        return bgColor !== colorToBeRemoved && textColor !== colorToBeRemoved;
      })
    );
  };

  const handleToggleCombination = (bgColor, textColor, isChecked) => {
    const combinationKey = `${bgColor}-${textColor}`;
    setSelectedCombinations((prev) => {
      const newCombinations = new Set(prev);
      if (isChecked) {
        newCombinations.add(combinationKey);
      } else {
        newCombinations.delete(combinationKey);
      }
      console.log(newCombinations);
      return Array.from(newCombinations);
    });
  };

  // Memoize the calculation of all combinations
  const allCombinations = useMemo(() => {
    return colours.flatMap((col1) =>
      colours
        .filter((col2) => col1.hex !== col2.hex)
        .map((col2) => `${col1.hex}-${col2.hex}`)
    );
  }, [colours]);

  // Memoize check if all combinations are currently selected
  const allCombinationsSelected = useMemo(() => {
    return allCombinations.every((combination) =>
      selectedCombinations.includes(combination)
    );
  }, [selectedCombinations, allCombinations]);

  // Function to toggle all combinations
  const toggleAllCombinations = () => {
    if (allCombinationsSelected) {
      setSelectedCombinations([]);
    } else {
      setSelectedCombinations(allCombinations);
    }
  };

  // Function to save a new palette
  const savePalette = () => {
    const newPalette = new Palette(
      "Palette Name",
      colours,
      selectedCombinations
    );
    newPalette.save();
    setLastPaletteSave(Date.now());
    setSnackbarMessage("Palette saved successfully!");
    setSnackbarOpen(true);
  };

  // Load a palette from saved palettes
  const loadPalette = (id) => {
    const loadedPalette = Palette.load(id);
    if (loadedPalette) {
      setColours(loadedPalette.colors);
      setSelectedCombinations(loadedPalette.combinations);
      setCurrentPaletteIndex(loadedPalette.id);
    }
  };
  // Function to handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="headerContainer">
        <h1 className="title">Color Contrast Tool</h1>
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="Toggle theme"
        >
          {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>
      <div className="mainContainer">
        <ImageColorExtractor
          onAddColor={addPaletteColour}
          onAddPalette={addColoursFromPalette}
        />

        {colours.map((colour, index) => (
          <ColourInput
            label={`Color ${index + 1}:`}
            key={colour.id}
            initialColour={colour.hex}
            onColourChange={(newHex) => updateColour(colour.id, newHex)}
            onRemove={() => removeColour(colour.id, index)}
            onMoveUp={() => moveColourUp(index)}
            onMoveDown={() => moveColourDown(index)}
            onToggleSticky={() => toggleSticky(index)}
            isSticky={stickyIndex === index}
          />
        ))}

        <ColourInput addColour={addColour} onReset={() => resetColours()} />

        {colours.length > 1 && (
          <>
            <h2 className="subheadingTitle">Color Pairings</h2>
            <div className="colorPairingOptions">
              <Button
                variant="contained"
                color="primary"
                onClick={toggleAllCombinations}
              >
                {allCombinationsSelected ? "Unselect All" : "Select All"}
              </Button>
              <Tooltip title="Save palette and selected pairings" arrow>
                <Button
                  variant="contained"
                  color="success"
                  onClick={savePalette}
                >
                  Save Palette
                </Button>
              </Tooltip>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </div>
            <DisplayCombinations
              colours={colours.map((col) => col.hex)}
              onToggleCombination={handleToggleCombination}
              selectedCombinations={selectedCombinations}
            />
          </>
        )}
        <SavedPalettes
          lastUpdate={lastPaletteSave}
          onLoadPalette={loadPalette}
          setCurrentPaletteIndex={setCurrentPaletteIndex}
          currentPaletteIndex={currentPaletteIndex}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
