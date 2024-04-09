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
        setSkiData(data);
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
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              <p>Höhenmeter: {item.sd_hoehenmeter}</p>
              <p>Distanz: {item.sd_distanz}</p>
              <p>Dauer: {item.sd_dauer}</p>
              <p>Geschwindigkeit: {item.sd_geschwindigkeit}</p>
              <p>Max. Geschwindigkeit: {item.sd_maxgeschwindigkeit}</p>
            </Box>
          ))}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Skidaten;
