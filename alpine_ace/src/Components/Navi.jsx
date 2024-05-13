import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import { Projection } from "ol/proj";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import theme from "./theme";
import { ZoomToExtent, defaults as defaultControls } from "ol/control.js";
import { ThemeProvider } from "@mui/material/styles";
import { createVectorSource } from "./kartenWFS.js";
import { SwisstopoLayer } from "./swisstopoLayer.js";
import { anlagenStyle, pistenStyle, naviStyl } from "./kartenLayerStyle.js";

const Navi = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [showStartMarker, setShowStartMarker] = useState(false);
  const [showZielMarker, setShowZielMarker] = useState(false);
  const [map, setMap] = useState(null);
  const [startMarkerCoord, setMarkerStartCoord] = useState(null);
  const [zielMarkerCoord, setMarkerZielCoord] = useState(null);
  const [nodeSource, setNodeSource] = useState(1);
  const [nodeTarget, setNodeTarget] = useState(1);
  const [vectorLayer, setVectorLayer] = useState(null);

  const startButton = () => {
    setShowStartMarker(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();

      if (centerCoord) {
        setMarkerStartCoord(centerCoord);
        addMarkerStart(centerCoord, "startMarker");
        fetchNearestVertex(centerCoord, setNodeSource);
      }
    }
  };

  const zielButton = () => {
    setShowZielMarker(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();

      if (centerCoord) {
        setMarkerZielCoord(centerCoord);
        addMarkerZiel(centerCoord, "zielMarker");
        fetchNearestVertex(centerCoord, setNodeTarget);
      }
    }
  };
  const vectorLayerStartRef = useRef(null);
  const vectorLayerZielRef = useRef(null);

  const vectorSourceStartRef = useRef(null);
  const vectorSourceZielRef = useRef(null);

  const handleHideStartMarker = () => {
    setShowStartMarker(false);
    setMarkerStartCoord(null);

    // Remove Start layer from the map
    if (map && vectorLayerStartRef.current) {
      map.removeLayer(vectorLayerStartRef.current);
      console.log("vectorLayer1 removed");
      vectorLayerStartRef.current = null; // Reset the ref
      if (vectorSourceStartRef.current) {
        vectorSourceStartRef.current.clear(); // Clear features from the source
        vectorSourceStartRef.current = null; // Reset the ref
      }
    }
  };

  const handleHideZielMarker = () => {
    setShowZielMarker(false);
    setMarkerZielCoord(null);

    // Remove  Ziel marker layer from the map
    if (map && vectorLayerZielRef.current) {
      map.removeLayer(vectorLayerZielRef.current);
      console.log("vectorLayer2 removed");
      vectorLayerZielRef.current = null; // Reset the ref
      if (vectorSourceZielRef.current) {
        vectorSourceZielRef.current.clear(); // Clear features from the source
        vectorSourceZielRef.current = null; // Reset the ref
      }
    }
  };
  const basisPfadKartenSymbole =
    "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/";

  const addMarker = (coord, markerType, markerColor) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: basisPfadKartenSymbole + markerColor,
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
    vectorLayer.setZIndex(5);
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      markerType === "startMarker"
        ? fetchDataForStartMarker(evt.coordinate)
        : fetchDataForZielMarker(evt.coordinate);
    });

    // Update the refs based on the marker type
    if (markerType === "startMarker") {
      vectorLayerStartRef.current = vectorLayer;
      vectorSourceStartRef.current = vectorSource;
    } else {
      vectorLayerZielRef.current = vectorLayer;
      vectorSourceZielRef.current = vectorSource;
    }
  };

  // Usage:
  const addMarkerStart = (coord) => {
    addMarker(coord, "startMarker", "map-marker_green.svg");
  };

  const addMarkerZiel = (coord) => {
    addMarker(coord, "zielMarker", "map-marker_purple.svg");
  };

  const fetchNearestVertex = (coordinate, setNodeId) => {
    const [x, y] = coordinate;

    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("Node ID:", id);
        setNodeId(id); // Update the node ID variable with the fetched ID
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };

  const fetchDataForStartMarker = (coordinate) => {
    fetchNearestVertex(coordinate, setNodeSource);
  };

  const fetchDataForZielMarker = (coordinate) => {
    fetchNearestVertex(coordinate, setNodeTarget);
  };

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) return;
    //WFS Anfrage für alle Pisten
    const pistenSource = createVectorSource("pisten", bboxStrategy);
    //WFS Anfrage für alle Anlagen
    const anlagenSource = createVectorSource("anlagen", bboxStrategy);
    const extent = [2420000, 130000, 2900000, 1350000];
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

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

    WMSwinterlandeskarteLayer.setZIndex(0);
    pistenLayer.setZIndex(1);
    anlagenLayer.setZIndex(2);
    const newMap = new Map({
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [2755375, 1164628, 2775625, 1195443],
        }),
      ]),
      layers: [WMSwinterlandeskarteLayer, pistenLayer, anlagenLayer],
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

    setMap(newMap);

    return () => {
      newMap.setTarget(null);
    };
  }, []);

  const handleLoadVectorData = () => {
    if (!map) return; // Check if map is initialized
    console.log("clicked");

    const newVectorLayer = vectorLayer; // Store the current vectorLayer reference

    if (newVectorLayer) {
      map.removeLayer(newVectorLayer);
      console.log("newVectorLayer removed");
    }

    const newVectorSource = createVectorSource(
      "a_a_shortest_path&viewparams=source:" +
        nodeSource +
        ";target:" +
        nodeTarget +
        ";",
      bboxStrategy
    );

    const updatedVectorLayer = new VectorLayer({
      source: newVectorSource,
      style: naviStyl,
    });

    setVectorLayer(updatedVectorLayer);
    updatedVectorLayer.setZIndex(2);
    map.addLayer(updatedVectorLayer);
  };

  useEffect(() => {
    handleLoadVectorData();
  }, [nodeSource, nodeTarget]);

  const resetMarker = () => {
    handleHideStartMarker();
    handleHideZielMarker();
    handleRemoveVectorLayer();
  };

  const handleRemoveVectorLayer = () => {
    if (!map || !vectorLayer) return;
    map.removeLayer(vectorLayer);
    setVectorLayer(null);
  };

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
        <h1>Navi</h1>
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
            style={{ width: "100%", height: "100%", borderRadius: "3vh" }}
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
                onClick={startButton}
                disabled={showStartMarker}
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
                onClick={zielButton}
                disabled={showZielMarker}
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
                onClick={resetMarker} // This should call handleLoadVectorData function
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Navi;
