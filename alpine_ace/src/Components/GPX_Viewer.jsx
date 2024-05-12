import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import View from "ol/View";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { Stroke, Style } from "ol/style";
import { ThemeProvider } from "@mui/material/styles";
import { Projection } from "ol/proj";
import Box from "@mui/material/Box";
import theme from "./theme";
import { SwisstopoLayer } from "./swisstopoLayer";
import { createVectorSource } from "./kartenWFS";

const GPX_Viewer = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [map, setMap] = useState(null);
  const [Skidaten_ID, setSkidaten_ID] = useState(1); // State to store Skidaten_ID
  const mapRef = useRef(null); // Reference to the map container

  useEffect(() => {
    // Extrahieren der Skidaten_ID aus der URL
    const getSkidatenIDFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const Skidaten_ID = params.get("Skidaten_ID");
      if (Skidaten_ID) {
        setSkidaten_ID(Skidaten_ID);
        console.log("Skidaten_ID parameter found in URL:", Skidaten_ID);
      } else {
        console.error("Skidaten_ID parameter not found in URL.");
      }
    };

    getSkidatenIDFromURL();
  }, []);

  useEffect(() => {
    //WFS Anfrage für das ausgewählte Skidaten Aufnahme
    const skidatenAnfrageSource = createVectorSource(
      "a_a_skidaten_weg&viewparams=Skidaten_ID:" + Skidaten_ID + ";",
      bboxStrategy
    );

    //Skidaten Anfrage Layer Styl
    const skidatenAnfrageLayer = new VectorLayer({
      source: skidatenAnfrageSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    //Definition des Kartenextents für WMS/WMTS
    const extent = [2420000, 130000, 2900000, 1350000];
    // WMS Winterlandeskarte holen mit der Funktion SwisstopoLayer aus dem File swisstopoLayer.js
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

    // Darstellungsreihenfolge der Layer festlegen
    WMSwinterlandeskarteLayer.setZIndex(0);
    skidatenAnfrageLayer.setZIndex(1);

    // Karte erstellen
    const map = new Map({
      layers: [WMSwinterlandeskarteLayer, skidatenAnfrageLayer], // angezeigte Layer definieren
      target: mapRef.current,
      view: new View({
        center: [2762640.8, 1179359.1], // Zentrum der Karte
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });
    map.setTarget(mapRef.current);
    setMap(map);
    setMapInstance(map);

    // löscht die Karte, wenn die Komponente entfernt wird,
    // wichtig wenn eine andere Aufnahmen aufgerufen wird
    return () => {
      map.setTarget(null);
    };
  }, [Skidaten_ID]);

  return (
    // Theme wird aufgerufen
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
            // Styling der Karten Box
            width: "95vw",
            height: "80vh",
            borderRadius: "3vw",
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
              borderRadius: "3vw",
            }}
          ></div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default GPX_Viewer;
