import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "../App.css";

const Skidaten = () => {
  //------------------------------------------------------------------------
  // Anziehen der Restaurant API :)
  //------------------------------------------------------------------------
  const [skiData, setSkiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/skidaten") // API Pfad zur DB
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        // Formater les données avec seulement 2 chiffres après la virgule, sauf pour Dauer
        const formattedData = data.map((item) => ({
          ...item,
          sd_hoehenmeter: parseFloat(item.sd_hoehenmeter).toFixed(2),
          sd_distanz: parseFloat(item.sd_distanz).toFixed(2),
          sd_geschwindigkeit: parseFloat(item.sd_geschwindigkeit).toFixed(2),
          sd_maxgeschwindigkeit: parseFloat(item.sd_maxgeschwindigkeit).toFixed(2),
        }));
        setSkiData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  //------------------------------------------------------------------------
  return (
    <ThemeProvider theme={theme}>
      <div
        className="main"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#282c34",
        }}
      >
        <Box
          sx={{
            width: "90vw",
            minHeight: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Statistiken</h1>
          {skiData.map((item) => (
            <Box
              key={item.Skidaten_ID}
              sx={{
                padding: "10px",
                border: "1px solid #",
                borderRadius: "16px", // Ajout de coins plus arrondis
                marginBottom: "10px",
                marginLeft: "10px", // Ajout de la marge à gauche
                marginRight: "10px", // Ajout de la marge à droite
                bgcolor: "#00112e",
              }}
            >
              <span style={{ color: "white"}}>Skitag</span>
              <span style={{color: "#ff6155" }}> {item.skidaten_id}</span><span style={{ color: "white"}}>:</span>
              <br />
              <span style={{ color: "white"}}>Höhenmeter:</span>
              <span style={{ marginLeft: 91 ,color: "#ff6155" }}> {item.sd_hoehenmeter}</span><span style={{ color: "white"}}> m</span>
              <br />
              <span style={{ color: "white"}}>Distanz:</span>
              <span style={{ marginLeft: 129 ,color: "#ff6155" }}> {item.sd_distanz}</span><span style={{ color: "white"}}> km</span>
              <br />
              <span style={{ color: "white"}}>Dauer:</span>
              <span style={{ marginLeft: 141 ,color: "#ff6155" }}> {item.sd_dauer}</span><span style={{ color: "white"}}> Std</span>
              <br />
              <span style={{ color: "white"}}>Geschwindigkeit:</span>
              <span style={{ marginLeft: 60 ,color: "#ff6155" }}> {item.sd_geschwindigkeit}</span><span style={{ color: "white"}}> km/h</span>
              <br />
              <span style={{ color: "white"}}>Max. Geschwindigkeit:</span>
              <span style={{ marginLeft: 20 ,color: "#ff6155" }}> {item.sd_maxgeschwindigkeit}</span><span style={{ color: "white"}}> km/h</span>
            </Box>
          ))}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Skidaten;
