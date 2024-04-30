import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import theme from "./theme";

const GPX_Viewer = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // const geoserverWFSWegLayer = "Alpine_Ace:a_a_skidaten_weg";

    const wegVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: "http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_skidaten_weg&viewparams=Skidaten_ID:1;&outputformat=application/json",
    });

    const wegVectorLayer = new VectorLayer({
      source: wegVectorSource,
    });

    const extent = [2420000, 130000, 2900000, 1350000];

    const swisstopoLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        attributions:
          '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
          'en/home.html">geo.admin.ch</a>',
        projection: "EPSG:2056",
        params: {
          LAYERS: "ch.swisstopo.pixelkarte-farbe-winter",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
    });

    const map = new Map({
      layers: [swisstopoLayer, wegVectorLayer],
      target: mapRef.current,
      view: new View({
        center: [2762640.8, 1179359.1],
        zoom: 12,
        projection: "EPSG:2056",
      }),
    });

    const resizeHandler = () => {
      if (mapRef.current) {
        map.updateSize();
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
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
        <Box
          sx={{
            width: "90vw",
            height: "50vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
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
      </div>
    </ThemeProvider>
  );
};

export default GPX_Viewer;
