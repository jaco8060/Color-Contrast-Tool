import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import tinycolor from "tinycolor2";

function MockupLayout({ palette = {} }) {
  const navigate = useNavigate();

  // Default palette if none provided
  const defaultPalette = {
    Background: "#F5F5F5",
    Primary: "#4A90E2",
    Accent: "#E74C3C",
    Highlight: "#2ECC71",
    Text: "#333333",
  };
  const colors = { ...defaultPalette, ...palette };

  return (
    <Box sx={{ bgcolor: colors.Background, minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: colors.Primary,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 48, // Reduced from default 64
            py: 0.5,
          }}
        >
          <Typography
            variant="body1" // Reduced from h6
            sx={{ color: colors.Text, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Logo
          </Typography>
          <Stack direction="row" spacing={1}>
            {" "}
            {/* Reduced from spacing: 2 */}
            {["Home", "About", "Services", "Contact"].map((item) => (
              <Typography
                key={item}
                variant="body2" // Reduced from body1
                sx={{
                  color: colors.Text,
                  cursor: "pointer",
                  "&:hover": { color: colors.Highlight },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: colors.Background,
          py: 3, // Reduced from py: 6
          textAlign: "center",
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 500 }}>
          {" "}
          {/* Custom width instead of md */}
          <Typography
            variant="h4" // Reduced from h3
            sx={{ color: colors.Text, fontWeight: "bold", mb: 1 }} // Reduced mb: 2
          >
            Welcome to Our Website
          </Typography>
          <Typography
            variant="body1" // Reduced from h6
            sx={{ color: colors.Text, opacity: 0.8, mb: 1.5 }} // Reduced mb: 3
          >
            Discover our services and join our community.
          </Typography>
          <Button
            variant="contained"
            size="small" // Added smaller button size
            sx={{
              bgcolor: colors.Accent,
              color: tinycolor
                .mostReadable(colors.Accent, ["#000", "#fff"])
                .toHexString(),
              "&:hover": {
                bgcolor: tinycolor(colors.Accent).darken(10).toHexString(),
              },
              px: 2, // Reduced padding
              fontSize: "0.75rem", // Smaller text
            }}
            onClick={() => alert("CTA Clicked!")}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Info Section */}
      <Container maxWidth={false} sx={{ maxWidth: 500, py: 2 }}>
        {" "}
        {/* Reduced py: 4 */}
        <Typography
          variant="h5" // Reduced from h4
          sx={{ color: colors.Primary, textAlign: "center", mb: 1.5 }} // Reduced mb: 3
        >
          About Us
        </Typography>
        <Stack spacing={1}>
          {" "}
          {/* Reduced from spacing: 2 */}
          <Typography variant="body2" sx={{ color: colors.Text }}>
            {" "}
            {/* Reduced from body1 */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="body2" sx={{ color: colors.Text }}>
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Typography>
        </Stack>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          {" "}
          {/* Reduced mt: 4 */}
          <Button
            variant="outlined"
            size="small" // Added smaller button size
            sx={{
              borderColor: colors.Primary,
              color: colors.Primary,
              "&:hover": {
                bgcolor: tinycolor(colors.Primary).lighten(40).toHexString(),
                borderColor: colors.Primary,
              },
              px: 1.5, // Reduced padding
              fontSize: "0.75rem", // Smaller text
            }}
            onClick={() => alert("Learn More Clicked!")}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default MockupLayout;
