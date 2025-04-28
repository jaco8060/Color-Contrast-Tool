import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ResponsiveAppBar from "./Appbar.jsx";
import ColorContrastToolContent from "./ColorContrastTool.jsx"; // Renamed for clarity with Skeleton
import ColorContrastToolSkeleton from "./ColorContrastToolSkeleton.jsx";
import Palette from "./Palette.jsx";
import PaletteChooser from "./PaletteChooser.jsx"; // Import the new component
import SavedPalettes from "./SavedPalettes.jsx";
import SavedPalettesSkeleton from "./SavedPalettesSkeleton.jsx";

function App() {
  const [themeMode, setThemeMode] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  // State lifted from child components
  const [colours, setColours] = useState([]);
  const [stickyIndex, setStickyIndex] = useState(null);
  const [selectedCombinations, setSelectedCombinations] = useState([]);
  const [lastPaletteSave, setLastPaletteSave] = useState(Date.now()); // Used to trigger SavedPalettes update
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(null); // ID of the currently loaded/active palette
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  // Theme configuration
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  const toggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  };

  // Simulate initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust delay as needed (e.g., 1500ms = 1.5 seconds)

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Functions passed down to child components
  const toggleSticky = (index) => {
    setStickyIndex(stickyIndex === index ? null : index);
  };

  const addColoursFromPalette = (palette) => {
    const newColours = palette.filter(
      (color) => !colours.some((col) => col.hex === color)
    );
    setColours((prev) => [
      ...prev,
      ...newColours.map((hex) => ({ hex, id: Date.now() + hex })),
    ]);
    // Optionally navigate back to home or show a success message
    navigate("/"); // Navigate to home after adding colors
    setSnackbarMessage("Colors added from chosen palette.");
    setSnackbarOpen(true);
  };

  const addPaletteColour = (color) => {
    if (!colours.some((c) => c.hex === color)) {
      setColours((prev) => [...prev, { hex: color, id: Date.now() + color }]);
    } else {
      setSnackbarMessage("This color has already been added.");
      setSnackbarOpen(true);
    }
  };

  const resetColours = () => {
    setColours([]);
    setSelectedCombinations([]);
    setStickyIndex(null);
  };

  const addColour = (newColour) => {
    if (
      !colours.some((c) => c.hex === newColour.hex) &&
      /^#[0-9A-F]{6}$/i.test(newColour.hex)
    ) {
      setColours([...colours, { hex: newColour.hex, id: Date.now() }]);
    } else {
      setSnackbarMessage(
        "Please select a valid color that has not been added yet."
      );
      setSnackbarOpen(true);
    }
  };

  const moveColourUp = (index) => {
    if (index === 0) return;
    const newColours = [...colours];
    [newColours[index], newColours[index - 1]] = [
      newColours[index - 1],
      newColours[index],
    ];
    setColours(newColours);
  };

  const moveColourDown = (index) => {
    if (index === colours.length - 1) return;
    const newColours = [...colours];
    [newColours[index], newColours[index + 1]] = [
      newColours[index + 1],
      newColours[index],
    ];
    setColours(newColours);
  };

  const updateColour = (id, newHex) => {
    const oldHex = colours.find((c) => c.id === id)?.hex;
    setColours(colours.map((c) => (c.id === id ? { ...c, hex: newHex } : c)));
    // Remove combinations involving the old color hex
    if (oldHex) {
      setSelectedCombinations((prev) =>
        prev.filter((combo) => {
          const [bg, txt] = combo.split("-");
          return bg !== oldHex && txt !== oldHex;
        })
      );
    }
  };

  const removeColour = (id, index) => {
    const colorHex = colours.find((c) => c.id === id)?.hex;
    if (!colorHex) return;
    if (stickyIndex === index) setStickyIndex(null); // Unstick if removed color was sticky
    setColours((prev) => prev.filter((c) => c.id !== id));
    // Remove combinations involving the removed color
    setSelectedCombinations((prev) =>
      prev.filter((combo) => {
        const [bg, txt] = combo.split("-");
        return bg !== colorHex && txt !== colorHex;
      })
    );
  };

  const loadPalette = (id) => {
    const loadedPalette = Palette.load(id);
    if (loadedPalette) {
      setColours(loadedPalette.colors || []); // Ensure colors is an array
      setSelectedCombinations(loadedPalette.combinations || []);
      setCurrentPaletteIndex(loadedPalette.id);
      setStickyIndex(null); // Reset sticky color on load
      navigate("/"); // Navigate to home after loading
      setSnackbarMessage(
        `Palette "${loadedPalette.name || "Untitled"}" loaded.`
      );
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Failed to load palette.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Called from ColorContrastTool when a palette is saved/updated
  const triggerPaletteSaveUpdate = () => {
    setLastPaletteSave(Date.now()); // Update timestamp to trigger SavedPalettes refresh
    setSnackbarMessage("Palette saved successfully!");
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveAppBar themeMode={themeMode} toggleTheme={toggleTheme} />

      {/* Show Skeleton loaders during initial load */}
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <ColorContrastToolSkeleton />
            ) : (
              <ColorContrastToolContent
                colours={colours}
                stickyIndex={stickyIndex}
                selectedCombinations={selectedCombinations}
                addColour={addColour}
                addPaletteColour={addPaletteColour}
                addColoursFromPalette={addColoursFromPalette}
                updateColour={updateColour}
                removeColour={removeColour}
                moveColourUp={moveColourUp}
                moveColourDown={moveColourDown}
                resetColours={resetColours}
                toggleSticky={toggleSticky}
                setSelectedCombinations={setSelectedCombinations}
                triggerPaletteSaveUpdate={triggerPaletteSaveUpdate}
                handleSnackbarClose={handleSnackbarClose}
                snackbarOpen={snackbarOpen}
                snackbarMessage={snackbarMessage}
              />
            )
          }
        />
        <Route
          path="/saved-palettes"
          element={
            isLoading ? (
              <SavedPalettesSkeleton />
            ) : (
              <SavedPalettes
                lastUpdate={lastPaletteSave} // Prop to trigger re-fetch/re-render
                onLoadPalette={loadPalette}
                setCurrentPaletteIndex={setCurrentPaletteIndex}
                currentPaletteIndex={currentPaletteIndex}
              />
            )
          }
        />
        {/* New Route */}
        <Route
          path="/palette-chooser"
          element={
            <PaletteChooser addColoursFromPalette={addColoursFromPalette} />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
