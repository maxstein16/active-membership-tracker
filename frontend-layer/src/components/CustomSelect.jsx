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
  const [age, setAge] = React.useState(startingValue);

  const handleChange = (event) => {
    setAge(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <div className="select">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" color="black">
          {label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
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
            <MenuItem value={option} key={key}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
