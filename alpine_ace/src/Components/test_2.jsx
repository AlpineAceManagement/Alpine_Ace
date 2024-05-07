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
import { useParams } from "react-router-dom";

const GPX_Viewer = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [map, setMap] = useState(null);
  const [Skidaten_ID, setSkidaten_ID] = useState(1); // State to store Skidaten_ID
  const mapRef = useRef(null); // Reference to the map container

  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

  useEffect(() => {
    // Function to extract Skidaten_ID from URL
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

    // Call the function when the component mounts
    getSkidatenIDFromURL();
  }, []);

  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";

    // Create a new VectorSource with updated URL when Skidaten_ID changes
    const wegVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          console.log("WFS Anfrage:", Skidaten_ID),
          geoserverWFSAnfrage +
            "Alpine_Ace:a_a_skidaten_weg&viewparams=Skidaten_ID:" +
            Skidaten_ID +
            ";" +
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
    const wegVectorLayer = new VectorLayer({
      source: wegVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
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
    swisstopoLayer.setZIndex(0);
    wegVectorLayer.setZIndex(1);

    // Initialize OpenLayers map
    const map = new Map({
      layers: [swisstopoLayer, wegVectorLayer], // Füge den Linien-Layer hinzu
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
    map.setTarget(mapRef.current); // Set the target to the mapRef
    setMap(map);
    setMapInstance(map);

    // Cleanup function
    return () => {
      map.setTarget(null); // Remove the map target when the component unmounts
    };
  }, [Skidaten_ID]);

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
            width: "95vw",
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
