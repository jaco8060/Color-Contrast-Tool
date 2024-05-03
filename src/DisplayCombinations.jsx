import tinycolor from "tinycolor2";

function DisplayCombinations({ colours }) {
  const isReadable = (textColour, bgColour) => {
    // Default criteria is WCAG AA level with small text.
    return tinycolor.isReadable(textColour, bgColour, {
      level: "AA",
      size: "small",
    });
  };

  const getContrastRatio = (textColour, bgColour) => {
    return tinycolor.readability(textColour, bgColour).toFixed(2);
  };

  return (
    <div>
      {colours.map((textColour, index) => (
        <div key={index}>
          <h2 style={{ color: textColour }}>Text in {textColour}</h2>
          {colours
            .filter((bgColour) => bgColour !== textColour)
            .map((bgColour, bgIndex) => (
              <div
                key={bgIndex}
                style={{
                  backgroundColor: bgColour,
                  color: textColour,
                  padding: "10px",
                  margin: "5px",
                }}
              >
                Background: {bgColour}
                <br />
                Contrast Ratio: {getContrastRatio(textColour, bgColour)}
                <br />
                Readability: {isReadable(textColour, bgColour) ? "Yes" : "No"}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default DisplayCombinations;
