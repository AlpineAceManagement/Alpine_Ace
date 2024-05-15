import { createTheme } from "@mui/material/styles";

// Farbpalette für Projekt
const theme = createTheme({
  palette: {
    action: {
      active: {
        disabledBackground: "#FF6155",
      },
    },
    p_red: {
      main: "#FF6155",
      light: "#ff7754",
      dark: "#cc4d43",
      contrastText: "white",
    },
    p_purple: {
      main: "#b655ff",
      light: "#b655ff",
      dark: "#b655ff",
      contrastText: "white",
    },
    p_green: {
      main: "#85d847",
      light: "#85d847",
      dark: "#85d847",
      contrastText: "white",
    },
    p_white: {
      main: "white",
      contrastText: "black",
    },
  },
  typography: {
    fontFamily: ["Artifakt Element Black"].join(","),
  },
});

export default theme;
