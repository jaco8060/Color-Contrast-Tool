import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Typography from "@mui/material/Typography";

import "./SavedPalettes.css";

import { useEffect, useState } from "react";

function SavedPalettes({ lastUpdate }) {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    setPalettes(JSON.parse(localStorage.getItem("palettes")) || []);
  }, [lastUpdate]); // Dependency on lastUpdate triggers re-fetch
  return (
    <div className="savedPalettesContainer">
      <h2 className="subheadingTitle">Saved Palettes</h2>
      {palettes.map((palette, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <h3>
              Palette {index + 1} - Saved on {palette.timestamp}
            </h3>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <strong>Colors: </strong>
              {palette.colors.map((color) => color.hex).join(", ")}
            </div>
            <div>
              <strong>Selected Pairings: </strong>
              {palette.combinations.join(", ")}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default SavedPalettes;
