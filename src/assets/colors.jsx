import nearestColor from "nearest-color";
import { colornames } from "./colornames.js";

// Create a color matcher
const findNearestColor = nearestColor.from(colornames);

export { findNearestColor };
