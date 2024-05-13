import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import { Projection } from "ol/proj";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import theme from "../theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { createVectorSource } from "../kartenWFS.js";
import { SwisstopoLayer } from "../swisstopoLayer.js";
import { anlagenStyle, pistenStyle } from "../kartenLayerStyle.js";

const Test = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [showMarker1, setShowMarker1] = useState(false);
  const [showMarker2, setShowMarker2] = useState(false);
  const [map, setMap] = useState(null);
  const [marker1Coord, setMarker1Coord] = useState(null);
  const [marker2Coord, setMarker2Coord] = useState(null);
  const [nodeSource, setNodeSource] = useState(646);
  const [nodeTarget, setNodeTarget] = useState(6085);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [naviVectorSource, setNaviVectorSource] = useState(null); // Declare naviVectorSource variable
  const [geoserverWFSNaviLayer, setGeoserverWFSNaviLayer] = useState(
    "Alpine_Ace:a_a_shortest_path"
  );

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
  const vectorLayer1Ref = useRef(null);
  const vectorLayer2Ref = useRef(null);

  const vectorSource1Ref = useRef(null);
  const vectorSource2Ref = useRef(null);

  const handleHideMarker1 = () => {
    setShowMarker1(false);
    setMarker1Coord(null);

    // Remove marker1 layer from the map
    if (map && vectorLayer1Ref.current) {
      map.removeLayer(vectorLayer1Ref.current);
      console.log("vectorLayer1 removed");
      vectorLayer1Ref.current = null; // Reset the ref
      if (vectorSource1Ref.current) {
        vectorSource1Ref.current.clear(); // Clear features from the source
        vectorSource1Ref.current = null; // Reset the ref
      }
    }
  };

  const handleHideMarker2 = () => {
    setShowMarker2(false);
    setMarker2Coord(null);

    // Remove marker2 layer from the map
    if (map && vectorLayer2Ref.current) {
      map.removeLayer(vectorLayer2Ref.current);
      console.log("vectorLayer2 removed");
      vectorLayer2Ref.current = null; // Reset the ref
      if (vectorSource2Ref.current) {
        vectorSource2Ref.current.clear(); // Clear features from the source
        vectorSource2Ref.current = null; // Reset the ref
      }
    }
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
    vectorLayer.setZIndex(5);
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker1(evt.coordinate);
    });

    // Update the refs
    vectorLayer1Ref.current = vectorLayer;
    vectorSource1Ref.current = vectorSource;
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
    vectorLayer.setZIndex(5);
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker2(evt.coordinate);
    });

    // Update the refs
    vectorLayer2Ref.current = vectorLayer;
    vectorSource2Ref.current = vectorSource;
  };
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
      // Use a different variable name to prevent confusion
      source: newVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    setVectorLayer(updatedVectorLayer);
    updatedVectorLayer.setZIndex(2);
    map.addLayer(updatedVectorLayer);
  };

  useEffect(() => {
    handleLoadVectorData();
  }, [nodeSource, nodeTarget]);

  const handleButtonClick = () => {
    // Change the values of nodeSource and nodeTarget
    console.log(nodeSource, nodeTarget);
    setNodeSource(6049);
    setNodeTarget(6085);
    console.log(nodeSource, nodeTarget);
    addMarker1([2762640.8, 1179359.1], "marker1");
    addMarker2([2762640.8, 1179359.1], "marker2");
  };
  const resetMarker = () => {
    handleHideMarker1();
    handleHideMarker2();
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

export default Test;
