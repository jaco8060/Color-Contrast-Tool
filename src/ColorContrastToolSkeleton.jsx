// src/ColorContrastToolSkeleton.jsx
import { Skeleton } from "@mui/material";
import "./App.css"; // For basic container layout if needed
import "./ColourInput.css"; // For form container spacing if needed
import "./ImageColorExtractor.css"; // For image extractor spacing if needed
import "./DisplayCombinations.css"; // For display combinations spacing if needed

export default function ColorContrastToolSkeleton() {
  return (
    <>
      {/* Header Placeholder */}
      <div
        className="headerContainer"
        style={{ padding: "1rem", borderBottom: "1px solid transparent" }}
      >
        {" "}
        {/* Maintain approx height */}
        <Skeleton
          variant="text"
          width="50%"
          height={40}
          sx={{ margin: "0 auto" }}
        />
      </div>

      <div className="mainContainer">
        {/* Image Extractor Placeholder */}
        <div
          className="uploadImgContainer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Skeleton
            variant="rectangular"
            width={200}
            height={40}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            height={250}
            sx={{ width: "80%", maxWidth: "500px", borderRadius: "4px" }}
          />
        </div>

        {/* Colour Inputs Placeholder (fewer details) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={50}
              width="80%"
              sx={{ maxWidth: "500px", borderRadius: "4px" }}
            />
          ))}
          {/* Add/Reset Row Placeholder */}
          <Skeleton
            variant="rectangular"
            height={50}
            width="80%"
            sx={{ maxWidth: "500px", borderRadius: "4px" }}
          />
        </div>

        {/* Color Pairings Placeholder */}
        <Skeleton
          variant="text"
          width="30%"
          height={35}
          sx={{ margin: "1.5rem auto 0.5rem auto" }}
        />
        <div className="colorPairingOptions" style={{ marginBottom: "1rem" }}>
          <Skeleton
            variant="rectangular"
            height={40}
            width={90}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            height={40}
            width={90}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            height={40}
            width={130}
            sx={{ borderRadius: "4px" }}
          />
        </div>
        <div className="colourSectionContainer">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={50}
              width="90%"
              sx={{ maxWidth: "600px", borderRadius: "4px", mb: 1 }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
