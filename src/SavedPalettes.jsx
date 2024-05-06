import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import "./SavedPalettes.css";

function SavedPalettes({
  lastUpdate,
  onLoadPalette,
  setCurrentPaletteIndex,
  currentPaletteIndex,
}) {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    const loadedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
    setPalettes(loadedPalettes);
  }, [lastUpdate]); // This will trigger a reload whenever a new palette is saved

  const loadPalettes = () => {
    setPalettes(JSON.parse(localStorage.getItem("palettes")) || []);
  };

  const isStorageEmpty = () => {
    return palettes.length === 0;
  };

  const deletePalette = (index) => {
    let updatedPalettes = [...palettes];
    updatedPalettes.splice(index, 1);
    localStorage.setItem("palettes", JSON.stringify(updatedPalettes));
    loadPalettes();
    if (currentPaletteIndex === index) {
      setCurrentPaletteIndex(null); // Reset if the current palette is deleted
    } else if (currentPaletteIndex > index) {
      setCurrentPaletteIndex(currentPaletteIndex - 1); // Adjust the index if necessary
    }
  };

  return (
    <div className="savedPalettesContainer">
      <h2 className="subheadingTitle">Saved Palettes</h2>
      {isStorageEmpty() ? (
        <p>No palettes saved yet.</p>
      ) : (
        palettes.map((palette, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <h3>
                Palette {index + 1} - Saved on {palette.timestamp}
              </h3>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <strong>Colors:</strong>{" "}
                {palette.colors.map((color) => color.hex).join(", ")}
              </div>
              <div>
                <strong>Selected Pairings:</strong>{" "}
                {palette.combinations.join(", ")}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onLoadPalette(palette, index)}
                style={{ marginTop: "10px" }}
              >
                Load This Palette
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => deletePalette(index)}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                Delete Palette
              </Button>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
}

export default SavedPalettes;
