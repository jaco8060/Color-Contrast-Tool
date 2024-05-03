import { useState } from "react";
function ColourInput({ addColour }) {
  const [inputColor, setInputColor] = useState("#ffffff"); // Default color

  const handleSubmit = (event) => {
    event.preventDefault();
    addColour(inputColor);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <input
        type="color"
        value={inputColor}
        onChange={(e) => setInputColor(e.target.value)}
      />
      <button type="submit">Add Colour</button>
    </form>
  );
}

export { ColourInput };
