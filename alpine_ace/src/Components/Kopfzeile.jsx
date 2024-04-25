import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SettingsIcon from "@mui/icons-material/Settings";
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
            <Link to="/" className="Kopfzeile-link">
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
    </div>
  );
};

export default Kopfzeile;
