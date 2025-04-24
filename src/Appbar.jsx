// src/Appbar.jsx
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import PaletteIcon from "@mui/icons-material/Palette";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

// Define pages with their navigation routes
const pages = [
  { name: "Home", path: "/" },
  { name: "Saved Palettes", path: "/saved-palettes" },
  // { name: "How to use", path: "/how-to-use" }, // TODO: Add path when page is ready
];

function ResponsiveAppBar({ themeMode, toggleTheme }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Title */}
          <PaletteIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Montserrat",
              fontWeight: 700,
              letterSpacing: "0.05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Color Contrast Tool
          </Typography>

          {/* Mobile Menu Button & Items */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  disabled={!page.path} // Disable if path is not defined yet
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {/* Placeholder for future page */}
              <MenuItem disabled>
                <Typography textAlign="center">
                  How to use (coming soon)
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Title */}
          <PaletteIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Montserrat",
              fontWeight: 700,
              letterSpacing: { xs: ".1rem", sm: ".3rem" },
              color: "inherit",
              textDecoration: "none",
              fontSize: { xs: "14px", sm: "20px" },
              whiteSpace: "normal", // Allow wrap on mobile if needed
              lineHeight: 1.2, // Adjust line height if wrapping
            }}
          >
            Color Contrast Tool
          </Typography>

          {/* Desktop Menu Items */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ my: 2, color: "white", display: "block" }}
                disabled={!page.path} // Disable if path is not defined yet
              >
                {page.name}
              </Button>
            ))}
            {/* Placeholder for future page */}
            <Button disabled sx={{ my: 2, color: "grey", display: "block" }}>
              How to use (coming soon)
            </Button>
          </Box>

          {/* Theme Toggle Button */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip
              title={
                themeMode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              arrow
            >
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label="Toggle theme"
              >
                {themeMode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
