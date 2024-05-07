class Palette {
  constructor(
    name,
    colors,
    combinations,
    id = Date.now().toString(),
    timestamp = new Date().toISOString()
  ) {
    this.id = id;
    this.name = name;
    this.colors = colors;
    this.combinations = combinations;
    this.timestamp = timestamp;
  }

  save() {
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
