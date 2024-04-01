import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { MapContainer, WMSTileLayer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "../App.css";

const customIcon = L.icon({
  iconUrl: require("./Karte_Symbole/map-marker-512.webp"),
  iconSize: [64, 64],
  iconAnchor: [32, 58],
  popupAnchor: [0, -32],
});

const Karte = () => {
  const [position, setPosition] = useState(null);
  const [geolocationError, setGeolocationError] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setGeolocationError(true);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const zoomToMarker = () => {
    if (mapRef.current && position) {
      mapRef.current.setView(position, 15);
    }
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
        <h1>Karte</h1>
        <Box
          sx={{
            width: "45vh",
            height: "50vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <link
              rel="stylesheet"
              href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"
            />
            <MapContainer
              ref={mapRef}
              style={{ borderRadius: "3vh", width: "45vh", height: "50vh" }}
              center={[46.72756, 9.55735]}
              zoom={12}
              scrollWheelZoom={true}
            >
              {/* <TileLayer
                transparent={true}
                url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe-winter/default/current/3857/{z}/{x}/{y}.jpeg"
              /> */}

              <WMSTileLayer
                layers="Alpine_Ace:restaurant"
                url="http://localhost:8080/geoserver/Alpine_Ace/wms"
                format="image/png"
                transparent={true}
                tileSize={512}
              />
              {/* <WMSTileLayer
                layers="Alpine_Ace:anlagen"
                url="http://localhost:8080/geoserver/Alpine_Ace/wms"
                format="image/png"
                transparent={true}
                tileSize={512}
              /> */}

              {/* <WMSTileLayer
                layers="Alpine_Ace:pisten"
                url="http://localhost:8080/geoserver/Alpine_Ace/wms"
                format="image/png"
                transparent={true}
                tileSize={512}
              /> */}
              {position && (
                <Marker position={position} icon={customIcon}></Marker>
              )}
            </MapContainer>
          </div>
        </Box>
        <Box
          sx={{
            width: "45vh",
            height: "30vh",
            borderRadius: "3vh",
            bgcolor: "p_white.main",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <button onClick={zoomToMarker}>Zoom to Marker</button>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Karte;
