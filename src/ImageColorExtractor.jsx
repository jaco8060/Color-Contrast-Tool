// ImageColorExtractor.jsx
import { Palette } from "color-thief-react";
import { useState } from "react";
import { CirclePicker } from "react-color";

function ImageColorExtractor({ onAddColor, onAddPalette }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded"
          style={{ maxWidth: "100%", maxHeight: "300px" }}
        />
      )}
      {imageSrc && (
        <Palette src={imageSrc} colorCount={5} format="hex">
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>There was an error loading the image.</p>;
            return (
              <div>
                <CirclePicker
                  colors={data}
                  circleSize={28}
                  circleSpacing={14}
                  onSwatchHover={(color, event) => event.stopPropagation()} // Prevent hover events
                  onChangeComplete={(color) => onAddColor(color.hex)} // Add selected color to state
                />
                <button onClick={() => onAddPalette(data)}>
                  Export Palette
                </button>
              </div>
            );
          }}
        </Palette>
      )}
    </div>
  );
}

export default ImageColorExtractor;
