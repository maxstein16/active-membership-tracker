import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/adminPages.css";

import Switch from "@mui/material/Switch";

export default function CustomColorToggle({
  label,
  color,
  isChecked,
  onChange,
}) {
  return (
    <div className="custom-color-toggle">
      <p>{label}</p>
      <Switch
        checked={isChecked}
        onChange={onChange}
        inputProps={{ "aria-label": label }}
        sx={{
          "& .MuiSwitch-switchBase": {
            "&.Mui-checked": {
              color: color,
              "& + .MuiSwitch-track": {
                opacity: 0.5,
                backgroundColor: color,
              },
            },
          },
        }}
      />
    </div>
  );
}
