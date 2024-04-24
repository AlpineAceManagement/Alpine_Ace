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
            width: "95vw",
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
            source={722}
            target={11135}
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
            width: "95vw",
            minHeight: "25vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            position: "relative",
            overflowY: "auto",
          }}
        ></Box>
      </div>
    </ThemeProvider>
  );
};

export default Navi;
