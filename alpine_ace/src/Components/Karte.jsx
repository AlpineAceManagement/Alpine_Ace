import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import {
  MapContainer,
  WMSTileLayer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "../App.css";

const Karte = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
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
            {" "}
            <link
              rel="stylesheet"
              href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"
            />
            <MapContainer
              style={{ borderRadius: "3vh", width: "45vh", height: "50vh" }}
              center={[46.7402, 9.55602]}
              zoom={12}
              scrollWheelZoom={true}
            >
              <TileLayer
                transparent={true}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe-winter/default/current/3857/{z}/{x}/{y}.jpeg"
              />

              <WMSTileLayer
                layers="testuebung:Pisten"
                url="http://localhost:8080/geoserver/testuebung/wms"
                format="image/png"
                transparent={true}
                tileSize={512}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* {position && (
                <Marker position={position}>
                  <Popup>Your current location</Popup>
                </Marker>
              )} */}
            </MapContainer>
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Karte;
