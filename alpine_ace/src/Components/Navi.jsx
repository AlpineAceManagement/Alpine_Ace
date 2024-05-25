/* Code für die Navigation / Routing */
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
import config from "./Network/network_config";

const Navi = () => {
  const mapRef = useRef(null);
  const [showStartMarker, setShowStartMarker] = useState(false);
  const [showZielMarker, setShowZielMarker] = useState(false);
  const [map, setMap] = useState(null);
  const [startMarkerCoord, setMarkerStartCoord] = useState(null);
  const [zielMarkerCoord, setMarkerZielCoord] = useState(null);
  const [nodeSource, setNodeSource] = useState(1);
  const [nodeTarget, setNodeTarget] = useState(1);
  const [routeLayer, setVectorLayer] = useState(null);

  //Start Button
  const startButton = () => {
    setShowStartMarker(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      // Marker wird im Zentrum der Karte erstellt
      if (centerCoord) {
        setMarkerStartCoord(centerCoord);
        // Markertype startMarker festlegen
        addMarkerStart(centerCoord, "startMarker");
        fetchNearestVertex(centerCoord, setNodeSource);
      }
    }
  };

  //Ziel Button
  const zielButton = () => {
    setShowZielMarker(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      // Marker wird im Zentrum der Karte erstellt
      if (centerCoord) {
        setMarkerZielCoord(centerCoord);
        // Markertype zielMarker festlegen
        addMarkerZiel(centerCoord, "zielMarker");
        fetchNearestVertex(centerCoord, setNodeTarget);
      }
    }
  };

  // Refs für die Marker
  const vectorLayerStartRef = useRef(null);
  const vectorLayerZielRef = useRef(null);

  const vectorSourceStartRef = useRef(null);
  const vectorSourceZielRef = useRef(null);

  // Für das verteckten des Start Markers
  const handleHideStartMarker = () => {
    // Start Marker wird ausgebelndet
    setShowStartMarker(false);
    // Start Marker Koordianten auf null setzen
    setMarkerStartCoord(null);

    //wenn der Startvektorlayer exisitiert wird er entfernt
    if (map && vectorLayerStartRef.current) {
      map.removeLayer(vectorLayerStartRef.current);
      console.log("vectorLayerStart removed");
      vectorLayerStartRef.current = null; // auf null setzen
      if (vectorSourceStartRef.current) {
        vectorSourceStartRef.current.clear(); // Alle Features löschen
        vectorSourceStartRef.current = null; // auf null setzen
      }
    }
  };
  // Für das verteckten des Ziel Markers
  const handleHideZielMarker = () => {
    // Ziel Marker wird ausgebelndet
    setShowZielMarker(false);
    // Ziel Marker Koordianten auf null setzen
    setMarkerZielCoord(null);

    //wenn der Zielvektorlayer exisitiert wird er entfernt
    if (map && vectorLayerZielRef.current) {
      map.removeLayer(vectorLayerZielRef.current);
      console.log("vectorLayerStart removed");
      vectorLayerZielRef.current = null; // auf null setzen
      if (vectorSourceZielRef.current) {
        vectorSourceZielRef.current.clear(); // Alle Features löschen
        vectorSourceZielRef.current = null; // auf null setzen
      }
    }
  };

  // Basispfad für den den Ordner Karte_Symbole im Github Repository
  const basisPfadKartenSymbole =
    "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/";

  const addMarker = (coord, markerType, markerColor) => {
    // Marker style erstellen
    const markerStyle = new Style({
      image: new Icon({
        src: basisPfadKartenSymbole + markerColor,
        scale: 1.75,
        anchor: [0.5, 1],
      }),
    });

    // Marker erstellen
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    // Marker Style setzen
    markerFeature.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const MarkerLayer = new VectorLayer({
      source: vectorSource,
    });

    // Darstellungsreihenfolge festlegen (Marker zuoberst)
    MarkerLayer.setZIndex(5);
    map.addLayer(MarkerLayer);

    // Translate Interaktion hinzufügen um Marker verschieben zu können
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      // Herausfinden welcher Marker verschoben wurde
      markerType === "startMarker"
        ? // Wenn startMarker, setNodeSource herausfinden
          fetchDataForStartMarker(evt.coordinate)
        : // Wenn zielMarker, setNodeTarget herausfinden
          fetchDataForZielMarker(evt.coordinate);
    });

    // Wenn der startMarker verschoben wurde auf den vektorLayerStartRef setzen
    if (markerType === "startMarker") {
      vectorLayerStartRef.current = MarkerLayer;
      vectorSourceStartRef.current = vectorSource;
    }
    // Wenn der zielMarker verschoben wurde auf den vektorLayerZielRef setzen
    else if (markerType === "zielMarker") {
      vectorLayerZielRef.current = MarkerLayer;
      vectorSourceZielRef.current = vectorSource;
    }
  };

  // Start Marker  erstellen mit markerType und genauer svg Datei
  const addMarkerStart = (coord) => {
    addMarker(coord, "startMarker", "map-marker_green.svg");
  };
  // Ziel Marker erstellen mit markerType und genauer svg Datei
  const addMarkerZiel = (coord) => {
    addMarker(coord, "zielMarker", "map-marker_purple.svg");
  };

  // Mit SQL view a_a_nearest_vertex nächste Node ID herausfinden
  const fetchNearestVertex = (coordinate, setNodeId) => {
    const [x, y] = coordinate;

    // WFS Abfrage für die nächste Node ID, Parameter x und y
    const url = `${config.projectIPadress}:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const id = data.features[0].properties.id; // ID extrahieren
        console.log("Node ID:", id);
        setNodeId(id); // Node ID setzen
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Fehlermeldung
      });
  };
  // NodeSource herausfinden mit Koordinate von startMarker
  const fetchDataForStartMarker = (coordinate) => {
    fetchNearestVertex(coordinate, setNodeSource);
  };
  // NodeTarget herausfinden mit Koordinate von zielMarker
  const fetchDataForZielMarker = (coordinate) => {
    fetchNearestVertex(coordinate, setNodeTarget);
  };

  useEffect(() => {
    // Karte initialisieren
    if (!mapRef.current) return;
    //WFS Anfrage für alle Pisten
    const pistenSource = createVectorSource("pisten", bboxStrategy);
    //WFS Anfrage für alle Anlagen
    const anlagenSource = createVectorSource("anlagen", bboxStrategy);
    const extent = [2420000, 130000, 2900000, 1350000];
    // WMS Winterlandeskarte holen mit der Funktion SwisstopoLayer aus dem File swisstopoLayer.js
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);
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
    // Layer Reihenfolge festlegen, 0 ist zu zuunterst
    WMSwinterlandeskarteLayer.setZIndex(1);
    pistenLayer.setZIndex(2);
    anlagenLayer.setZIndex(3);
    // Karte erstellen
    const newMap = new Map({
      //Zoom to Extent Button hinzufügen
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

  // Funktion um den Route zu laden
  const handleLoadRoute = () => {
    if (!map) return; // Wenn die Karte initialisiert ist
    const newRouteLayer = routeLayer; // Route Layer

    if (newRouteLayer) {
      map.removeLayer(newRouteLayer); // Wenn bereits eine Route exisitiert, entfernen
    }
    //WFS Anfrage  der View a_a_shortest_path, für alle Route mit Funktion aus  aus kartenWFS.js
    // Parameter source und target
    const newRouteSource = createVectorSource(
      "a_a_shortest_path&viewparams=source:" +
        nodeSource +
        ";target:" +
        nodeTarget +
        ";",
      bboxStrategy
    );

    // naviStyl Layer Styl aus kartenLayerStyle.js
    const updatedRouteLayer = new VectorLayer({
      source: newRouteSource,
      style: naviStyl,
    });
    // Layer Reihenfolge festlegen
    setVectorLayer(updatedRouteLayer);
    updatedRouteLayer.setZIndex(4);
    map.addLayer(updatedRouteLayer);
  };
  // Wenn sich nodeSource oder nodeTarget ändern, wird die Route neu geladen
  useEffect(() => {
    handleLoadRoute();
  }, [nodeSource, nodeTarget]);

  // Funktion um Marker und Route zurückzusetzen vom Reset Button
  const resetMarkerUndRoute = () => {
    handleHideStartMarker();
    handleHideZielMarker();
    handleRemoveVectorLayer();
  };

  //Route Layer entfernen
  const handleRemoveVectorLayer = () => {
    if (!map || !routeLayer) return;
    map.removeLayer(routeLayer);
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
            style={{ width: "95%", margin: "auto", marginTop: "1vh" }}
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
                disabled={showStartMarker} // werden deaktiviert, wenn der Marker bereits gesetzt ist
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
                disabled={showZielMarker} // werden deaktiviert, wenn der Marker bereits gesetzt ist
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
                onClick={resetMarkerUndRoute}
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
