import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DatePicker({
  label,
  color,
  value,
  setValue,
  onLeaveField,
}) {
  // Define my variables

  return (
    <div className="user-input">
      <DateTimePicker
        fullWidth
        id="fullWidth"
        className="child-buttons-no-hover"
        label={label}
        variant="outlined"
        value={value}
        onChange={(event) => {
          setValue(event);
          onLeaveField(event);
        }}
        color="black"
        sx={{
          "& .MuiInputLabel-root": {
            color: "grey",
          },
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
      />
    </div>
  );
}
