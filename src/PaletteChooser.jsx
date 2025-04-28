import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import tinycolor from "tinycolor2";
import Palette from "./Palette"; // Adjust path if different
import "./PaletteChooser.css";
import MockupLayout from "./MockupLayout";

// Define website types and their recommended brand colors
const websiteBrandColors = {
  "Corporate/Tech": {
    color: "#4A90E2",
    description: "Bluish color for trust and professionalism",
  },
  "E-commerce/Food": {
    color: "#E74C3C",
    description: "Reddish color to stimulate appetite and urgency",
  },
  "Creative/Art": {
    color: "#8E44AD",
    description: "Purplish color for creativity and imagination",
  },
  "Health/Fitness": {
    color: "#2ECC71",
    description: "Greenish color for health and vitality",
  },
  "Education/Nonprofit": {
    color: "#3498DB",
    description: "Bluish color for trust and calm",
  },
  "Travel/Tourism": {
    color: "#20B2AA",
    description: "Teal for adventure and relaxation",
  },
  "Real Estate": {
    color: "#8B4513",
    description: "Brown for stability and growth",
  },
  Automotive: {
    color: "#FF4500",
    description: "Orange for energy and technology",
  },
  "Fashion/Beauty": {
    color: "#FF69B4",
    description: "Pink for trendiness and luxury",
  },
  "Gaming/Entertainment": {
    color: "#FF0000",
    description: "Red for excitement and action",
  },
  "Finance/Banking": {
    color: "#00008B",
    description: "Dark blue for trust and wealth",
  },
  "Healthcare/Medical": {
    color: "#008000",
    description: "Green for health and urgency",
  },
  "Education/Training": {
    color: "#4169E1",
    description: "Royal blue for knowledge and creativity",
  },
  "Nonprofit/Charity": {
    color: "#87CEEB",
    description: "Sky blue for hope and compassion",
  },
};

// Define options for dropdowns
const websiteTypes = Object.keys(websiteBrandColors);
const harmonies = ["Monochromatic", "Analogous", "Complementary", "Triadic"];
const backgroundOptions = [
  {
    color: "#F5F5F5",
    name: "Light Gray",
    tip: "Choose for a clean, modern look; ideal for corporate or tech sites with high text readability.",
  },
  {
    color: "#FAFAFA",
    name: "Off-White",
    tip: "Use for a soft, neutral backdrop; perfect for e-commerce or creative sites to avoid starkness.",
  },
  {
    color: "#FFFFFF",
    name: "White",
    tip: "Select for a crisp, professional feel; suits any industry but ensure high text contrast.",
  },
  {
    color: "#F0F8FF",
    name: "Light Blue",
    tip: "Pick for a calm, trustworthy vibe; great for finance or education sites with subtle color.",
  },
  {
    color: "#F0FFF0",
    name: "Light Green",
    tip: "Opt for a fresh, vibrant feel; works well for health or nonprofit sites with a lively tone.",
  },
  {
    color: "#F5F5DC",
    name: "Warm Beige",
    tip: "Choose for warmth and approachability; ideal for travel or nonprofit sites to evoke comfort.",
  },
  {
    color: "#D3D3D3",
    name: "Cool Gray",
    tip: "Use for a sleek, professional look; suits tech or corporate sites with modern aesthetics.",
  },
  {
    color: "#FFFFF0",
    name: "Soft Ivory",
    tip: "Select for a luxurious, soft feel; perfect for fashion or beauty sites to convey elegance.",
  },
  {
    color: "#E6E9F0",
    name: "Slate Blue",
    tip: "Pick for subtle trust and calm; great for medical or education sites with a cool tone.",
  },
  {
    color: "#E8E3D9",
    name: "Taupe",
    tip: "Opt for an organic, grounded feel; ideal for real estate or food sites to suggest stability.",
  },
];

function PaletteChooser({ addColoursFromPalette }) {
  const [activeStep, setActiveStep] = useState(0);
  const [websiteType, setWebsiteType] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentHarmony, setAccentHarmony] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [highlightHarmony, setHighlightHarmony] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const [paletteName, setPaletteName] = useState("");
  const navigate = useNavigate();

  // Get recommended brand color based on website type
  const recommendedBrandColor = useMemo(() => {
    if (!websiteType) return null;
    return websiteBrandColors[websiteType];
  }, [websiteType]);

  // Generate preview palette
  const palette = useMemo(() => {
    const colors = {};
    if (backgroundColor) colors.Background = backgroundColor;
    if (primaryColor) colors.Primary = primaryColor;
    if (accentColor) colors.Accent = accentColor;
    if (highlightColor) colors.Highlight = highlightColor;
    if (backgroundColor) {
      const textOptions = [tinycolor("#333333"), tinycolor("#FFFFFF")];
      colors.Text = tinycolor
        .mostReadable(tinycolor(backgroundColor), textOptions)
        .toHexString();
    }
    return colors;
  }, [backgroundColor, primaryColor, accentColor, highlightColor]);

  // Generate suggested colors for Accent based on harmony
  const suggestedAccentColors = useMemo(() => {
    if (!primaryColor || !accentHarmony) return [];
    const color = tinycolor(primaryColor);
    let suggestions = [];
    switch (accentHarmony) {
      case "Monochromatic":
        suggestions = [
          color.clone().darken(30).toHexString(),
          color.clone().darken(15).toHexString(),
          color.clone().lighten(15).toHexString(),
          color.clone().lighten(30).toHexString(),
          color.clone().saturate(10).toHexString(),
        ];
        break;
      case "Analogous":
        const analogous = color.analogous(5, 30); // Increase to 5 slices
        suggestions = analogous.slice(1).map((c) => c.toHexString());
        break;
      case "Complementary":
        const complement = color.complement();
        suggestions = [
          complement.toHexString(),
          complement.clone().lighten(15).toHexString(),
          complement.clone().darken(15).toHexString(),
        ];
        break;
      case "Triadic":
        const triadic = color.triad();
        suggestions = [
          ...triadic.slice(1).map((c) => c.toHexString()),
          triadic[1].clone().lighten(15).toHexString(),
          triadic[2].clone().lighten(15).toHexString(),
        ];
        break;
      default:
        suggestions = [];
    }
    return suggestions;
  }, [primaryColor, accentHarmony]);

  // Generate suggested colors for Highlight based on harmony
  const suggestedHighlightColors = useMemo(() => {
    if (!primaryColor || !highlightHarmony) return [];
    const color = tinycolor(primaryColor);
    let suggestions = [];
    switch (highlightHarmony) {
      case "Monochromatic":
        suggestions = [
          color.clone().lighten(20).toHexString(),
          color.clone().lighten(35).toHexString(),
          color.clone().lighten(50).toHexString(),
          color.clone().brighten(10).toHexString(),
          color.clone().desaturate(10).toHexString(),
        ];
        break;
      case "Analogous":
        const analogous = color.analogous(5, 30); // Increase to 5 slices
        suggestions = analogous.slice(1).map((c) => c.toHexString());
        break;
      case "Complementary":
        const complement = color.complement();
        suggestions = [
          complement.clone().lighten(20).toHexString(),
          complement.clone().lighten(10).toHexString(),
          complement.clone().darken(10).toHexString(),
        ];
        break;
      case "Triadic":
        const triadic = color.triad();
        suggestions = [
          ...triadic.slice(1).map((c) => c.toHexString()),
          triadic[1].clone().lighten(20).toHexString(),
          triadic[2].clone().lighten(20).toHexString(),
        ];
        break;
      default:
        suggestions = [];
    }
    return suggestions;
  }, [primaryColor, highlightHarmony]);

  const handleNext = () => {
    if (activeStep === 0 && !websiteType) {
      alert("Please select a website type.");
      return;
    }
    if (activeStep === 1 && !backgroundColor) {
      alert("Please select a background color.");
      return;
    }
    if (activeStep === 2 && !primaryColor) {
      alert("Please select a primary color.");
      return;
    }
    if (activeStep === 3 && (!accentHarmony || !accentColor)) {
      alert("Please select an accent harmony and color.");
      return;
    }
    if (activeStep === 4 && (!highlightHarmony || !highlightColor)) {
      alert("Please select a highlight harmony and color.");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSavePalette = () => {
    if (Object.keys(palette).length === 5 && paletteName) {
      const newPalette = new Palette(
        paletteName,
        [
          { hex: backgroundColor },
          { hex: primaryColor },
          { hex: accentColor },
          { hex: highlightColor },
          { hex: palette.Text },
        ],
        [],
        Date.now().toString(),
        new Date().toISOString(),
        ""
      );
      newPalette.save();
      navigate("/saved-palettes");
    }
  };

  const handlePaletteColorChange = (key, value) => {
    switch (key) {
      case "Background":
        setBackgroundColor(value);
        break;
      case "Primary":
        setPrimaryColor(value);
        break;
      case "Accent":
        setAccentColor(value);
        break;
      case "Highlight":
        setHighlightColor(value);
        break;
      default:
        break;
    }
  };

  const steps = [
    {
      label: "Select Website Type",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Choose the type of website to get a recommended brand color. This
            sets the foundation for your palette.
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Website Type</InputLabel>
            <Select
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value)}
              label="Website Type"
            >
              {websiteTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {recommendedBrandColor && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Recommended Brand Color: {recommendedBrandColor.description} (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  backgroundColor: recommendedBrandColor.color,
                  verticalAlign: "middle",
                  mr: 1,
                }}
              />
              {recommendedBrandColor.color})
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: Choose a website type that aligns with your industry.
            Colors like blue for finance convey trust, while reds for food
            stimulate appetite. This sets the emotional tone for your palette.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Choose Background Color (60%)",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select a neutral or low-saturation background color that sets the
            overall tone (60% of the design).
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Background Color</InputLabel>
            <Select
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              label="Background Color"
              renderValue={(selected) => {
                const option = backgroundOptions.find(
                  (opt) => opt.color === selected
                );
                return (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: selected,
                        mr: 1,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                    {option ? option.name : ""}
                  </Box>
                );
              }}
            >
              {backgroundOptions.map((opt) => (
                <MenuItem key={opt.color} value={opt.color}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: opt.color,
                        mr: 1,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{opt.name}</Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          display: "block",
                          maxWidth: "700px", // Limit width to prevent overflow
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt.color}: {opt.tip}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <input
              type="color"
              value={backgroundColor || "#F5F5F5"}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="color-picker-input"
              aria-label="Background color picker"
            />
            <Typography variant="body2">Select or enter a color</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: Background colors should be neutral to ensure readability
            and flexibility. Choose light grays or whites for a clean, modern
            look, warm beiges or ivories for approachability and luxury, or
            subtle blue-grays for trust and professionalism. Avoid overly
            saturated colors to maintain high contrast with text (aim for a
            4.5:1 contrast ratio for accessibility). Test your choice with tools
            like WebAIM Contrast Checker.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Choose Primary Color (30%)",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select the primary brand color that represents your theme (30% of
            the design).
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <input
              type="color"
              value={primaryColor || recommendedBrandColor?.color || "#000000"}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="color-picker-input"
              aria-label="Primary color picker"
            />
            <Typography variant="body2">Select or enter a color</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: The primary color defines your brand. Choose a color that
            aligns with your industry's emotional impact (e.g., green for
            health, purple for creativity). It should be vibrant but harmonious
            with the background.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Choose Accent Color (10%)",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select a harmony scheme and pick an accent color for buttons and
            links (10% of the design).
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Accent Harmony</InputLabel>
            <Select
              value={accentHarmony}
              onChange={(e) => setAccentHarmony(e.target.value)}
              label="Accent Harmony"
            >
              {harmonies.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <input
              type="color"
              value={accentColor || suggestedAccentColors[0] || "#000000"}
              onChange={(e) => setAccentColor(e.target.value)}
              className="color-picker-input"
              aria-label="Accent color picker"
            />
            <Typography variant="body2">Select or enter a color</Typography>
          </Box>
          {suggestedAccentColors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Suggested Accent Colors:</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                {suggestedAccentColors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: color,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => setAccentColor(color)}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: Accent colors draw attention. Use complementary colors for
            high contrast (e.g., blue primary with orange accent) or analogous
            colors for harmony. Ensure it stands out against the background and
            primary.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Choose Highlight Color",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select a harmony scheme and pick a highlight color for hover effects
            and subtle accents.
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Highlight Harmony</InputLabel>
            <Select
              value={highlightHarmony}
              onChange={(e) => setHighlightHarmony(e.target.value)}
              label="Highlight Harmony"
            >
              {harmonies.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <input
              type="color"
              value={highlightColor || suggestedHighlightColors[0] || "#000000"}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="color-picker-input"
              aria-label="Highlight color picker"
            />
            <Typography variant="body2">Select or enter a color</Typography>
          </Box>
          {suggestedHighlightColors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Suggested Highlight Colors:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                {suggestedHighlightColors.map((color, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: color,
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => setHighlightColor(color)}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: Highlight colors are subtle, often lighter tints of the
            primary or accent. Monochromatic highlights create a cohesive look,
            while triadic highlights add vibrancy. Ensure they're distinct but
            not overpowering.
          </Typography>
        </Box>
      ),
    },
    {
      label: "Finalize Palette",
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Review your complete palette below and save it.
          </Typography>
          <TextField
            label="Palette Name"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
            error={!paletteName}
            helperText={!paletteName ? "Palette name is required" : ""}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePalette}
            disabled={Object.keys(palette).length !== 5 || !paletteName}
            sx={{ mt: 2 }}
          >
            Save Palette
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            **Tip**: Verify your palette's accessibility using tools like WebAIM
            Contrast Checker. Ensure text has a contrast ratio of at least 4.5:1
            against the background and primary colors for readability.
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h5" gutterBottom align="center">
        Create Your Website Color Palette
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {index < steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current Palette
        </Typography>
        {Object.keys(palette).length > 0 ? (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {Object.entries(palette).map(([key, color]) => (
              <Box key={key} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: color,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: tinycolor
                      .mostReadable(color, ["#000", "#fff"])
                      .toHexString(),
                  }}
                >
                  {color}
                </Box>
                <Typography>{key}</Typography>
                {key !== "Text" && (
                  <input
                    type="color"
                    value={color}
                    onChange={(e) =>
                      handlePaletteColorChange(key, e.target.value)
                    }
                    className="color-picker-input"
                    aria-label={`${key} color picker`}
                  />
                )}
              </Box>
            ))}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Current Palette Preview
              </Typography>
              <MockupLayout palette={palette} />
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">
            No colors selected yet. Complete the steps to build your palette.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default PaletteChooser;
