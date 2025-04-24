// src/SavedPalettes.jsx

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useMemo, useState } from "react";
import Palette from "./Palette";
import "./SavedPalettes.css";
import { generateTheme } from "./ThemeGen";
import { findNearestTailwindColor } from "./assets/colors.jsx";
import tailwindLogo from "./assets/tailwind-logo.svg";
// Optional: Import date-fns functions if using
// import { parseISO, startOfDay, endOfDay, isValid, isAfter, isBefore } from 'date-fns';

// --- Utility Functions ---

/**
 * Determines if black or white text provides better contrast against a given hex color.
 * @param {string} hexcolor - The hex color code (e.g., "#RRGGBB").
 * @returns {"black" | "white"} - The color ("black" or "white") that provides better contrast.
 */
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

/**
 * Formats a date string into "MM-DD-YYYY HH:MM AM/PM" format.
 * @param {string | Date} dateString - The date string or Date object to format.
 * @returns {string} - The formatted date string or "Invalid Date".
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";
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

// --- Components ---

/**
 * Button that enforces a cooldown period after being clicked, typically for API calls.
 */
const CooldownButton = ({ generateThemeName }) => {
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(10); // Cooldown duration in seconds

  // Cooldown timer logic
  useEffect(() => {
    let timer;
    if (isCooldown) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime > 1) return prevTime - 1;
          clearInterval(timer);
          setIsCooldown(false);
          return 10; // Reset cooldown time
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup timer on unmount or cooldown change
  }, [isCooldown]);

  const handleButtonClick = async () => {
    setIsCooldown(true);
    try {
      await generateThemeName();
    } catch (e) {
      console.error("Error during cooldown button action:", e);
      // Optionally reset cooldown early on error, or show feedback
      // setIsCooldown(false);
      // setCooldownTime(10);
    }
  };

  return (
    <Tooltip
      placement="top"
      arrow
      title="Click to generate theme name based on color names powered by Gemini"
    >
      <span>
        {" "}
        {/* Span needed for Tooltip when Button is disabled */}
        <Button
          variant="outlined"
          color="primary"
          sx={{ width: "250px" }}
          onClick={handleButtonClick}
          disabled={isCooldown}
        >
          {isCooldown ? `Wait ${cooldownTime}s` : "Generate Theme Name (AI)"}
        </Button>
      </span>
    </Tooltip>
  );
};

/**
 * A styled MUI Switch component with a Tailwind CSS logo indicator.
 */
const TailwindSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${tailwindLogo})`,
        backgroundSize: "80%",
        filter: "none", // Show logo clearly when checked
      },
      "& + .MuiSwitch-track": { opacity: 1, backgroundColor: "#bae6fd" }, // Tailwind blue-200
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[600]
        : theme.palette.grey[300],
    width: 32,
    height: 32,
    "&::before": {
      // Default state logo (slightly faded)
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url(${tailwindLogo})`,
      backgroundSize: "80%",
      filter: "opacity(0.3)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    backgroundColor: "#38bdf8", // Tailwind sky-400
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
    borderRadius: 20 / 2,
  },
}));

/**
 * Displays the details of a single saved palette within an Accordion.
 * Allows editing palette name, theme name, viewing colors/pairings (optionally as Tailwind), and copying colors.
 */
function PaletteDisplay({ palette, onUpdatePaletteName, onUpdateThemeName }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentThemeName, setCurrentThemeName] = useState(
    palette.themeName || ""
  );
  const [showTailwind, setShowTailwind] = useState(false); // Toggle for showing nearest Tailwind colors
  const [editPaletteName, setEditPaletteName] = useState(palette.name || "");

  // Update local state if the palette prop changes (e.g., after external update)
  useEffect(() => {
    setEditPaletteName(palette.name || "");
    setCurrentThemeName(palette.themeName || "");
  }, [palette.name, palette.themeName]);

  const handleEditPaletteNameChange = (event) => {
    setEditPaletteName(event.target.value);
  };

  // Save palette name on blur if changed
  const handlePaletteNameBlur = () => {
    if (editPaletteName !== palette.name) {
      onUpdatePaletteName(editPaletteName, palette.id);
      setSnackbarMessage("Palette name updated.");
      setSnackbarOpen(true);
    }
  };

  const handleCopyColor = (color) => {
    navigator.clipboard
      .writeText(color)
      .then(() => {
        setSnackbarMessage(`Copied ${color} to clipboard!`);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setSnackbarMessage(`Failed to copy ${color}.`);
        setSnackbarOpen(true);
      });
  };

  const handleThemeNameChange = (event) => {
    setCurrentThemeName(event.target.value);
  };

  // Memoize color names for AI theme generation
  const colorNames = useMemo(
    () =>
      Array.isArray(palette.colors)
        ? palette.colors.map((color) => color.name || "Unnamed")
        : [],
    [palette.colors]
  );

  // Generate theme name using AI (external function)
  const generateThemeName = async () => {
    if (colorNames.length === 0) {
      setSnackbarMessage("Cannot generate theme name without colors.");
      setSnackbarOpen(true);
      return;
    }
    try {
      const themeName = await generateTheme(colorNames);
      setCurrentThemeName(themeName);
      setSnackbarMessage("Theme name generated! Click Save to confirm.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating theme name:", error);
      setSnackbarMessage("Failed to generate theme name.");
      setSnackbarOpen(true);
    }
  };

  // Save the current theme name (manual or AI-generated)
  const saveThemeName = () => {
    onUpdateThemeName(currentThemeName, palette.id);
    setSnackbarMessage(
      `Theme name "${currentThemeName || "(empty)"}" saved successfully!`
    );
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Memoize display combinations, converting to Tailwind if toggled
  const displayCombinations = useMemo(() => {
    const combinations = Array.isArray(palette.combinations)
      ? palette.combinations
      : [];
    if (!showTailwind) return combinations;

    // Convert hex pairs to nearest Tailwind hex pairs
    return combinations
      .map((combo) => {
        if (typeof combo !== "string" || !combo.includes("-")) return null; // Skip invalid formats
        const [bgColor, textColor] = combo.split("-");
        // Validate hex format before conversion
        if (
          !/^#[0-9A-F]{6}$/i.test(bgColor) ||
          !/^#[0-9A-F]{6}$/i.test(textColor)
        )
          return null;
        const nearestBg = findNearestTailwindColor(bgColor).hex;
        const nearestText = findNearestTailwindColor(textColor).hex;
        return `${nearestBg}-${nearestText}`;
      })
      .filter(Boolean); // Remove nulls from invalid entries
  }, [palette.combinations, showTailwind]);

  // Memoize the list of colors to display
  const colorsToDisplay = useMemo(
    () => (Array.isArray(palette.colors) ? palette.colors : []),
    [palette.colors]
  );

  return (
    <div>
      {/* Color Palette Display Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <strong>Color palette:</strong>
        <Tooltip title="Toggle to show Tailwind colors" placement="top" arrow>
          <FormControlLabel
            control={
              <TailwindSwitch
                checked={showTailwind}
                onChange={() => setShowTailwind(!showTailwind)}
                aria-label="Toggle Tailwind colors"
              />
            }
            label="Tailwind"
            labelPlacement="start"
            sx={{ mr: 0 }} // Reduce margin right
          />
        </Tooltip>
      </div>
      <Grid container spacing={1} mb={2}>
        {colorsToDisplay.map((color, index) => {
          // Basic validation for color object and hex code
          if (
            !color ||
            typeof color.hex !== "string" ||
            !/^#[0-9A-F]{6}$/i.test(color.hex)
          )
            return null; // Skip rendering invalid color data

          // Determine display color (original or nearest Tailwind)
          const displayColor = showTailwind
            ? findNearestTailwindColor(color.hex) // Returns { name, hex }
            : { name: color.name || "Unnamed", hex: color.hex };

          return (
            <Grid xs={6} sm={4} md={3} key={color.id || index} mt={1}>
              <Tooltip
                title={`Click to copy ${displayColor.hex}`}
                placement="top"
                arrow
              >
                <div
                  style={{
                    width: "100%",
                    backgroundColor: displayColor.hex,
                    color: getContrastYIQ(displayColor.hex), // Ensure text contrast
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")} // Hover effect
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={() => handleCopyColor(displayColor.hex)}
                  className="paletteColor" // For CSS styling (e.g., height, border-radius)
                >
                  <div className="colorGroup">
                    <IconButton
                      className="copyIcon" // Show on hover via CSS
                      sx={{ color: "inherit", display: "none", padding: "0" }}
                      aria-label={`Copy ${displayColor.hex}`}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                    <h3>{displayColor.hex}</h3> <h4>{displayColor.name}</h4>
                  </div>
                </div>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      {/* Selected Pairings Display Section */}
      <div className="colorCombos">
        <strong>Selected Pairings:</strong>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          {displayCombinations.length === 0 ? (
            <h5>No selected pairings</h5>
          ) : (
            displayCombinations.map((combo, index) => {
              const [bgColor, textColor] = combo.split("-");
              // Validate hex format again (important if source data could be inconsistent)
              if (
                !/^#[0-9A-F]{6}$/i.test(bgColor) ||
                !/^#[0-9A-F]{6}$/i.test(textColor)
              )
                return null;
              return (
                <div
                  key={index}
                  style={{
                    padding: 0,
                    borderRadius: "4px",
                    overflow: "hidden", // Ensure background respects border radius
                  }}
                >
                  <div
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      padding: "8px 16px",
                      fontWeight: "600",
                      fontSize: "clamp(0.7rem, 2vw, 0.85rem)", // Responsive font size
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`Bg: ${bgColor} / Txt: ${textColor}`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Palette Settings Section */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ marginBottom: 4 }}
      >
        <Grid xs={12}>
          <strong>Edit palette settings:</strong>
        </Grid>
        {/* Edit Palette Name */}
        <Grid xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <h5 className="editPaletteLabel">Edit palette name</h5>
            <TextField
              label="Palette Name"
              value={editPaletteName}
              onChange={handleEditPaletteNameChange}
              onBlur={handlePaletteNameBlur} // Save on blur
              sx={{ width: "200px" }}
              size="small"
              variant="standard"
            />
          </div>
        </Grid>
        {/* Edit Palette Theme */}
        <Grid
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h5 className="editPaletteLabel">Edit palette theme</h5>
            <CooldownButton generateThemeName={generateThemeName} />
            <TextField
              label="Current theme name"
              value={currentThemeName}
              onChange={handleThemeNameChange}
              sx={{ width: "250px" }}
              size="small"
              variant="standard"
              placeholder="e.g., Autumn Harvest"
            />
            <Button
              variant="outlined"
              color="success"
              sx={{ width: "250px" }}
              onClick={saveThemeName}
              disabled={currentThemeName === (palette.themeName || "")} // Disable if unchanged
            >
              Save Theme Name
            </Button>
          </div>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.startsWith("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

/**
 * Main component to display, filter, and manage saved palettes.
 * Fetches palettes from storage, provides filtering (search, date), pagination,
 * and allows loading or deleting palettes.
 */
function SavedPalettes({
  lastUpdate, // Prop to trigger re-fetch when palettes might have changed elsewhere
  onLoadPalette, // Callback function to load a selected palette into the main tool
  setCurrentPaletteIndex, // Function to update the currently viewed palette ID (if applicable)
  currentPaletteIndex, // ID of the currently viewed palette (if applicable)
}) {
  const [palettes, setPalettes] = useState([]); // All loaded palettes
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [palettesPerPage, setPalettesPerPage] = useState(10); // Default items per page
  const [showFilters, setShowFilters] = useState(false); // Toggle visibility of filter controls

  // Load palettes from storage on initial mount and when lastUpdate changes
  useEffect(() => {
    loadPalettes();
  }, [lastUpdate]);

  // Fetches palettes from Palette class (local storage wrapper), validates, sorts, and updates state
  const loadPalettes = () => {
    const storedPalettes = Palette.getAllPalettes();
    // Ensure palettes have required structure
    const validPalettes = storedPalettes.filter(
      (p) => p && p.id && Array.isArray(p.colors)
    );
    // Sort by timestamp descending (newest first)
    const sortedPalettes = validPalettes.sort(
      (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );
    setPalettes(sortedPalettes);
    setCurrentPage(1); // Reset to first page whenever palettes are reloaded
  };

  // Deletes a palette by ID and reloads the list
  const deletePalette = (id) => {
    Palette.delete(id);
    loadPalettes(); // Reload list (also resets page via loadPalettes)
    // If the deleted palette was the 'current' one, clear the index
    if (currentPaletteIndex === id) setCurrentPaletteIndex(null);
  };

  // Updates the name of a specific palette in state and storage
  const handleUpdatePaletteName = (newName, id) => {
    const updatedPalettes = palettes.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );
    // Persist change (assuming Palette class doesn't handle updates directly)
    localStorage.setItem("palettes", JSON.stringify(updatedPalettes));
    setPalettes(updatedPalettes); // Update local state to reflect change immediately
  };

  // Updates the theme name of a specific palette in state and storage
  const handleUpdateThemeName = (newThemeName, id) => {
    const updatedPalettes = palettes.map((p) =>
      p.id === id ? { ...p, themeName: newThemeName } : p
    );
    // Persist change
    localStorage.setItem("palettes", JSON.stringify(updatedPalettes));
    setPalettes(updatedPalettes); // Update local state
  };

  // Memoized filtering logic based on search query and date range
  const filteredPalettes = useMemo(() => {
    let results = palettes;

    // Apply search query filter (checks name and themeName)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        (palette) =>
          palette.name?.toLowerCase().includes(lowerCaseQuery) ||
          palette.themeName?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply date range filter
    // Ensure dates are parsed correctly at the start/end of the day
    const sDate = startDate ? new Date(startDate + "T00:00:00") : null;
    const eDate = endDate ? new Date(endDate + "T23:59:59.999") : null;

    if ((sDate && !isNaN(sDate)) || (eDate && !isNaN(eDate))) {
      results = results.filter((palette) => {
        if (!palette.timestamp) return false; // Skip palettes without timestamp
        const paletteDate = new Date(palette.timestamp);
        if (isNaN(paletteDate)) return false; // Skip invalid timestamps

        const afterStart = sDate ? paletteDate >= sDate : true; // True if no start date
        const beforeEnd = eDate ? paletteDate <= eDate : true; // True if no end date
        return afterStart && beforeEnd;
      });
    }

    return results;
  }, [palettes, searchQuery, startDate, endDate]);

  // Effect to reset page number if filters/page size change results in invalid page
  useEffect(() => {
    const totalPages = Math.ceil(filteredPalettes.length / palettesPerPage);
    // If current page is beyond the new total pages, reset to page 1
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    } else if (filteredPalettes.length === 0 && currentPage !== 1) {
      // If filters result in no items, reset to page 1
      setCurrentPage(1);
    }
    // Dependencies: Recalculate when filtered results, page size, or current page changes
  }, [filteredPalettes, palettesPerPage, currentPage]);

  // --- Pagination Calculation ---
  const indexOfLastPalette = currentPage * palettesPerPage;
  const indexOfFirstPalette = indexOfLastPalette - palettesPerPage;
  // Slice the filtered palettes for the current page display
  const currentPalettesToDisplay = filteredPalettes.slice(
    indexOfFirstPalette,
    indexOfLastPalette
  );
  const totalPages = Math.ceil(filteredPalettes.length / palettesPerPage);

  // --- Event Handlers ---
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setCurrentPage(1); // Reset page on search change (handled by useEffect now)
  };
  const clearSearch = () => {
    setSearchQuery("");
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const clearStartDate = () => {
    setStartDate("");
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const clearEndDate = () => {
    setEndDate("");
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const clearAllFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setShowFilters(false); // Optionally hide filters when cleared
    // setCurrentPage(1); // Reset page (handled by useEffect now)
  };
  const handlePalettesPerPageChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPalettesPerPage(newSize);
    // setCurrentPage(1); // Reset page when size changes (handled by useEffect now)
  };

  return (
    <div className="savedPalettesContainer">
      <h2 className="subheadingTitle">Saved Palettes</h2>

      {/* Filter Section Toggle Button */}
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setShowFilters(!showFilters)}
        sx={{ mb: 2 }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Filters Container - Conditionally rendered */}
      {showFilters && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" }, // Stack on small, row on large
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "4px",
            width: { xs: "95%", sm: "85%", md: "75%", lg: "65%" }, // Responsive width
            maxWidth: "1100px",
            mx: "auto", // Center the box
          }}
        >
          {/* Search Input */}
          <TextField
            label="Search Name/Theme"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: { xs: "100%", md: "auto" }, flexGrow: { md: 1 } }} // Full width on xs, auto/grow on md+
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && ( // Show clear button only if there's text
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={clearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Start Date Input */}
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            size="small"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }} // Keep label floated
            sx={{ width: { xs: "100%", md: "auto" } }} // Full width on xs, auto on md+
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon />
                </InputAdornment>
              ),
              endAdornment: startDate && ( // Show clear button only if date is selected
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear start date"
                    onClick={clearStartDate}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* End Date Input */}
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            size="small"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: "100%", md: "auto" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon />
                </InputAdornment>
              ),
              endAdornment: endDate && ( // Show clear button only if date is selected
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear end date"
                    onClick={clearEndDate}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Palettes Per Page Selector */}
          <FormControl
            size="small"
            sx={{ width: { xs: "100%", md: "auto" }, minWidth: 120 }} // Full width on xs, fixed min-width on md+
          >
            <InputLabel id="palettes-per-page-label">Items/Page</InputLabel>
            <Select
              labelId="palettes-per-page-label"
              id="palettes-per-page-select"
              value={palettesPerPage}
              label="Items/Page"
              onChange={handlePalettesPerPageChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          {/* Clear All Filters Button */}
          <Button
            variant="text"
            onClick={clearAllFilters}
            size="small"
            disabled={!searchQuery && !startDate && !endDate} // Disable if no filters are active
            sx={{ width: { xs: "100%", md: "auto" }, mt: { xs: 1, md: 0 } }} // Full width on xs, auto on md+
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Palette List Display */}
      {palettes.length === 0 ? (
        <p>No palettes saved yet.</p>
      ) : filteredPalettes.length === 0 ? (
        // Message shown when filters yield no results
        <p>
          No palettes match your current filters
          {searchQuery && ` (search: "${searchQuery}")`}
          {startDate && ` (from: ${startDate})`}
          {endDate && ` (to: ${endDate})`}.
        </p>
      ) : (
        // Render the list of palettes for the current page
        <>
          {currentPalettesToDisplay.map((palette) => (
            <Accordion
              key={palette.id}
              sx={{
                width: { xs: "95%", sm: "85%", md: "75%", lg: "65%" }, // Responsive width
                maxWidth: "1100px",
                margin: "0 auto 12px auto", // Center accordion
                mb: 1.5,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${palette.id}-content`}
                id={`panel-${palette.id}-header`}
                sx={{ padding: { xs: "0 8px", sm: "0 16px" } }} // Responsive padding
              >
                {/* Accordion Title: Palette Name/Theme and Timestamp */}
                <div className="dropDownTitle">
                  <h3 className="paletteNameTheme">
                    {palette.name || "Untitled Palette"}
                    {palette.themeName ? ` - ${palette.themeName}` : ""}
                  </h3>
                  <h3 className="timeStamp">{formatDate(palette.timestamp)}</h3>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Display Palette Details (Colors, Pairings, Edit controls) */}
                <PaletteDisplay
                  palette={palette}
                  onUpdatePaletteName={handleUpdatePaletteName}
                  onUpdateThemeName={handleUpdateThemeName}
                />
                {/* Action Buttons: Load and Delete */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onLoadPalette(palette.id)} // Trigger load action passed via props
                  >
                    Load Palette & Go Home
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deletePalette(palette.id)} // Trigger delete action
                  >
                    Delete Palette
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Pagination Controls - Show only if more than one page */}
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }} // Center pagination
            />
          )}
        </>
      )}
    </div>
  );
}

export default SavedPalettes;
