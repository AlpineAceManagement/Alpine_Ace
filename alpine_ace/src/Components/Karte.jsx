import React from "react";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const theme = createTheme({
  palette: {
    p_red: {
      main: "#FF6155",
      light: "#ff7754",
      dark: "#cc4d43",
      contrastText: "white",
    },
    p_white: {
      main: "white",
      contrastText: "black",
    },
  },
});

const Karte = () => {
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
        <h1 style={{ color: "black" }}>Karte</h1>
        <Box
          sx={{
            width: "45vh",
            height: "50vh",
            borderRadius: 4,
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
            <MapContainer
              style={{ width: "100%", height: "100%" }}
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Box>
        <h1 style={{ color: "black" }}>schwarze bitte</h1>
      </div>
    </ThemeProvider>
  );
};

export default Karte;
