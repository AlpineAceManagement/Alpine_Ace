/* Karte mit Skipisten, Analgen, Övs, Parkplätzen und Restaurants darstellen  */
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import View from "ol/View";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { ThemeProvider } from "@mui/material/styles";
import { Projection } from "ol/proj";
import Box from "@mui/material/Box";
import theme from "./theme";
import { ZoomToExtent, defaults as defaultControls } from "ol/control.js";
import { createVectorSource } from "./kartenWFS.js";
import { SwisstopoLayer } from "./swisstopoLayer.js";
import {
  restaurantStyle,
  parkplatzStyle,
  oevStyle,
  anlagenStyle,
  pistenStyle,
} from "./kartenLayerStyle.js";

const Karte = () => {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    //WFS Anfrage für alle Restaurants aus kartenWFS.js
    const restaurantSource = createVectorSource("Restaurant", bboxStrategy);
    //WFS Anfrage für alle Parkplätze aus kartenWFS.js
    const parkplatzSource = createVectorSource("parkplatz", bboxStrategy);
    //WFS Anfrage für alle ÖV Haltestellen aus kartenWFS.js
    const oevSource = createVectorSource("oev", bboxStrategy);
    //WFS Anfrage für alle Pisten aus kartenWFS.js
    const pistenSource = createVectorSource("pisten", bboxStrategy);
    //WFS Anfrage für alle Anlagen aus kartenWFS.js
    const anlagenSource = createVectorSource("anlagen", bboxStrategy);

    // Restaurant Layer Styl aus kartenLayerStyle.js
    const restaurantLayer = new VectorLayer({
      source: restaurantSource,
      style: restaurantStyle(),
    });
    // Parkplätze Layer Styl aus kartenLayerStyle.js
    const parkplatzLayer = new VectorLayer({
      source: parkplatzSource,
      style: parkplatzStyle(),
    });
    // Haltestellen Layer Styl aus kartenLayerStyle.js
    const oevLayer = new VectorLayer({
      source: oevSource,
      style: oevStyle(),
    });
    //Pisten Layer Styl aus kartenLayerStyle.js
    const pistenLayer = new VectorLayer({
      source: pistenSource,
      style: pistenStyle,
    });
    // Anlagen Layer Styl aus kartenLayerStyle.js
    const styleFunction = function (feature) {
      return anlagenStyle(feature);
    };
    // Anlage Layer Styl aus kartenLayerStyle.js
    const anlagenLayer = new VectorLayer({
      source: anlagenSource,
      style: styleFunction,
    });

    //Definition des Kartenextents für WMS/WMTS
    const extent = [2420000, 130000, 2900000, 1350000];
    // WMS Winterlandeskarte holen mit der Funktion SwisstopoLayer aus dem File swisstopoLayer.js
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

    // Layer Reihenfolge festlegen, 0 ist zu zuunterst
    WMSwinterlandeskarteLayer.setZIndex(0);
    pistenLayer.setZIndex(1);
    anlagenLayer.setZIndex(2);
    parkplatzLayer.setZIndex(3);
    oevLayer.setZIndex(4);
    restaurantLayer.setZIndex(5);

    // Karte erstellen
    const map = new Map({
      //Zoom to Extent Button hinzufügen
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [2755375, 1164628, 2775625, 1195443],
        }),
      ]),
      layers: [
        WMSwinterlandeskarteLayer,
        pistenLayer,
        anlagenLayer,
        parkplatzLayer,
        oevLayer,
        restaurantLayer,
      ],
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

    // Funktion wen auf ein Vektorlayer geklickt wird
    const handleClick = (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        console.log("Feature Eigenschaften:", feature.getProperties());

        // Setzen von Mindest- und Maximalzoomstufen
        const minZoomLevel = 8; // Mindestzoomstufe
        const maxZoomLevel = 16; // Maximalzoomstufe
        map.getView().setMinZoom(minZoomLevel);
        map.getView().setMaxZoom(maxZoomLevel);

        // Zoom auf das ausgewählte Feature
        map.getView().fit(feature.getGeometry().getExtent(), {
          duration: 500, // Animationsdauer in Millisekunden
          padding: [1000, 1000, 1000, 1000], // Abstand des Features zum Rand
        });

        setSelectedFeature(feature.getProperties()); // Setzen des ausgewählten Features
      });
    };

    // Event-Handler für das Klicken auf Features hinzufügen
    map.on("click", handleClick);

    // Fenstergröße anpassen
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
            height: "55vh",
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
                  <h2>Haltestelle: {selectedFeature.o_name}</h2>
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
