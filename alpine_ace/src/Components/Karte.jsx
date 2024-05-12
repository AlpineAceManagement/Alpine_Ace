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

const Karte = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";
    const basisPfadKartenSymbole =
      "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/";

    // Instanziierung einer Vector Source mittels einer WFS GetFeature Abfrage
    const restuarantSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:Restaurant" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    const parkplatzSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:parkplatz" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    const oevSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage + "Alpine_Ace:oev" + geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    const pistenSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage + "Alpine_Ace:pisten" + geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });

    const anlagenSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          geoserverWFSAnfrage + "Alpine_Ace:anlagen" + geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });
    // Instanziierung eines Vector Layers für Punkte mit der Source
    const restuarantLayer = new VectorLayer({
      source: restuarantSource,
      style: new Style({
        image: new Icon({
          src: basisPfadKartenSymbole + "restaurant.svg",
          scale: 0.15,
          anchor: [0.5, 0.5],
        }),
      }),
    });

    const parkplatzLayer = new VectorLayer({
      source: parkplatzSource,
      style: new Style({
        image: new Icon({
          src: basisPfadKartenSymbole + "parkplatz.svg",
          scale: 0.15,
          anchor: [0.5, 0.5],
        }),
      }),
    });

    const oevLayer = new VectorLayer({
      source: oevSource,
      style: new Style({
        image: new Icon({
          src: basisPfadKartenSymbole + "oev_haltestelle.svg",
          scale: 0.15,
          anchor: [0.5, 0.5],
        }),
      }),
    });

    // Instanziierung eines Vector Layers für Linien mit der Source
    const pistenLayer = new VectorLayer({
      source: pistenSource,
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
    const strichStaerkeAnlage = 4; // Hier wird die Strichstärke für die Anlagen definiert
    const farbeAnlage = "#757575"; // Hier wird die Farbe für die Anlagen definiert
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
            color: farbeAnlage, // Choose your desired color for the original line
            width: strichStaerkeAnlage, // Choose your desired width
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
                color: farbeAnlage,
                width: strichStaerkeAnlage,
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
    // Create the vector layer for Anlagen with the custom style
    const anlagenLayer = new VectorLayer({
      source: anlagenSource,
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
    pistenLayer.setZIndex(1);
    anlagenLayer.setZIndex(2);
    parkplatzLayer.setZIndex(3);
    oevLayer.setZIndex(4);
    restuarantLayer.setZIndex(5);
    // Initialize OpenLayers map
    const map = new Map({
      layers: [
        swisstopoLayer,
        pistenLayer,
        anlagenLayer,
        parkplatzLayer,
        oevLayer,
        restuarantLayer,
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

    // Funktion zum Behandeln des Klickereignisses auf dem Vektorlayer
    const handleClick = (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        console.log("Feature Eigenschaften:", feature.getProperties());

        // Setzen von Mindest- und Maximalzoomstufen
        const minZoomLevel = 8; // Beispielwert für Mindestzoomstufe
        const maxZoomLevel = 16; // Beispielwert für Maximalzoomstufe
        map.getView().setMinZoom(minZoomLevel);
        map.getView().setMaxZoom(maxZoomLevel);

        // Zoom auf das ausgewählte Feature
        map.getView().fit(feature.getGeometry().getExtent(), {
          duration: 500, // Optional: Animate the zooming process
          padding: [1000, 1000, 1000, 1000], // Optional: Add padding around the extent
        });

        setSelectedFeature(feature.getProperties()); // Update selected feature state
      });
    };

    // Event-Handler für das Klicken auf Features hinzufügen
    map.on("click", handleClick);

    // Update the size of the map when the window is resized
    window.addEventListener("resize", () => {
      map.updateSize();
    });

    return () => {
      // Event-Handler beim Entfernen der Komponente entfernen
      map.on("click", handleClick);
      window.removeEventListener("resize", () => {
        map.updateSize();
      });
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
          display="flex"
          flexDirection="column" // Anordnung der Boxen in einer Spalte
          sx={{
            width: "95vw",
            height: "65vh",
            borderRadius: "3vw",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden", // Kein Overflow der Karte
          }}
        >
          <Box
            ref={mapRef}
            sx={{
              flexGrow: 1, // Karte wächst, um verfügbaren Platz zu füllen
              borderRadius: "3vw",
              overflow: "hidden",
              bgcolor: "inherit", // Farbe von Elternbox erben
            }}
          ></Box>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="left"
          alignItems="flex-start"
          gap={2}
          sx={{
            width: "95vw", // Volle Breite der Elternbox
            borderRadius: "3vw",
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
                  <p>
                    <strong>Öffnungszeiten:</strong>{" "}
                    {selectedFeature.r_oeffnungszeiten}
                  </p>
                  <p>
                    <strong>Telefon:</strong> {selectedFeature.r_telefon}
                  </p>
                  <p>
                    <strong>E-Mail:</strong> {selectedFeature.r_email}
                  </p>
                  <p>
                    <strong>Webseite:</strong>{" "}
                    {selectedFeature.r_webseite && (
                      <a
                        href={selectedFeature.r_webseite}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "inherit" }} // Link wird immer gleich angezigt auch wenn dieser schon verwendet wurde
                      >
                        {selectedFeature.r_webseite}
                      </a>
                    )}
                  </p>
                </>
              )}

              {/* Wenn eine Piste ausgewählt ist */}
              {selectedFeature.p_name && (
                <>
                  <h2>{selectedFeature.p_name}</h2>
                  <p>
                    <strong>Pistennummer:</strong> {selectedFeature.p_nummer}
                  </p>
                  {/* <p>Status: {selectedFeature.p_status}</p> */}
                </>
              )}

              {/* Wenn eine Anlage ausgewählt ist */}
              {selectedFeature.a_name && (
                <>
                  <h2>Anlagennamen: {selectedFeature.a_name}</h2>
                  <p>
                    <strong>Höhendifferenz:</strong>{" "}
                    {parseInt(selectedFeature.a_hoehe)}m
                  </p>
                  {/* Füge hier weitere Attribute hinzu, die du anzeigen möchtest */}
                </>
              )}
              {/* Wenn eine Anlage ausgewählt ist */}
              {selectedFeature.pp_name && (
                <>
                  <h2>Parkplatz: {selectedFeature.pp_name}</h2>
                  {/* Füge hier weitere Attribute hinzu, die du anzeigen möchtest */}
                </>
              )}
              {selectedFeature.o_name && (
                <>
                  s<h2>Haltestelle: {selectedFeature.o_name}</h2>
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

export default Karte;
