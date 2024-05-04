import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Rating, Tooltip } from "@mui/material";
import { memo } from "react";
import tinycolor from "tinycolor2";
import "./DisplayCombinations.css";

const DisplayCombinationItem = memo(({ bgColor, textColor }) => {
  const contrastRatio = tinycolor.readability(bgColor, textColor).toFixed(2);
  const readable = contrastRatio >= 4.5;

  const getRating = (contrastRatio) => {
    if (contrastRatio >= 7) return 5;
    if (contrastRatio >= 4.5) return 4;
    if (contrastRatio >= 3) return 3;
    if (contrastRatio >= 2) return 2;
    return 1;
  };

  return (
    <div className="colourItem">
      <div
        className="colourSection"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <h1 className="colourSectionText">
          Background Color: {bgColor} with Text Color: {textColor}
        </h1>
      </div>
      <div className="colourMetrics">
        <div>
          Contrast: {contrastRatio}
          <Tooltip title={readable ? "Readable" : "Not Readable"}>
            {readable ? (
              <CheckCircleIcon className="readableIcon" color="success" />
            ) : (
              <CancelIcon className="notReadableIcon" color="error" />
            )}
          </Tooltip>
        </div>
        <Tooltip title={`Contrast Ratio: ${contrastRatio}`}>
          <Rating
            name="read-only"
            value={getRating(contrastRatio)}
            readOnly
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          />
        </Tooltip>
      </div>
    </div>
  );
});
DisplayCombinationItem.displayName = "DisplayCombinationItem"; // Set display name

function DisplayCombinations({ colours }) {
  return (
    <div className="colourSectionContainer">
      {colours.map((bgColor, index) =>
        colours
          .filter((textColor) => textColor !== bgColor)
          .map((textColor, textIndex) => (
            <DisplayCombinationItem
              key={textIndex}
              bgColor={bgColor}
              textColor={textColor}
            />
          ))
      )}
    </div>
  );
}

export { DisplayCombinations };
