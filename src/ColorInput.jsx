import { useState } from "react";

function ColourInput({ addColour }) {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    addColour(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a colour (e.g., #ff0000)"
      />
      <button type="submit">Add Colour</button>
    </form>
  );
}

export default ColourInput;
