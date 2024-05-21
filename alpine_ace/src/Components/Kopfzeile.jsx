/* Dieser Code definiert eine Kopfleiste mit Navigationslinks zur Startseite und zur Einstellungsseite */
import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"; //Icon für Zurück
import SettingsIcon from "@mui/icons-material/Settings"; //Icon für Einstellungen
import Grid from "@mui/material/Grid";

const Kopfzeile = () => {
  return (
    <div className="Kopfzeile">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid>
          <item>
            {" "}
            {/* Link zum Haupmenü*/}
            <Link to="/" className="Kopfzeile-link">
              {" "}
              <ArrowBackIosNewIcon
                className="zurueck-icon"
                style={{ fontSize: "2rem" }}
              />
            </Link>
          </item>
        </Grid>
        <Grid>
          <item>
            {" "}
            <img
              src={require("../logo/logo.jpg")} //Logo.jpg aus dem Ordner Logo beziehen
              alt=""
              style={{ maxWidth: "10vh", display: "block", margin: "0 auto" }}
            />
          </item>
        </Grid>
        <Grid>
          <item>
            {" "}
            {/* Link zum Mneü Einstellungen*/}
            <Link to="/Einstellungen" className="Kopfzeile-link">
              {" "}
              <SettingsIcon
                className="zurueck-icon"
                style={{ fontSize: "2rem" }}
              />
            </Link>
          </item>
        </Grid>
      </Grid>
    </div>
  );
};

export default Kopfzeile;
