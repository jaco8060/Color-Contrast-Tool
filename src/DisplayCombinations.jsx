import tinycolor from "tinycolor2";

function DisplayCombinations({ colours }) {
  const getContrastRatio = (textColor, bgColor) =>
    tinycolor.readability(textColor, bgColor).toFixed(2);
  const isReadable = (textColor, bgColor) =>
    tinycolor.isReadable(textColor, bgColor, { level: "AA", size: "small" });

  return (
    <div>
      {colours.map((textColor, index) => (
        <div key={index}>
          {colours
            .filter((bgColor) => bgColor !== textColor)
            .map((bgColor, bgIndex) => (
              <div
                key={bgIndex}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  padding: "10px",
                  margin: "5px",
                }}
              >
                Text: {textColor} on {bgColor}
                <br />
                Contrast Ratio: {getContrastRatio(textColor, bgColor)}
                <br />
                Readability: {isReadable(textColor, bgColor) ? "Yes" : "No"}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
export { DisplayCombinations };
