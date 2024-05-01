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

    const extent = [2420000, 130000, 2900000, 1350000];
    const geoserverWFSPointLayer = "Alpine_Ace:Restaurant";
    const pointVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSPointLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });
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

    const pointVectorLayer = new VectorLayer({
      source: pointVectorSource,
      style: new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({
            color: "orange",
          }),
        }),
      }),
    });
    const geoserverWFSAnlagenLayer = "Alpine_Ace:anlagen"; // Geoserver WFS Anlagen Layername
    const wegVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSAnlagenLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });
    console.log("wegVectorData:", wegVectorSource);

    const wegVectorLayer = new VectorLayer({
      source: wegVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    swisstopoLayer.setZIndex(0);
    wegVectorLayer.setZIndex(1);
    pointVectorLayer.setZIndex(2);

    const map = new Map({
      layers: [swisstopoLayer, wegVectorLayer, pointVectorLayer],
      view: new View({
        center: [2762640.8, 1179359.1],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
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
              height: "200px",
              borderRadius: "3vh",
            }}
          ></div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default GPX_Viewer;
