import { useState } from "react";
import { ColourInput } from "./ColorInput";
import { DisplayCombinations } from "./DisplayCombinations";

function App() {
  const [colours, setColours] = useState([]);

  const addColour = (colour) => {
    // Ensure that the colour is valid and not already in the list
    if (tinycolor(colour).isValid() && !colours.includes(colour)) {
      setColours([...colours, colour]);
    } else {
      alert("Invalid colour or colour already added.");
    }
  };

  return (
    <div>
      <h1>Colour Palette Tester</h1>
      <ColourInput addColour={addColour} />
      {colours.length > 1 && <DisplayCombinations colours={colours} />}
    </div>
  );
}

export default App;
