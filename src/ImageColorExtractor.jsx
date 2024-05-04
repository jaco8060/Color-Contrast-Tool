// ImageColorExtractor.jsx
import { Palette } from "color-thief-react";
import { useState } from "react";

function ImageColorExtractor() {
  const [imageSrc, setImageSrc] = useState(null); // State to hold the uploaded image URL

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
              <div style={{ display: "flex", marginTop: "10px" }}>
                {data.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: color,
                      width: 100,
                      height: 100,
                      margin: 10,
                    }}
                  />
                ))}
              </div>
            );
          }}
        </Palette>
      )}
    </div>
  );
}

export default ImageColorExtractor;
