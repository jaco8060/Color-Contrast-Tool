import { useState } from "react";
// import tinycolor from "tinycolor2";
import { ColourInput } from "./ColorInput";
import { DisplayCombinations } from "./DisplayCombinations";

function App() {
  const [colours, setColours] = useState([]);

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
      alert("Please select a valid colour that has not been added yet.");
    }
  };

  const updateColour = (id, newHex) => {
    setColours(
      colours.map((colour) =>
        colour.id === id ? { ...colour, hex: newHex } : colour
      )
    );
  };

  return (
    <div>
      <h1>Colour Palette Tester</h1>
      {colours.map((colour) => (
        <ColourInput
          key={colour.id}
          initialColour={colour.hex}
          onColourChange={(newHex) => updateColour(colour.id, newHex)}
        />
      ))}
      <ColourInput addColour={addColour} />
      {colours.length > 1 && (
        <DisplayCombinations colours={colours.map((col) => col.hex)} />
      )}
    </div>
  );
}
export default App;
