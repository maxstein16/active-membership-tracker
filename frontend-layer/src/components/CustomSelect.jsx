import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CustomSelect({ label, color, options, startingValue, onSelect }) {
  const [selectedValue, setSelectedValue] = React.useState(startingValue);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onSelect(event.target.value); // Pass value to parent
  };

  return (
    <div className="select">
      <FormControl fullWidth>
        <InputLabel id={`select-${label}`} color="black">
          {label}
        </InputLabel>
        <Select
          labelId={`select-${label}`}
          id={`select-${label}`}
          value={selectedValue}
          label={label}
          onChange={handleChange}
          sx={{
            "&.MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: color,
              },
              "&.Mui-focused fieldset": {
                borderColor: color,
              },
            },
          }}
        >
          {options.map((option, key) => (
            <MenuItem value={option.value || option} key={key}>
              {option.label || option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
