import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Tooltip } from "@mui/material";
import React from "react";
import tinycolor from "tinycolor2";
import "./DisplayCombinations.css";

function DisplayCombinations({ colours }) {
  const getContrastRatio = (textColor, bgColor) =>
    tinycolor.readability(textColor, bgColor).toFixed(2);
  const isReadable = (textColor, bgColor) =>
    tinycolor.isReadable(textColor, bgColor, { level: "AA", size: "small" });

  return (
    <div className="colourSectionContainer">
      {colours.map((textColor, index) =>
        colours
          .filter((bgColor) => bgColor !== textColor)
          .map((bgColor, bgIndex) => (
            <div key={bgIndex} className="colourItem">
              <div
                className="colourSection"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                <h1 className="colourSectionText">
                  Text Color: {textColor} on Background Color: {bgColor}
                </h1>
              </div>
              <div className="colourMetrics">
                <div>
                  Contrast Ratio: {getContrastRatio(textColor, bgColor)}
                  <Tooltip
                    title={
                      isReadable(textColor, bgColor)
                        ? "Readable"
                        : "Not Readable"
                    }
                  >
                    {isReadable(textColor, bgColor) ? (
                      <CheckCircleIcon
                        className="readableIcon"
                        color="success"
                      />
                    ) : (
                      <CancelIcon className="notReadableIcon" color="error" />
                    )}
                  </Tooltip>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export { DisplayCombinations };
