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

const GPX_Viewer = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSPistenLayer = "Alpine_Ace:pisten"; // Geoserver WFS Linien Layername
    const geoserverWFSAnlagenLayer = "Alpine_Ace:anlagen"; // Geoserver WFS Anlagen Layername
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";
    const pistenVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage +
          geoserverWFSPistenLayer +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });

    const anlagenVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage +
          geoserverWFSAnlagenLayer +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });
    const wegVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:a_a_skidaten_weg&viewparams=Skidaten_ID:1;" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    // Instanziierung eines Vector Layers für Linien mit der Source
    const pistenVectorLayer = new VectorLayer({
      source: pistenVectorSource,
      style: function (feature) {
        // Hole den Wert des Attributs "p_farbe" für das aktuelle Feature
        const colorAttribute = feature.get("p_farbe");

        // Definiere die Standardfarbe für den Fall, dass das Attribut nicht definiert ist
        let color = "#E40513"; // Default color: red

        // Überprüfe, ob das Farbattribut definiert ist und weise entsprechende Farbe zu
        if (colorAttribute === "Blau") {
          color = "#0077BA";
        } else if (colorAttribute === "Schwarz") {
          color = "#000000";
        }
        // Rückgabe des Stils mit dynamischer Farbe basierend auf dem Attribut
        return new Style({
          stroke: new Stroke({
            color: color,
            width: 4,
          }),
        });
      },
    });
    const offsetDistance = 20; // Hier wird offsetDistance definiert
    const anlagenStyle = function (feature) {
      // Get the geometry of the feature
      const geometry = feature.getGeometry();

      // Check if the feature has a LineString geometry
      if (geometry.getType() === "LineString") {
        // Get the coordinates of the LineString
        const coordinates = geometry.getCoordinates();

        // Define the styles array to hold the styles for each part of the line
        const lineStyles = [];

        // Style for the original line (without offsets)
        const originalLineStyle = new Style({
          stroke: new Stroke({
            color: "black", // Choose your desired color for the original line
            width: 4, // Choose your desired width
          }),
        });

        lineStyles.push(originalLineStyle); // Add the original line style to the array

        // Calculate the total length of the line
        let totalLength = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
          totalLength += Math.sqrt(
            Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
              Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2)
          );
        }

        // Define the number of intervals
        const numIntervals = 5; // Change this value to adjust the number of intervals

        // Calculate the length of each interval
        const intervalLength = totalLength / numIntervals;

        // Iterate over the segments of the line
        for (let i = 0; i < coordinates.length - 1; i++) {
          // Calculate the length of the current segment
          const segmentLength = Math.sqrt(
            Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
              Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2)
          );

          // Calculate the number of intervals within the current segment
          const numSegments = Math.ceil(segmentLength / intervalLength);

          // Calculate the distance between each interval
          const intervalDistance = segmentLength / numSegments;

          // Calculate the unit vector along the segment
          const segmentVector = [
            (coordinates[i + 1][0] - coordinates[i][0]) / segmentLength,
            (coordinates[i + 1][1] - coordinates[i][1]) / segmentLength,
          ];

          // Iterate over the intervals within the current segment
          for (let j = 0; j < numSegments; j++) {
            // Calculate the coordinates of the current interval
            const intervalStart = [
              coordinates[i][0] + segmentVector[0] * j * intervalDistance,
              coordinates[i][1] + segmentVector[1] * j * intervalDistance,
            ];

            // Calculate the coordinates of the point 90 degrees to the right of the interval start
            const intervalEndRight = [
              intervalStart[0] + segmentVector[1] * offsetDistance,
              intervalStart[1] - segmentVector[0] * offsetDistance,
            ];

            // Calculate the coordinates of the point 90 degrees to the left of the interval start
            const intervalEndLeft = [
              intervalStart[0] - segmentVector[1] * offsetDistance,
              intervalStart[1] + segmentVector[0] * offsetDistance,
            ];

            // Create the new line geometry
            const line = new LineString([intervalEndLeft, intervalEndRight]);

            // Create the style for the line
            const lineStyle = new Style({
              geometry: line,
              stroke: new Stroke({
                color: "black",
                width: 6,
              }),
            });

            // Add the style to the array
            lineStyles.push(lineStyle);
          }
        }

        // Return the array of styles for the feature
        return lineStyles;
      }
    };
    const wegVectorLayer = new VectorLayer({
      source: wegVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });
    // Create the vector layer for Anlagen with the custom style
    const anlagenVectorLayer = new VectorLayer({
      source: anlagenVectorSource,
      style: anlagenStyle,
    });

    //Definition des Kartenextents für WMS/WMTS
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
    anlagenVectorLayer.setZIndex(1);
    pistenVectorLayer.setZIndex(2);
    wegVectorLayer.setZIndex(3);

    // Initialize OpenLayers map
    const map = new Map({
      layers: [
        swisstopoLayer,
        pistenVectorLayer,
        anlagenVectorLayer,
        wegVectorLayer,
      ], // Füge den Linien-Layer hinzu
      target: mapRef.current,
      view: new View({
        center: [2762640.8, 1179359.1],
        zoom: 12,
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

export default GPX_Viewer;
