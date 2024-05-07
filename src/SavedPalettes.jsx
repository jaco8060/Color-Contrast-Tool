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
} from "@mui/material";

import { useEffect, useState } from "react";
import Palette from "./Palette"; // Import the Palette class
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
function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${month}-${day}-${year} ${formattedHour}:${minutes}${ampm}`;
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
                    sx={{ color: "inherit", display: "none", padding: "0" }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <h3>{color.hex}</h3>
                  <h4>{color.name}</h4>
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
    loadPalettes();
  }, [lastUpdate]);

  const loadPalettes = () => {
    setPalettes(Palette.getAllPalettes());
  };

  const deletePalette = (id) => {
    Palette.delete(id);
    loadPalettes();
    if (currentPaletteIndex === id) {
      setCurrentPaletteIndex(null); // Reset if the current palette is deleted
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
            key={palette.id}
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
                {palette.name} - Saved on {formatDate(palette.timestamp)}
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
                  onClick={() => onLoadPalette(palette.id)}
                >
                  Load This Palette
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deletePalette(palette.id)}
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
