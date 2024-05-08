import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";

import { useMemo, useState } from "react";
import "./App.css";
import { ColourInput } from "./ColourInput.jsx";
import { DisplayCombinations } from "./DisplayCombinations.jsx";
import ImageColorExtractor from "./ImageColorExtractor.jsx";
import Palette from "./Palette.jsx";
import SavedPalettes from "./SavedPalettes.jsx"; // Ensure the path is correct

export default function ColorContrastTool() {
  const [colours, setColours] = useState([]);
  const [stickyIndex, setStickyIndex] = useState(null); // New state to track sticky form
  const [selectedCombinations, setSelectedCombinations] = useState([]); //new state to save selected combinations in a list
  const [lastPaletteSave, setLastPaletteSave] = useState(Date.now());
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  let paletteName = "";

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // Function to save a new palette
  const handleSavePalette = () => {
    const newPalette = new Palette(paletteName, colours, selectedCombinations);
    newPalette.save();
    setLastPaletteSave(Date.now());
    setSnackbarMessage("Palette saved successfully!");
    setSnackbarOpen(true);
    handleCloseDialog();
  };
  return (
    <>
      <div className="headerContainer">
        <h1 className="title">Color Contrast Tool</h1>
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
                  onClick={handleOpenDialog}
                >
                  Save Palette
                </Button>
              </Tooltip>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                  component: "form",
                  onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    formJson.paletteName
                      ? (paletteName = formJson.paletteName)
                      : (paletteName = "Untitled");
                    handleSavePalette();
                    handleCloseDialog();
                  },
                }}
              >
                <DialogTitle>Name Your Palette</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter a name for your new color palette.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="paletteName"
                    label="Palette Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    // value={paletteName}
                    // onChange={(e) => setPaletteName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </DialogActions>
              </Dialog>

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
        <div id="saved-palettes">
          <SavedPalettes
            lastUpdate={lastPaletteSave}
            onLoadPalette={loadPalette}
            setCurrentPaletteIndex={setCurrentPaletteIndex}
            currentPaletteIndex={currentPaletteIndex}
          />
        </div>
      </div>
    </>
  );
}
