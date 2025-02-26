import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import TextField from "@mui/material/TextField";

export default function UserInput({ label, color, value, setValue, isMultiline, onLeaveField }) {
  // Define my variables

  return (
    <div className="user-input">
    <TextField
      multiline={isMultiline}
      fullWidth
      id="fullWidth"
      label={label}
      variant="outlined"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      color="black"
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: color,
            },
          },
          "&:hover:not(.Mui-focused)": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: color,
            },
          },
        }
      }}
      onBlur={(event) => {
        onLeaveField(event.target.value);
      }}
    />
    </div>
  );
}
