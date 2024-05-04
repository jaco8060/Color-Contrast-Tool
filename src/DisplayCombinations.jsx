import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Rating, Tooltip } from "@mui/material";
import tinycolor from "tinycolor2";
import "./DisplayCombinations.css";

function DisplayCombinations({ colours }) {
  const getContrastRatio = (bgColor, textColor) =>
    tinycolor.readability(bgColor, textColor).toFixed(2);
  const isReadable = (bgColor, textColor) =>
    tinycolor.isReadable(bgColor, textColor, { level: "AA", size: "small" });

  const getRating = (contrastRatio) => {
    if (contrastRatio >= 7) return 5; // AAA for normal text
    if (contrastRatio >= 4.5) return 4; // AA for normal text or AAA for large text
    if (contrastRatio >= 3) return 3; // AA for large text or for UI components
    if (contrastRatio >= 2) return 2; // Below standard, but somewhat discernible
    return 1; // Poor contrast
  };

  return (
    <div className="colourSectionContainer">
      {colours.map((bgColor, index) =>
        colours
          .filter((textColor) => textColor !== bgColor)
          .map((textColor, textIndex) => (
            <div key={textIndex} className="colourItem">
              <div
                className="colourSection"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                <h1 className="colourSectionText">
                  Background Color: {bgColor} with Text Color: {textColor}
                </h1>
              </div>
              <div className="colourMetrics">
                <div>
                  Contrast: {getContrastRatio(bgColor, textColor)}
                  <Tooltip
                    title={
                      isReadable(bgColor, textColor)
                        ? "Readable"
                        : "Not Readable"
                    }
                  >
                    {isReadable(bgColor, textColor) ? (
                      <CheckCircleIcon
                        className="readableIcon"
                        color="success"
                      />
                    ) : (
                      <CancelIcon className="notReadableIcon" color="error" />
                    )}
                  </Tooltip>
                </div>
                <Tooltip
                  title={`Contrast Ratio: ${getContrastRatio(
                    bgColor,
                    textColor
                  )}`}
                >
                  <Rating
                    name="read-only"
                    value={getRating(getContrastRatio(bgColor, textColor))}
                    readOnly
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} // Responsive font size
                  />
                </Tooltip>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export { DisplayCombinations };
