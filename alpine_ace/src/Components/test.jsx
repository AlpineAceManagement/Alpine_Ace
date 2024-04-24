import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook to access query parameters
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Style } from "ol/style";
import { ThemeProvider } from "@mui/material/styles";
import { Projection } from "ol/proj";
import Box from "@mui/material/Box";
import theme from "./theme";

const Test = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties
  const location = useLocation(); // Get the current location object

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restaurantId = params.get("restaurantId"); // Retrieve restaurant ID from query parameter

    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSPointLayer = "Alpine_Ace:Restaurant"; // Geoserver WFS Layername

    // Instanziierung einer Vector Source mittels einer WFS GetFeature Abfrage
    const pointVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSPointLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    // Instanziierung eines Vector Layers für Punkte mit der Source
    const pointVectorLayer = new VectorLayer({
      source: pointVectorSource,
      style: new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({
            color: "green",
          }),
        }),
      }),
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

    // Initialize OpenLayers map
    const map = new Map({
      layers: [swisstopoLayer, pointVectorLayer], // Füge den Linien-Layer hinzu
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

    // Function to handle feature selection
    const selectFeature = (feature) => {
      setSelectedFeature(feature.getProperties());
      map.getView().fit(feature.getGeometry().getExtent(), {
        duration: 500, // Optional: Animate the zooming process
        padding: [1000, 1000, 1000, 1000], // Optional: Add padding around the extent
      });
    };

    // Function to handle click event on features
    const handleClick = (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        selectFeature(feature);
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
  }, [location.search]);

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
        <h1>Test</h1>
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
              {/* If a restaurant is selected */}
              {selectedFeature.r_name && (
                <>
                  <h2>{selectedFeature.r_name}</h2>
                  <p>Öffnungszeiten: {selectedFeature.r_oeffnungszeiten}</p>
                  <p>Telefon: {selectedFeature.r_telefon}</p>
                  <p>Email: {selectedFeature.r_email}</p>
                  <p>Webseite: {selectedFeature.r_webseite}</p>
                </>
              )}

              {/* If a ski slope is selected */}
              {selectedFeature.p_name && (
                <>
                  <h2>{selectedFeature.p_name}</h2>
                  <p>Pistennummer: {selectedFeature.p_nummer}</p>
                  {/* <p>Status: {selectedFeature.p_status}</p> */}
                </>
              )}

              {/* If a facility is selected */}
              {selectedFeature.a_name && (
                <>
                  <p>Anlagennamen: {selectedFeature.a_name}</p>
                  <p>Höhendifferenz: {parseInt(selectedFeature.a_hoehe)}m</p>
                  {/* Add additional attributes you want to display here */}
                </>
              )}
            </div>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Test;
