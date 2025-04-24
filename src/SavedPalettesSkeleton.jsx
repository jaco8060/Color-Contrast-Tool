// src/SavedPalettesSkeleton.jsx
import { Skeleton } from "@mui/material";
import "./SavedPalettes.css"; // For container class

export default function SavedPalettesSkeleton() {
  return (
    <div className="savedPalettesContainer" style={{ padding: "20px" }}>
      {/* Title Placeholder */}
      <Skeleton
        variant="text"
        width="35%"
        height={45}
        sx={{ margin: "1rem auto", mb: 3 }}
      />

      {/* Accordion Placeholders (Simpler) */}
      {[1, 2, 3].map((i) => (
        <div // Wrapper to control width and margin like Accordion
          key={i}
          style={{
            width: "clamp(95%, 70%, 1100px)", // Approximate width
            margin: "0 auto 12px auto", // Approximate margin
            border: "1px solid rgba(0, 0, 0, 0.12)", // Mimic border
            borderRadius: "4px", // Mimic border radius
            overflow: "hidden", // Mimic overflow behavior
          }}
        >
          {/* Summary Placeholder */}
          <Skeleton variant="rectangular" height={48} />
          {/* Details Placeholder (Just a single block) */}
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
          />
        </div>
      ))}
    </div>
  );
}
