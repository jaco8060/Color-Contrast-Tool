import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useEffect, useState } from "react";
import Palette from "./Palette"; // Import the Palette class
import "./SavedPalettes.css";
import { generateTheme } from "./ThemeGen";
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
const CooldownButton = ({ generateThemeName }) => {
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(10); // Cooldown time in seconds

  useEffect(() => {
    let timer;
    if (isCooldown) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          }
          clearInterval(timer);
          setIsCooldown(false);
          return 10; // Reset cooldown time for next use
        });
      }, 1000);
    }

    // Cleanup timer on component unmount or if the cooldown ends early
    return () => clearInterval(timer);
  }, [isCooldown]);

  const handleButtonClick = async () => {
    setIsCooldown(true); // Start cooldown
    await generateThemeName();
  };

  return (
    <Tooltip
      placement="top"
      arrow
      title="Click to generate theme name based on color names powered by Gemini"
    >
      <Button
        variant="outlined"
        color="primary"
        sx={{ width: "250px" }}
        onClick={handleButtonClick}
        disabled={isCooldown}
      >
        {isCooldown ? `Wait ${cooldownTime}s` : "Generate Theme Name (AI)"}
      </Button>
    </Tooltip>
  );
};
function PaletteDisplay({ palette, onUpdatePaletteName, onUpdateThemeName }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentThemeName, setCurrentThemeName] = useState(
    palette.themeName || ""
  );

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setSnackbarMessage(`Copied ${color} to clipboard!`);
      setSnackbarOpen(true);
    });
  };

  const handleThemeNameChange = (event) => {
    setCurrentThemeName(event.target.value);
  };

  const colorNames = palette.colors.map((color) => color.name);

  const generateThemeName = async () => {
    const themeName = await generateTheme(colorNames);
    setCurrentThemeName(themeName);
  };

  const saveThemeName = () => {
    onUpdateThemeName(currentThemeName, palette.id);
    setSnackbarMessage(`Theme name ${currentThemeName} saved successfully!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div>
      <strong>Color palette:</strong>
      <Grid container spacing={1} mb={2}>
        {palette.colors.map((color, index) => (
          <Grid xs={6} sm={4} md={3} key={index} mt={1}>
            <Tooltip title="Click to copy color" placement="top" arrow>
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
          {palette.combinations === null ||
          palette.combinations.length === 0 ? (
            <h5>No selected pairings</h5>
          ) : (
            palette.combinations.map((combo, index) => {
              const [bgColor, textColor] = combo.split("-");
              return (
                <Box key={index} sx={{ padding: 0 }}>
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
            })
          )}
        </Box>
      </div>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ marginBottom: 4 }}
      >
        <Grid xs={12} md={12}>
          <strong>Edit palette settings:</strong>
        </Grid>
        <Grid
          xs={12}
          md={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            gap={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <h5 className="editPaletteLabel">Edit palette name</h5>
            <TextField
              label="Palette Name"
              value={palette.name}
              onChange={(e) => onUpdatePaletteName(e.target.value, palette.id)}
              sx={{ width: "200px" }}
            />
          </Box>
        </Grid>
        <Grid
          xs={12}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <h5 className="editPaletteLabel">Edit palette theme</h5>

            <CooldownButton generateThemeName={generateThemeName} />
            <TextField
              id="outlined-required"
              label="Current theme name"
              value={currentThemeName}
              onChange={handleThemeNameChange}
              sx={{ width: "250px" }}
            />

            <Button
              variant="outlined"
              color="success"
              sx={{ width: "250px" }}
              onClick={saveThemeName}
            >
              Save Theme Name
            </Button>
          </Box>
        </Grid>
      </Grid>
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

  const onUpdatePaletteName = (newName, id) => {
    const updatedPalettes = palettes.map((palette) => {
      if (palette.id === id) {
        return { ...palette, name: newName };
      }
      return palette;
    });
    localStorage.setItem("palettes", JSON.stringify(updatedPalettes));
    setPalettes(updatedPalettes);
  };

  const onUpdateThemeName = (newThemeName, id) => {
    const updatedPalettes = palettes.map((palette) => {
      if (palette.id === id) {
        return { ...palette, themeName: newThemeName };
      }
      return palette;
    });
    localStorage.setItem("palettes", JSON.stringify(updatedPalettes));
    setPalettes(updatedPalettes);
  };

  return (
    <div className="savedPalettesContainer">
      <h2 className="subheadingTitle">Saved Palettes</h2>
      {palettes.length === 0 ? (
        <p>No palettes saved yet.</p>
      ) : (
        [...palettes].reverse().map((palette, index) => (
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
              className="dropDownTitleContainer"
              sx={{
                padding: { xs: "0 8px", sm: "0 16px" },
              }}
            >
              <div className="dropDownTitle">
                <h3 className="paletteNameTheme">
                  {palette.name}
                  {palette.themeName !== "" && ` - ${palette.themeName} theme`}
                </h3>
                <h3 className="timeStamp">{formatDate(palette.timestamp)}</h3>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <PaletteDisplay
                palette={palette}
                onUpdatePaletteName={onUpdatePaletteName}
                onUpdateThemeName={onUpdateThemeName}
              />
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
