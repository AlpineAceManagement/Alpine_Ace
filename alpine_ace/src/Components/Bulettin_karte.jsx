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

const Bulettin_karte = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

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
      // Set the data projection to EPSG:4326 (WGS 84)
      dataProjection: "EPSG:2056",
      // Set the feature projection to match the map's projection (EPSG:2056)
      featureProjection: "EPSG:2056",
      // Add error handler
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
        let strokeColor = "#E40513"; // Default stroke color: red
        let fillColor = "rgba(255, 0, 0, " + fillOpacity + ")"; // Default fill color: transparent red

        // Assign colors based on attribute value
        switch (dangerAttribute) {
          case "low":
            strokeColor = "#00FF00"; // Green
            fillColor = "rgba(0, 255, 0, " + fillOpacity + ")"; // Transparent green
            break;
          case "moderate":
            strokeColor = "#FFFF00"; // Yellow
            fillColor = "rgba(255, 255, 0, " + fillOpacity + ")"; // Transparent yellow
            break;
          case "considerable":
            strokeColor = "#FFA500"; // Orange
            fillColor = "rgba(255, 165, 0, " + fillOpacity + ")"; // Transparent orange
            break;
          case "high":
            strokeColor = "#FF0000"; // Red
            fillColor = "rgba(255, 0, 0, " + fillOpacity + ")"; // Transparent red
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

    const extent = [2420000, 130000, 2900000, 1350000];

    //Laden des WMTS von geo.admin.ch > Hintergrundkarte in der Applikation
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
    swisstopoLayer.setZIndex(0);
    bulettinVectorLayer.setZIndex(3);

    // Initialize OpenLayers map
    const map = new Map({
      layers: [swisstopoLayer, bulettinVectorLayer],
      target: mapRef.current,
      view: new View({
        center: [2762640.8, 1179359.1],
        zoom: 8,
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

export default Bulettin_karte;
