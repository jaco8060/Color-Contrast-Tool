import Color from "colorjs.io";
import { colornames } from "./colornames.js";
import { tailwindcolors } from "./tailwindcolors.js";

// Create a color matcher using Delta E 2000
export const findNearestColor = (inputHex) => {
  try {
    const inputColor = new Color(inputHex);
    let minDeltaE = Infinity;
    let closestName = null;

    for (const [name, hex] of Object.entries(colornames)) {
      const color = new Color(hex);
      const deltaE = inputColor.deltaE2000(color);
      if (deltaE < minDeltaE) {
        minDeltaE = deltaE;
        closestName = name;
      }
    }

    return { name: closestName || "Unknown" };
  } catch (error) {
    console.error("Error finding nearest color:", error);
    return { name: "Unknown" };
  }
};

export const findNearestTailwindColor = (inputHex) => {
  try {
    const inputColor = new Color(inputHex);
    let minDeltaE = Infinity;
    let closest = null;

    for (const [name, hex] of Object.entries(tailwindcolors)) {
      const color = new Color(hex);
      const deltaE = inputColor.deltaE2000(color);
      if (deltaE < minDeltaE) {
        minDeltaE = deltaE;
        closest = { name, hex };
      }
    }

    return closest || { name: "Unknown", hex: inputHex };
  } catch (error) {
    console.error("Error finding nearest Tailwind color:", error);
    return { name: "Unknown", hex: inputHex };
  }
};
