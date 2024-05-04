import "./ColourInput.css"; // Adjust the path as needed if your CSS file is located elsewhere

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Button, IconButton, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

function ColourInput({
  label,
  addColour,
  initialColour = "#ffffff",
  onColourChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onReset,
  onToggleSticky,
  isSticky,
}) {
  const [color, setColor] = useState(initialColour);
  const theme = useTheme(); // Access the theme

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor); // Update the local state

    if (onColourChange) {
      onColourChange(newColor); // Propagate the change upwards if an onColourChange handler is provided
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (addColour) {
      addColour({ hex: color });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`formContainer ${isSticky ? "sticky" : ""}`}
      style={{
        backgroundColor: isSticky
          ? theme.palette.background.paper
          : "transparent",
      }}
      // set the form to be sticky if lock is selected
    >
      {!addColour && (
        <IconButton onClick={onToggleSticky} color="default">
          {isSticky ? <LockIcon /> : <LockOpenIcon />}
        </IconButton>
      )}
      <span className="colorLabel">{label}</span>
      <TextField
        type="color"
        value={color}
        onChange={handleColorChange}
        variant="outlined"
        size="small"
        className="colorInput"
      />
      <TextField
        value={color.toUpperCase()}
        onChange={handleColorChange}
        variant="standard"
        size="small"
        inputProps={{ maxLength: 7 }}
        className="hexInput"
      />
      {addColour ? (
        <>
          <Button variant="contained" color="primary" type="submit">
            Add Color
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onReset} // Directly use the onReset prop
          >
            Reset Colors
          </Button>
        </>
      ) : (
        <>
          <IconButton
            onClick={onMoveUp}
            color="primary"
            sx={{
              minWidth: 0, // Overriding the minimum width
              width: { xs: 15, sm: 20 }, // Responsive widths
            }}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            onClick={onMoveDown}
            color="primary"
            sx={{
              minWidth: 0, // Overriding the minimum width
              width: { xs: 15, sm: 20 }, // Responsive widths
            }}
          >
            <ArrowDownwardIcon />
          </IconButton>
          <IconButton onClick={onRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </form>
  );
}

export { ColourInput };
