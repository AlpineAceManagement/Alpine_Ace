import React from "react"; // Add this line
import { render } from "react-dom";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";

const Wetter = () => {
  //------------------------------------------------------------------------
  // Anziehen der Restaurant API :)
  //------------------------------------------------------------------------
  const [weathertData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/prognose") // API Pfad zur DB
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data", error);
        setError(error);
        setLoading(false);
      });
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
          color: "#282c34",
        }}
      >
        {weathertData.map(
          (
            restaurant //Mapen nach Restaurantnamen, key ist id der DB
          ) => (
            <Box
              sx={{
                width: "90vw",
                minHeight: "95vh",
                borderRadiu: 4,
                bgcolor: "p_white.main",
                marginBottom: "10px",
                overflowY: "auto",
              }}
            >
              <h1 style={{ textAlign: "center" }}>Wetter</h1>
              <div key={weathertData.prognose_id}>
                <h3>{weathertData.prognose_id}</h3>
              </div>
            </Box>
          )
        )}
      </div>
    </ThemeProvider>
  );
};

export default Wetter;
