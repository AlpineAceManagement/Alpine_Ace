import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import "../App.css";

const Hauptmenu = () => {
  return (
    <ThemeProvider theme={theme}>
      <div
        className="main"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Hauptmenü</h1>

        <Box
          sx={{
            width: "90vw",
            height: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
          }}
        >
          {" "}
          <img
            src={require("../mockup/dashboard.png")}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%", marginTop: "10%" }}
          />
        </Box>

        <Box
          sx={{
            width: "90vw",
            height: "33vh",
            borderRadius: "3vw",
            bgcolor: "p_white.main",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            style={{ width: "95%", margin: "auto" }} // Adjust the width and center the grid
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
          >
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Karte">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Karte
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Wetter">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Wetter
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Statistiken">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Statistiken
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Navi">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Navi
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Bewertungen">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Bewertungen
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Restaurant">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Restaurant
                </Button>
              </Link>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Link to="/Test">
                <Button
                  className="Hauptmenu-button"
                  variant="contained"
                  color="p_red"
                  fullWidth
                  sx={{ fontSize: 20 }}
                >
                  Test
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Hauptmenu;
