import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function UserInput({
  label,
  color,
  value,
  setValue,
  isMultiline,
  onLeaveField,
  options, // Array of options for dropdown (only used when it's a dropdown)
  isDropdown, // Boolean to determine whether to render a dropdown or text field
}) {
  // Define my variables
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="user-input">
      {isDropdown ? (
        <TextField
          select
          fullWidth
          label={label}
          value={value}
          onChange={handleChange}
          color="black"
          variant="outlined"
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
            },
          }}
          onBlur={(event) => {
            onLeaveField(event.target.value);
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          multiline={isMultiline}
          fullWidth
          label={label}
          variant="outlined"
          value={value}
          onChange={handleChange}
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
            },
          }}
          onBlur={(event) => {
            onLeaveField(event.target.value);
          }}
        />
      )}
    </div>
  );
}
