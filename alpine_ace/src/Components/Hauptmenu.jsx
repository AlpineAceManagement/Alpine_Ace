import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { Vega } from "react-vega";

import spec_analgen from "./diagramms_anlagen";
import spec_pisten from "./diagramm_pisten";

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
        <Grid
          className="Kopfzeile"
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid>
            <item>
              {/*Der Pfeil hat dieslbe Farbe wie der Hintergrund, heisst dieser ist unsichbar*/}
              <div to="/" className="Kopfzeile-link">
                <ArrowBackIosNewIcon
                  style={{ fontSize: "2rem", color: "#00112e" }}
                />
              </div>
            </item>
          </Grid>
          <Grid>
            <item>
              {" "}
              <img
                src={require("../logo/logo.jpg")}
                alt=""
                style={{ maxWidth: "10vh", display: "block", margin: "0 auto" }}
              />
            </item>
          </Grid>
          <Grid>
            <item>
              {" "}
              <Link to="/Einstellungen" className="Kopfzeile-link">
                <SettingsIcon
                  className="zurueck-icon"
                  style={{ fontSize: "2rem" }}
                />
              </Link>
            </item>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "90vw",
            height: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
          }}
        >
          <Grid
            container
            style={{ width: "95", margin: "auto" }}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
          >
            <Grid item xs={12}>
              <h1 style={{ color: "#00112e" }}>Lenzerheide Aktuell</h1>
            </Grid>
            <Grid item xs={12}>
              <h1 style={{ color: "#00112e" }}>karte</h1>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Vega spec={spec_analgen} />
              </div>
            </Grid>
            <Grid item xs={4}>
              <h1 style={{ color: "#00112e" }}>bulettin</h1>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Vega spec={spec_pisten} />
              </div>
            </Grid>
          </Grid>
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
                  sx={{ fontSize: "2.3vh" }}
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
                  sx={{ fontSize: "2.3vh" }}
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
                  sx={{ fontSize: "2.3vh" }}
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
                  sx={{ fontSize: "2.3vh" }}
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
                  sx={{ fontSize: "2.3vh" }}
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
                  sx={{ fontSize: "2.3vh" }}
                >
                  Restaurant
                </Button>
              </Link>
            </Grid>
            {/* <Grid item xs={6} className="button-grid-item">
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
            </Grid> */}
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Hauptmenu;
