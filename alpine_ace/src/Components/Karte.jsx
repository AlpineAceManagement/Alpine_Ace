import React, { useEffect, useRef } from "react";
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

const Karte = () => {
  const mapRef = useRef(null); // Reference to the map container

  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSPointLayer = "Alpine_Ace:Restaurant"; // Geoserver WFS Layername

    // Instanziierung einer Vector Source mittels einer WFS GetFeature Abfrage
    const vectorSource = new VectorSource({
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
    });

    // Instanziierung eines Vector Layers mit einer Source und der Darstellung
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({
            color: "red",
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
          LAYERS: "ch.swisstopo.pixelkarte-grau-pk1000.noscale",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
    });

    // Initialize OpenLayers map
    // Initialize OpenLayers map
    const map = new Map({
      layers: [swisstopoLayer, vectorLayer],
      target: mapRef.current,
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    // Update the size of the map when the window is resized
    window.addEventListener("resize", () => {
      map.updateSize();
    });

    return () => {
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
        <h1>Karte</h1>
        <Box
          sx={{
            width: "45vh",
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
          sx={{
            width: "45vh",
            height: "25vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
          }}
        ></Box>
      </div>
    </ThemeProvider>
  );
};

export default Karte;
