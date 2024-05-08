import { findNearestColor } from "./assets/colors.jsx";

class Palette {
  constructor(
    name,
    colors,
    combinations,
    id = Date.now().toString(),
    timestamp = new Date().toISOString(),
    themeName = ""
  ) {
    this.id = id;
    this.name = name;
    this.colors = this.assignColorNames(colors); // Assign names to each color
    this.combinations = combinations;
    this.timestamp = timestamp;
    this.themeName = themeName;
  }

  // Assigns a name to each color based on its hex code using findNearestColor
  assignColorNames(colors) {
    return colors.map((color) => ({
      ...color,
      name: findNearestColor(color.hex).name, // Ensure findNearestColor returns an object with a `name` property
    }));
  }

  save() {
    console.log("Saving palette with colors:", this.colors); // Check what's being saved
    const palettes = Palette.getAllPalettes();
    palettes.push(this); // Always add a new palette
    localStorage.setItem("palettes", JSON.stringify(palettes));
  }

  static getAllPalettes() {
    return JSON.parse(localStorage.getItem("palettes")) || [];
  }

  static load(id) {
    const palettes = Palette.getAllPalettes();
    return palettes.find((palette) => palette.id === id);
  }

  static delete(id) {
    const palettes = Palette.getAllPalettes().filter(
      (palette) => palette.id !== id
    );
    localStorage.setItem("palettes", JSON.stringify(palettes));
  }
}

export default Palette;
