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
import tinycolor from "tinycolor2";
import "./App.css";
import { ColourInput } from "./ColourInput.jsx";
import { DisplayCombinations } from "./DisplayCombinations.jsx";
import ImageColorExtractor from "./ImageColorExtractor.jsx";
import Palette from "./Palette.jsx";

export default function ColorContrastTool({
  colours,
  stickyIndex,
  selectedCombinations,
  addColour,
  addPaletteColour,
  addColoursFromPalette,
  updateColour,
  removeColour,
  moveColourUp,
  moveColourDown,
  resetColours,
  toggleSticky,
  setSelectedCombinations,
  triggerPaletteSaveUpdate,
  handleSnackbarClose,
  snackbarOpen,
  snackbarMessage,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [showOnlyReadable, setShowOnlyReadable] = useState(false);
  let paletteName = ""; // Used in the save dialog form

  const toggleReadableFilter = () => {
    setShowOnlyReadable(!showOnlyReadable);
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

  // Generate all possible unique color pair combinations (bg-text)
  const allCombinations = useMemo(() => {
    return colours.flatMap((col1) =>
      colours
        .filter((col2) => col1.hex !== col2.hex)
        .map((col2) => `${col1.hex}-${col2.hex}`)
    );
  }, [colours]);

  // Check if all *currently visible* combinations are selected
  const allCombinationsSelected = useMemo(() => {
    const visibleCombinations = showOnlyReadable
      ? allCombinations.filter((combination) => {
          const [bgColor, textColor] = combination.split("-");
          const readability = tinycolor.readability(bgColor, textColor);
          return readability >= 4.5; // WCAG AA minimum
        })
      : allCombinations;
    // Handle case where no combinations are visible (e.g., only 1 color, or filter yields none)
    if (visibleCombinations.length === 0) return false;

    return visibleCombinations.every((combination) =>
      selectedCombinations.includes(combination)
    );
  }, [selectedCombinations, allCombinations, showOnlyReadable]);

  // Selects or deselects all combinations based on the current filter (all or readable)
  const toggleAllCombinations = () => {
    const baseCombinations = colours.flatMap((col1) =>
      colours
        .filter((col2) => col1.hex !== col2.hex)
        .map((col2) => ({
          key: `${col1.hex}-${col2.hex}`,
          bgColor: col1.hex,
          textColor: col2.hex,
        }))
    );

    // Filter combinations based on the readability toggle if active
    const targetCombinations = showOnlyReadable
      ? baseCombinations.filter(
          (comb) => tinycolor.readability(comb.bgColor, comb.textColor) >= 4.5
        )
      : baseCombinations;

    const targetKeys = targetCombinations.map((comb) => comb.key);

    // Check if all target combinations are currently selected
    const allCurrentlySelected =
      targetKeys.length > 0 &&
      targetKeys.every((key) => selectedCombinations.includes(key));

    if (allCurrentlySelected) {
      // Deselect all target combinations
      setSelectedCombinations((prev) =>
        prev.filter((key) => !targetKeys.includes(key))
      );
    } else {
      // Select all target combinations (adding to existing selections)
      setSelectedCombinations((prev) =>
        Array.from(new Set([...prev, ...targetKeys]))
      );
    }
  };

  const handleOpenDialog = () => {
    if (colours.length < 1) {
      // TODO: Replace alert with snackbar notification via App state
      alert("Add at least one color before saving a palette.");
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSavePalette = () => {
    const newPalette = new Palette(paletteName, colours, selectedCombinations);
    newPalette.save();
    triggerPaletteSaveUpdate(); // Notify App to potentially update SavedPalettes
    handleCloseDialog();
  };

  return (
    <>
      <div id="home"></div> {/* Anchor for scrolling */}
      <div className="headerContainer">
        <h1 className="title">Color Contrast Tool</h1>
      </div>
      <div className="mainContainer">
        <ImageColorExtractor
          onAddColor={addPaletteColour}
          onAddPalette={addColoursFromPalette}
        />

        {/* Render individual color input components */}
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

        {/* Render the input for adding a new color and the reset button */}
        <ColourInput addColour={addColour} onReset={() => resetColours()} />

        {/* Render color pairings section only if there are 2+ colors */}
        {colours.length > 1 && (
          <>
            <h2 className="subheadingTitle">Color Pairings</h2>
            <div className="colorPairingOptions">
              <Button
                variant="contained"
                color="primary"
                onClick={toggleAllCombinations}
                disabled={colours.length < 2}
              >
                {allCombinationsSelected ? "Unselect All" : "Select All"}
              </Button>
              <Tooltip title="Save palette and selected pairings" arrow>
                {/* Wrap button in span for tooltip to work when disabled */}
                <span>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpenDialog}
                    disabled={colours.length < 1}
                  >
                    Save Palette
                  </Button>
                </span>
              </Tooltip>
              {/* Dialog for naming and saving the palette */}
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                  component: "form",
                  onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    paletteName = formJson.paletteName || "Untitled";
                    handleSavePalette();
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
                    defaultValue=""
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </DialogActions>
              </Dialog>

              {/* Snackbar for notifications (controlled by App) */}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity="success" // Severity might need to be dynamic based on message
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
              {/* Button to toggle filtering by readability */}
              <Button
                variant="contained"
                color="secondary"
                onClick={toggleReadableFilter}
                disabled={colours.length < 2}
              >
                {showOnlyReadable ? "Show All" : "Show Readable Only"}
              </Button>
            </div>
            {/* Component to display the color combinations */}
            <DisplayCombinations
              colours={colours.map((col) => col.hex)} // Pass only hex values
              onToggleCombination={handleToggleCombination}
              selectedCombinations={selectedCombinations}
              showOnlyReadable={showOnlyReadable}
            />
          </>
        )}
      </div>
    </>
  );
}
