import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "../App.css";

const Skidaten = () => {
  const [skiData, setSkiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortByDateDesc, setSortByDateDesc] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState("Alle Saison");

  useEffect(() => {
    fetch("http://localhost:5000/api/skidaten")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
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

  const toggleSortOrder = () => {
    setSortByDateDesc((prevSortByDateDesc) => !prevSortByDateDesc);
  };

  const handleSeasonChange = (event) => {
    setSeasonFilter(event.target.value);
  };

  const seasons = Array.from(new Set(skiData.map((item) => item.sd_saison)));
  seasons.unshift("Alle Saison");

  const filteredSkiData = skiData.filter((item) => seasonFilter === "Alle Saison" || item.sd_saison === seasonFilter);

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
          <h1 style={{ textAlign: "center", marginTop: "10px" }}>Statistiken</h1>
          
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <div style={{ position: "relative" }}>
              <select 
                value={seasonFilter} 
                onChange={handleSeasonChange} 
                style={{ 
                  backgroundColor: "#ff6155", 
                  color: "white", 
                  padding: "8px", 
                  border: "None", 
                  borderRadius: "4px" 
                }}
              >
                {seasons.map((season, index) => (
                  <option key={index} value={season}>
                    {season}
                  </option>
                ))}
              </select>
              <button 
                onClick={toggleSortOrder} 
                className="app-button" 
                style={{ 
                  backgroundColor: "#ff6155", 
                  color: "white", 
                  padding: "8px", 
                  border: "None", 
                  borderRadius: "4px",
                  marginLeft: "10px" 
                }}
              >
                {sortByDateDesc ? "Neu -> Alt" : "Alt -> Neu"}
              </button>
            </div>
          </Box>

          {filteredSkiData
            .slice()
            .sort((a, b) => {
              return sortByDateDesc ? new Date(b.sd_date) - new Date(a.sd_date) : new Date(a.sd_date) - new Date(b.sd_date);
            })
            .map((item) => (
              <Box
                key={item.Skidaten_ID}
                sx={{
                  padding: "10px",
                  border: "1px solid #",
                  borderRadius: "16px",
                  marginBottom: "10px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  bgcolor: "#00112e",
                }}
              >
                <span style={{ color: "white" }}>Saison: </span>
                <span style={{ marginLeft: 135, color: "#ff6155" }}>{item.sd_saison}</span>
                <br />
                <span style={{ color: "white" }}>Datum: </span>
                <span style={{ marginLeft: 136, color: "#ff6155" }}>
                  {item.sd_date.split("T")[0].split("-").reverse().join("/")}
                </span>
                <br />
                <span style={{ color: "white" }}>Höhenmeter: </span>
                <span style={{ marginLeft: 91, color: "#ff6155" }}>{item.sd_hoehenmeter}</span>
                <span style={{ color: "white" }}> m</span>
                <br />
                <span style={{ color: "white" }}>Distanz: </span>
                <span style={{ marginLeft: 129, color: "#ff6155" }}>{item.sd_distanz}</span>
                <span style={{ color: "white" }}> km</span>
                <br />
                <span style={{ color: "white" }}>Dauer: </span>
                <span style={{ marginLeft: 141, color: "#ff6155" }}>{item.sd_dauer}</span>
                <span style={{ color: "white" }}> Std</span>
                <br />
                <span style={{ color: "white" }}>Geschwindigkeit: </span>
                <span style={{ marginLeft: 60, color: "#ff6155" }}>{item.sd_geschwindigkeit}</span>
                <span style={{ color: "white" }}> km/h</span>
                <br />
                <span style={{ color: "white" }}>Max. Geschwindigkeit: </span>
                <span style={{ marginLeft: 20, color: "#ff6155" }}>{item.sd_maxgeschwindigkeit}</span>
                <span style={{ color: "white" }}> km/h</span>
              </Box>
            ))}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Skidaten;
