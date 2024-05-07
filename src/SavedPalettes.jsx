import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import "./SavedPalettes.css";

//return white or black based on background color
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

function PaletteDisplay({ palette }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setSnackbarMessage(`Copied ${color} to clipboard!`);
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div>
      <strong>Color palette:</strong>
      <Grid container spacing={1} mb={2}>
        {palette.colors.map((color, index) => (
          <Grid item xs={6} sm={4} md={3} key={index} mt={1}>
            <Tooltip title="Click to copy color" placement="top">
              <div
                style={{
                  width: "100%",
                  backgroundColor: color.hex,
                  color: getContrastYIQ(color.hex),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={() => handleCopyColor(color.hex)}
                className="paletteColor"
              >
                <div className="colorGroup">
                  <IconButton
                    className="copyIcon"
                    sx={{ color: "inherit", display: "none" }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <h3>{color.hex}</h3>
                </div>
              </div>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <div className="colorCombos">
        <strong>Selected Pairings:</strong>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, mb: 2 }}>
          {palette.combinations.map((combo, index) => {
            const [bgColor, textColor] = combo.split("-");

            return (
              <Box key={index} sx={{ p: 0 }}>
                <div
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: "8px 16px",
                    fontWeight: "600",
                  }}
                >
                  {`Bg color: ${bgColor} with Txt color: ${textColor}`}
                </div>
              </Box>
            );
          })}
        </Box>
      </div>
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
  );
}

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
      {palettes.length === 0 ? (
        <p>No palettes saved yet.</p>
      ) : (
        palettes.map((palette, index) => (
          <Accordion
            key={index}
            sx={{
              width: { xs: "20rem", sm: "38rem", md: "56rem", lg: "75rem" },
            }}
          >
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
              <PaletteDisplay palette={palette} />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onLoadPalette(palette, index)}
                >
                  Load This Palette
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deletePalette(index)}
                >
                  Delete Palette
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
}

export default SavedPalettes;
