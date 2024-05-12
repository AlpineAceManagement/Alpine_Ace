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
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { Projection } from "ol/proj";
import { SwisstopoLayer } from "./swisstopoLayer.js";

import spec_analgen from "./diagramms_anlagen";
import spec_pisten from "./diagramm_pisten";
import Bulletin from "./Bulletin";

import "../App.css";

const Hauptmenu = () => {
  const mapRef = useRef(null); // Reference to the map container
  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";

    const bulettinVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:bulletins" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    // Define transparency constant for fill colors
    const fillOpacity = 0.3; // Adjust as needed

    const bulettinVectorLayer = new VectorLayer({
      source: bulettinVectorSource,
      style: function (feature) {
        // Get the value of the "b_danger" attribute for the current feature
        const dangerAttribute = feature.get("b_danger");

        // Define default colors in case the attribute is not defined
        let strokeColor = "#FFFFFF"; //
        let fillColor = "rgba(255, 255, 255, " + fillOpacity + ")"; //

        // Assign colors based on attribute value
        switch (dangerAttribute) {
          case "low":
            strokeColor = "rgb(175, 255, 1,0.5)"; // Green
            fillColor = "rgba(175, 255, 1, " + fillOpacity + ")";
            break;
          case "moderate":
            strokeColor = "rgba(255, 255, 0,0.5)"; // Yellow
            fillColor = "rgba(255, 255, 0, " + fillOpacity + ")";
            break;
          case "considerable":
            strokeColor = "rgba(254, 165, 0,0.5)"; // Orange
            fillColor = "rgba(254, 165, 0, " + fillOpacity + ")";
            break;
          case "high":
            strokeColor = "rgba(254,0, 0,0.5)"; // Red
            fillColor = "rgba(254, 0, 0, " + fillOpacity + ")";
            break;
          case "very_high":
            strokeColor = "rgba(128, 0, 0,0.5)"; // Dark red
            fillColor = "rgba(128, 0, 0)" + fillOpacity + ")";
            break;
          case "no_snow":
            strokeColor = "rgba(190,190,190,0.5)"; // Gray
            fillColor = "rgba(190,190,190)" + fillOpacity + ")";
            break;
          case "no_rating":
            strokeColor = "rgba(0,0,0,0.5)"; // Black
            fillColor = "rgba(0,0,0," + fillOpacity + ")";
            break;
          default:
            // Keep default colors if attribute value is not recognized
            break;
        }

        // Return style with dynamically assigned stroke and fill colors based on the attribute
        return new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: 3,
          }),
          fill: new Fill({
            color: fillColor,
          }),
        });
      },
    });

    const kantonesgrenzenSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:tlm_kantonsgebiet" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    const landesgrenzenSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:tlm_landesgebiet" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    const kantonsLayer = new VectorLayer({
      source: kantonesgrenzenSource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 0,0.5)",
          width: 1.5,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0,0)",
        }),
      }),
    });

    const landesgrenzenLayer = new VectorLayer({
      source: landesgrenzenSource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 0,0.5)",
          width: 2.5,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0,0)",
        }),
      }),
    });

    //Definition des Kartenextents für WMS/WMTS
    const extent = [2420000, 130000, 2900000, 1350000];
    // WMS Winterlandeskarte holen mit der Funktion SwisstopoLayer aus dem File swisstopoLayer.js
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

    // Layer Reihenfolge festlegen, 0 ist zu zuunterst
    WMSwinterlandeskarteLayer.setZIndex(0);
    kantonsLayer.setZIndex(1);
    landesgrenzenLayer.setZIndex(2);
    bulettinVectorLayer.setZIndex(3);

    // Initialize OpenLayers map
    const map = new Map({
      layers: [
        WMSwinterlandeskarteLayer,
        bulettinVectorLayer,
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
