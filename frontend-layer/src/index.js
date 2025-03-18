import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Router } from "./Router.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const root = ReactDOM.createRoot(document.getElementById("root"));

// Creates the theme for MUI
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F76902" },
    secondary: { main: "#ACA39A" },
    text: {
      primary: "#000000",
      secondary: "#7C878E",
    },
    background: { default: "#FFFFFF" },
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Router />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
