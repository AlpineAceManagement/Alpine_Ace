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
<<<<<<< HEAD

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

=======
import { Link } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "../App.css";
import { Vega } from "react-vega";
import wellknown from "wellknown";

const GPX_Viewer = () => {
  const [geometryData, setGeometryData] = useState(""); // Assume you have geometry data in WKT format

  // Fetch geometry data from API
  useEffect(() => {
    fetch("http://localhost:5000/api/skidaten")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the geometry data is stored in the "sd_geometrie" field of each item
        const firstItem = data[0];
        if (firstItem && firstItem.sd_geometrie) {
          setGeometryData(firstItem.sd_geometrie);
        }
      })
      .catch((error) => console.error("Error fetching geometry data:", error));
  }, []);

  // Parse the WKT geometry
  const parsedGeometry = geometryData ? wellknown.parse(geometryData) : null;

  // Check if parsedGeometry is not null before accessing its properties
  const lineData =
    parsedGeometry && parsedGeometry.coordinates
      ? parsedGeometry.coordinates.map((coord) => ({
          x: coord[0],
          y: coord[1],
        }))
      : [];

  // Vega specification for plotting geometry with zoom
  const vegaSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 400,
    height: 200,
    padding: 5,

    data: [
      {
        name: "lineData",
        values: lineData,
      },
    ],

    scales: [
      {
        name: "x",
        type: "linear",
        range: "width",
        zero: false,
        domain: { data: "lineData", field: "x" },
      },
      {
        name: "y",
        type: "linear",
        range: "height",
        zero: false,
        domain: { data: "lineData", field: "y" },
      },
    ],

    marks: [
      {
        type: "line",
        from: { data: "lineData" },
        encode: {
          enter: {
            x: { scale: "x", field: "x" },
            y: { scale: "y", field: "y" },
            stroke: { value: "steelblue" },
            strokeWidth: { value: 2 },
          },
        },
      },
    ],
  };

>>>>>>> 8e1bf0f03fc1bfd4c0841a49becb80cc40b43a22
  return (
    <ThemeProvider theme={theme}>
      <div
        className="main"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
<<<<<<< HEAD
=======
          color: "#282c34",
>>>>>>> 8e1bf0f03fc1bfd4c0841a49becb80cc40b43a22
        }}
      >
        <Box
          sx={{
            width: "90vw",
<<<<<<< HEAD
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
=======
            minHeight: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Link
            to="/Statistiken"
            style={{
              textDecoration: "none",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <button
              style={{
                backgroundColor: "#ff6155",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            >
              Stats
            </button>
          </Link>
          <Link
            to="/Graph"
            style={{
              textDecoration: "none",
              position: "absolute",
              top: "50px",
              right: "10px",
            }}
          >
            <button
              style={{
                backgroundColor: "#ff6155",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Graph
            </button>
          </Link>

          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            GPX Viewer
          </h1>

          {/* Vega chart */}
          <div id="vega-container">
            <Vega spec={vegaSpec} renderer="svg" />
          </div>
>>>>>>> 8e1bf0f03fc1bfd4c0841a49becb80cc40b43a22
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default GPX_Viewer;
