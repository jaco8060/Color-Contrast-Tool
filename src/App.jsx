import { useState } from "react";
// import tinycolor from "tinycolor2";
import { ColourInput } from "./ColorInput";
import { DisplayCombinations } from "./DisplayCombinations";
function App() {
  const [colours, setColours] = useState([]);

  const addColour = (colour) => {
    if (!colours.includes(colour) && /^#[0-9A-F]{6}$/i.test(colour)) {
      setColours([...colours, colour]);
    } else {
      alert("Please select a valid colour that has not been added yet.");
    }
  };

  return (
    <div>
      <h1>Colour Palette Tester</h1>
      <ColourInput addColour={addColour} />
      {colours.length > 0 && <DisplayCombinations colours={colours} />}
    </div>
  );
}

export default App;
