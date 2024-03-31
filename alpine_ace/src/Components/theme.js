import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    p_red: {
      main: "#FF6155",
      light: "#ff7754",
      dark: "#cc4d43",
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
