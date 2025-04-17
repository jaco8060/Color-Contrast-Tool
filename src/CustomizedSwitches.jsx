import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import tailwindLogo from "./assets/tailwind-logo.svg";

const TailwindSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${tailwindLogo})`,
        backgroundSize: "80%", // Adjusts logo size within thumb
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#bae6fd", // Tailwind blue-200
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.grey[300], // Light gray when unchecked
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: "", // No logo when unchecked
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    backgroundColor: "#38bdf8", // Tailwind blue-400 when checked
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.grey[400],
    borderRadius: 20 / 2,
  },
}));

export default function CustomizedSwitches() {
  return (
    <FormGroup>
      <FormControlLabel
        control={<TailwindSwitch sx={{ m: 1 }} defaultChecked />}
        label="Tailwind Switch"
      />
    </FormGroup>
  );
}
