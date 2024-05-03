import "./ColourInput.css"; // Adjust the path as needed if your CSS file is located elsewhere

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, TextField } from "@mui/material";
import { useState } from "react";
function ColourInput({
  addColour,
  initialColour = "#ffffff",
  onColourChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const [color, setColor] = useState(initialColour);

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
    <form onSubmit={handleSubmit} className="formContainer">
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
        <Button variant="contained" color="primary" type="submit">
          Add Colour
        </Button>
      ) : (
        <>
          <IconButton onClick={onMoveUp} color="primary">
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton onClick={onMoveDown} color="primary">
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
