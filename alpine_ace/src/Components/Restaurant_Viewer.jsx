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
import { Icon, Style } from "ol/style";
import { ThemeProvider } from "@mui/material/styles";
import { Projection } from "ol/proj";
import Box from "@mui/material/Box";
import theme from "./theme";

const Restaurant_Viewer = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [map, setMap] = useState(null);
  const [Restaurant_ID, setRestaurant_ID] = useState(1);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    // Extrahieren der Restaurant_ID aus der URL
    const getRestaurant_IDFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const Restaurant_ID = params.get("Restaurant_ID");
      if (Restaurant_ID) {
        setRestaurant_ID(Restaurant_ID);
        console.log("Restaurant_ID parameter found in URL:", Restaurant_ID);
      } else {
        console.error("Restaurant_ID parameter not found in URL.");
      }
    };

    getRestaurant_IDFromURL();
  }, []);

  useEffect(() => {
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";

    //WFS Anfrage für das ausgewählte Restaurant
    const restaurantAnfrageSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:a_a_restaurant&viewparams=Restaurant_ID:" +
          Restaurant_ID + // Die Restaurant_ID von der URL
          ";" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    const extent = [2420000, 130000, 2900000, 1350000];

    //Basis Swisstopo Winter Layer
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

    //Restaurant Anfrage Layer Styl
    const restaurantAnfrageLayer = new VectorLayer({
      source: restaurantAnfrageSource,
      style: new Style({
        image: new Icon({
          src: "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/restaurant.svg",
          scale: 0.15,
          anchor: [0.5, 0.5],
        }),
      }),
    });

    // Darstellungsreihenfolge der Layer festlegen
    swisstopoLayer.setZIndex(0);
    restaurantAnfrageLayer.setZIndex(1);

    // Karte erstellen
    const map = new Map({
      layers: [swisstopoLayer, restaurantAnfrageLayer], // angezeigte Layer definieren
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

    restaurantAnfrageSource.on("change", () => {
      if (restaurantAnfrageSource.getState() === "ready") {
        const features = restaurantAnfrageSource.getFeatures();
        if (features.length > 0) {
          const featureProperties = features[0].getProperties();
          // Restaurant Informationen setzen von der Anfrage
          setRestaurantInfo({
            r_name: featureProperties.r_name || "",
            r_oeffnungszeiten: featureProperties.r_oeffnungszeiten || "",
            r_telefon: featureProperties.r_telefon || "",
            r_email: featureProperties.r_email || "",
            r_webseite: featureProperties.r_webseite || "",
          });

          // Karte auf das Restaurant zentrieren mit Animation
          const geometry = features[0].getGeometry();
          const coordinates = geometry.getCoordinates();
          map.getView().animate({
            center: coordinates,
            zoom: 16, // Zoomstufe an Zielposition
            duration: 1, // Dauer der Animation in ms
          });
        }
      }
    });

    return () => {
      map.setTarget(null);
    };
  }, [Restaurant_ID]);

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
            height: "50vh",
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
        <Box //Box für die Restaurant Informationen
          sx={{
            width: "95vw",
            minHeight: "20vh",
            borderRadius: "3vw",
            bgcolor: "p_white.main",
            position: "relative",
            overflowY: "auto",
          }}
        >
          <div className="informationen-karte">
            {/* Titel Restaurant Name */}
            <h2>{restaurantInfo.r_name}</h2>
            <p>
              {/* Weitere Informationen */}
              <strong>Öffnungszeiten</strong> {restaurantInfo.r_oeffnungszeiten}
            </p>
            <p>
              <strong>Telefon:</strong> {restaurantInfo.r_telefon}
            </p>
            <p>
              <strong>Email:</strong> {restaurantInfo.r_email}
            </p>
            <p>
              {/*Link auf Webseite */}
              <strong>Webseite: </strong>
              {restaurantInfo.r_webseite && (
                <a
                  href={restaurantInfo.r_webseite}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }} // Link wird immer gleich angezigt auch wenn dieser schon verwendet wurde
                >
                  {restaurantInfo.r_webseite}
                </a>
              )}
            </p>
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Restaurant_Viewer;
