// ImageColorExtractor.jsx
import { Button } from "@mui/material";
import { Palette } from "color-thief-react";
import { useRef, useState } from "react";
import { CirclePicker } from "react-color";
import "./ImageColorExtractor.css";
function ImageColorExtractor({ onAddColor, onAddPalette }) {
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger file input click when button is clicked
  };
  return (
    <>
      <div className="uploadImgContainer">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleButtonClick}
          className="uploadButton"
        >
          Upload Image
        </Button>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: "none" }} // Hide the file input
        />
        {/* Material-UI button that triggers the file input */}
        {imageSrc && (
          <>
            <img src={imageSrc} alt="Uploaded" />
            <Palette src={imageSrc} colorCount={12} format="hex" quality={1}>
              {({ data, loading, error }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>There was an error loading the image.</p>;
                const dataSet = [...new Set(data)];
                return (
                  <div className="inputGroup">
                    <CirclePicker
                      colors={dataSet}
                      circleSize={33}
                      circleSpacing={8}
                      onChangeComplete={(color) => onAddColor(color.hex)} // Add selected color to state
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onAddPalette(dataSet)} // Directly use the onReset prop
                    >
                      Export Palette
                    </Button>
                  </div>
                );
              }}
            </Palette>
          </>
        )}
      </div>
    </>
  );
}

export default ImageColorExtractor;
