import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { Icon, Circle, Fill, Stroke, Style } from "ol/style";
import { ThemeProvider } from "@mui/material/styles";
import { Projection } from "ol/proj";
import Box from "@mui/material/Box";
import theme from "./theme";
import LineString from "ol/geom/LineString.js";
import KarteAufbau from "./KarteAufbau";

const Navi = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

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
        <h1>Navi</h1>
        <Box
          sx={{
            width: "90vw",
            height: "50vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden", // Kein Overflow der Karte
          }}
        >
          <KarteAufbau
            mapRef={mapRef}
            setSelectedFeature={setSelectedFeature}
          />
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
          display="flex"
          flexWrap="wrap"
          justifyContent="left"
          alignItems="flex-start"
          gap={2}
          sx={{
            width: "90vw",
            minHeight: "25vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {/* Informationen für ausgewähltes Feature anzeigen */}
          {selectedFeature && (
            <div className="informationen-karte">
              {/* Wenn ein Restaurant ausgewählt ist */}
              {selectedFeature.r_name && (
                <>
                  <h2>{selectedFeature.r_name}</h2>
                  <p>Öffnungszeiten: {selectedFeature.r_oeffnungszeiten}</p>
                  <p>Telefon: {selectedFeature.r_telefon}</p>
                  <p>Email: {selectedFeature.r_email}</p>
                  <p>Webseite: {selectedFeature.r_webseite}</p>
                </>
              )}

              {/* Wenn eine Piste ausgewählt ist */}
              {selectedFeature.p_name && (
                <>
                  <h2>{selectedFeature.p_name}</h2>
                  <p>Pistennummer: {selectedFeature.p_nummer}</p>
                  {/* <p>Status: {selectedFeature.p_status}</p> */}
                </>
              )}

              {/* Wenn eine Anlage ausgewählt ist */}
              {selectedFeature.a_name && (
                <>
                  <p>Anlagennamen: {selectedFeature.a_name}</p>
                  <p>Höhendifferenz: {parseInt(selectedFeature.a_hoehe)}m</p>
                  {/* Füge hier weitere Attribute hinzu, die du anzeigen möchtest */}
                </>
              )}
            </div>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Navi;
