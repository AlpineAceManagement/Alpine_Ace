import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Circle, Fill, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";

const Test = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [showMarker1, setShowMarker1] = useState(false);
  const [showMarker2, setShowMarker2] = useState(false);
  const [map, setMap] = useState(null);
  const [marker1Coord, setMarker1Coord] = useState(null);
  const [marker2Coord, setMarker2Coord] = useState(null);
  const [naviVectorSource, setNaviVectorSource] = useState(null); // Declare naviVectorSource variable
  const [geoserverWFSNaviLayer, setGeoserverWFSNaviLayer] = useState(
    "Alpine_Ace:a_a_shortest_path"
  ); // Declare geoserverWFSNaviLayer variable

  const handleButtonClick1 = () => {
    setShowMarker1(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        setMarker1Coord(centerCoord);
        addMarker1(centerCoord, "marker1");
      }
    }
  };

  const handleButtonClick2 = () => {
    setShowMarker2(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        setMarker2Coord(centerCoord);
        addMarker2(centerCoord, "marker2");
      }
    }
  };

  const handleHideMarker1 = () => {
    setShowMarker1(false);
    setMarker1Coord(null);
    // Remove marker1 from the map
  };

  const handleHideMarker2 = () => {
    setShowMarker2(false);
    setMarker2Coord(null);
    // Remove marker2 from the map
  };

  const addMarker1 = (coord, markerType) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/map-marker_green.svg",
        scale: 1.75,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker1(evt.coordinate);
    });
  };

  const addMarker2 = (coord, markerType) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/map-marker_purple.svg",
        scale: 1.75,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker2(evt.coordinate);
    });
  };

  const [nodeSource, setNodeSource] = useState(0);
  const fetchDataForMarker1 = (coordinate) => {
    const [x, y] = coordinate;
    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
    // Make a request to the generated URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("nodeSource:", id);
        setNodeSource(id); // Update the node_source variable with the ID
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };
  const [nodeTarget, setNodeTarget] = useState(0);
  const fetchDataForMarker2 = (coordinate) => {
    const [x, y] = coordinate;
    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
    // Make a request to the generated URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("nodetarget:", id);
        setNodeTarget(id); // Update the node_source variable with the ID
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };

  useEffect(() => {
    // Initialize map
    if (!map) {
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
      const geoserverWFSNaviLayer = "Alpine_Ace:a_a_shortest_path";
      const naviVectorSource = new VectorSource({
        format: new GeoJSON(),
        url: function (extent) {
          return (
            "http://localhost:8080/geoserver/wfs?service=WFS&" +
            "version=1.1.0&request=GetFeature&typename=" +
            geoserverWFSNaviLayer +
            "&viewparams=source:" +
            nodeSource +
            ";target:" +
            nodeTarget +
            "&outputFormat=application/json"
          );
        },
        strategy: bboxStrategy,
        onError: function (error) {
          console.error("Error fetching WFS line data:", error);
        },
      });

      const naviVectorLayer = new VectorLayer({
        source: naviVectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "orange",
            width: 4,
          }),
        }),
      });
      console.log("naviVectorSource", naviVectorSource);
      const newMap = new Map({
        layers: [swisstopoLayer, naviVectorLayer], // Use naviVectorLayer instead of geoserverWFSNaviLayer
        view: new View({
          center: [2762073, 1180429],
          zoom: 12,
          projection: new Projection({
            code: "EPSG:2056",
            units: "m",
          }),
        }),
      });

      newMap.setTarget(mapRef.current); // Set the target to the mapRef
      setMap(newMap);
    } else {
      // Update naviVectorSource URL with new nodeSource and nodeTarget
      if (naviVectorSource) {
        const newUrl =
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSNaviLayer +
          "&viewparams=source:" +
          nodeSource +
          ";target:" +
          nodeTarget +
          "&outputFormat=application/json";
        naviVectorSource.setUrl(newUrl);
      }
    }
  }, [map, nodeSource, nodeTarget]);

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
            width: "95vw",
            height: "60vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden", // Kein Overflow der Karte
          }}
        >
          <div
            ref={mapRef}
            style={{ width: "100%", height: "50%", borderRadius: "3vh" }}
          ></div>{" "}
        </Box>
        <Box
          sx={{
            width: "95vw",
            height: "15vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            style={{ width: "95%", margin: "auto", marginTop: "1vh" }} // Adjust the width, center the grid, and add top margin
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
          >
            <Grid item xs={6} className="button-navi-grid-item">
              <Button
                className="Navi-button"
                variant="contained"
                color="p_green"
                fullWidth
                sx={{
                  fontSize: "2.3vh",
                  "&.Mui-disabled": {
                    background: "#a9e37e",
                    color: "white",
                  },
                }}
                button
                onClick={handleButtonClick1}
                disabled={showMarker1}
              >
                Start
              </Button>{" "}
            </Grid>
            <Grid item xs={6} className="button-navi-grid-item">
              <Button
                className="Navi-button"
                variant="contained"
                color="p_purple"
                fullWidth
                sx={{
                  fontSize: "2.3vh",
                  "&.Mui-disabled": {
                    background: "#cc88ff",
                    color: "white",
                  },
                }}
                button
                onClick={handleButtonClick2}
                disabled={showMarker2}
              >
                Ziel
              </Button>
            </Grid>
            <Grid item xs={6} className="button-grid-item">
              <Button
                className="Navi-button"
                variant="contained"
                color="p_red"
                fullWidth
                sx={{ fontSize: "2.3vh" }}
              >
                reset
              </Button>
            </Grid>
          </Grid>
        </Box>

        <button onClick={handleButtonClick1} disabled={showMarker1}>
          Show Marker 1
        </button>
        <button onClick={handleButtonClick2} disabled={showMarker2}>
          Show Marker 2
        </button>
        {/* <button
        onClick={() => {
          handleHideMarker1();
          handleHideMarker2();
        }}
      >
        Reset Markers
      </button> */}
      </div>
    </ThemeProvider>
  );
};

export default Test;
