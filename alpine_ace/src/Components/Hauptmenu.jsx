import React, { useEffect, useRef } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { Vega } from "react-vega";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { Projection } from "ol/proj";
import { createVectorSource } from "./kartenWFS.js";
import { SwisstopoLayer } from "./swisstopoLayer.js";
import {
  kantonsGrenzenStyle,
  landesGrenzenStyle,
  bulettinStyle,
} from "./kartenLayerStyle.js";

import spec_analgen from "./diagramms_anlagen";
import spec_pisten from "./diagramm_pisten";
import Bulletin from "./Bulletin";

import "../App.css";

const Hauptmenu = () => {
  const mapRef = useRef(null); // Reference to the map container
  useEffect(() => {
    //WFS Anfrage für die Lawinenbulletin
    const bulettinSource = createVectorSource("bulletins");
    //WFS Anfrage für die Kantonsgrenzen
    const kantonesgrenzenSource = createVectorSource("tlm_kantonsgebiet");
    //WFS Anfrage für die Kantonsgrenzen
    const landesgrenzenSource = createVectorSource("tlm_landesgebiet");

    // Bulettin Layer Styl aus kartenLayerStyle.js aufgeschlüsselt nach b_danger
    const bulettinLayer = new VectorLayer({
      source: bulettinSource,
      style: bulettinStyle,
    });

    // Kantonsgrenzen Layer Styl aus kartenLayerStyle.js
    const kantonsLayer = new VectorLayer({
      source: kantonesgrenzenSource,
      style: kantonsGrenzenStyle(),
    });
    // Landesgrenzen Layer Styl aus kartenLayerStyle.js
    const landesgrenzenLayer = new VectorLayer({
      source: landesgrenzenSource,
      style: landesGrenzenStyle(),
    });

    //Definition des Kartenextents für WMS/WMTS
    const extent = [2420000, 130000, 2900000, 1350000];
    // WMS Winterlandeskarte holen mit der Funktion SwisstopoLayer aus dem File swisstopoLayer.js
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

    // Layer Reihenfolge festlegen, 0 ist zu zuunterst
    WMSwinterlandeskarteLayer.setZIndex(1);
    kantonsLayer.setZIndex(2);
    landesgrenzenLayer.setZIndex(3);
    bulettinLayer.setZIndex(4);

    // Initialize OpenLayers map
    const map = new Map({
      layers: [
        WMSwinterlandeskarteLayer,
        bulettinLayer,
        kantonsLayer,
        landesgrenzenLayer,
      ],
      target: mapRef.current,
      view: new View({
        center: [2667684.5, 1185000.125],
        zoom: 7.1,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });
  }, []);
  function hauptmenuSchaltfächenErstellen(text, link) {
    return (
      <Grid item xs={6} className="button-grid-item">
        <Link to={link}>
          <Button
            className="Hauptmenu-button"
            variant="contained"
            color="p_red"
            fullWidth
            sx={{ fontSize: "2.3vh" }}
          >
            {text}
          </Button>
        </Link>
      </Grid>
    );
  }
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
            width: "95vw",
            height: "25vh",
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
              <h2 style={{ color: "#00112e", textAlign: "center" }}>
                Lenzerheide Aktuell
              </h2>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid
              item
              xs={4}
              container
              justifyContent="center"
              alignItems="center"
            >
              <div>
                <Vega spec={spec_analgen} renderer="svg" actions={false} />
              </div>
            </Grid>
            <Grid item xs={4}>
              <Bulletin />
            </Grid>
            <Grid
              item
              xs={4}
              container
              justifyContent="center"
              alignItems="center"
            >
              <div>
                <Vega spec={spec_pisten} renderer="svg" actions={false} />
              </div>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            width: "95vw",
            height: "22vh",
            borderRadius: "3vw",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden", // Kein Overflow der Karte
          }}
        >
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "3vh",
            }}
          ></div>
        </Box>
        <Box
          sx={{
            width: "95vw",
            height: "33vh",
            borderRadius: "3vw",
            bgcolor: "p_white.main",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            style={{ width: "95%", margin: "auto" }}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
          >
            {hauptmenuSchaltfächenErstellen("Karte", "/Karte")}
            {hauptmenuSchaltfächenErstellen("Wetter", "/Wetter")}
            {hauptmenuSchaltfächenErstellen("Statistiken", "/Statistiken")}
            {hauptmenuSchaltfächenErstellen("Navi", "/Navi")}
            {hauptmenuSchaltfächenErstellen("Bewertungen", "/Bewertungen")}
            {hauptmenuSchaltfächenErstellen("Restaurant", "/Restaurant")}
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Hauptmenu;
