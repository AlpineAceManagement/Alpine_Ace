import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "../App.css";

const Statistiken = () => {
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
          skidaten_id: parseInt(item.skidaten_id),
          sd_hoehenmeter: parseFloat(item.sd_hoehenmeter).toFixed(2),
          sd_distanz: parseFloat(item.sd_distanz).toFixed(2),
          sd_geschwindigkeit: parseFloat(item.sd_geschwindigkeit).toFixed(2),
          sd_maxgeschwindigkeit: parseFloat(item.sd_maxgeschwindigkeit).toFixed(
            2
          ),
        }));
        setSkiData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ski data", error);
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

  const filteredSkiData = skiData.filter(
    (item) => seasonFilter === "Alle Saison" || item.sd_saison === seasonFilter
  );

  const sortedSeasons = seasons.sort().reverse();

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
            width: "95vw",
            minHeight: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto",
            position: "relative", // Ajout de la position relative
          }}
        >
          {/* Bouton pour naviguer vers la page Graph */}
          <Link
            to="/Graph"
            style={{
              textDecoration: "none",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <button
              style={{
                backgroundColor: "#ff6155",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Graph
            </button>
          </Link>

          <h1 style={{ textAlign: "center", marginTop: "10px" }}>
            Statistiken
          </h1>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ position: "relative" }}>
              <Select
                value={seasonFilter}
                onChange={handleSeasonChange}
                displayEmpty
                inputProps={{ "aria-label": "Season" }}
                sx={{
                  backgroundColor: "#ff6155",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {sortedSeasons.map((season, index) => (
                  <MenuItem key={index} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </Select>
              <button
                onClick={toggleSortOrder}
                className="app-button"
                style={{
                  backgroundColor: "#ff6155",
                  marginLeft: "10px",
                  color: "white",
                  padding: "18px 24px", // Taille du bouton similaire à celle du dropdown
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px", // Taille de la police similaire à celle du dropdown
                }}
              >
                {sortByDateDesc ? "Neu -> Alt" : "Alt -> Neu"}
              </button>
            </div>
          </Box>

          {filteredSkiData
            .slice()
            .sort((a, b) => {
              return sortByDateDesc
                ? new Date(b.sd_date) - new Date(a.sd_date)
                : new Date(a.sd_date) - new Date(b.sd_date);
            })
            .map((item) => (
              <Link
                key={item.skidaten_id}
                to={`/GPX_Viewer?Skidaten_ID=${item.skidaten_id}`} // Link auf GPX_Viewer
                style={{ textDecoration: "none" }}
              >
                <Box
                  key={item.skidaten_id}
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
                  <span style={{ marginLeft: 135, color: "#9eff55" }}>
                    {item.sd_saison}
                  </span>
                  <br />
                  <span style={{ color: "white" }}>Datum: </span>
                  <span style={{ marginLeft: 136, color: "#9eff55" }}>
                    {item.sd_date.split("T")[0].split("-").reverse().join("/")}
                  </span>
                  <br />
                  <span style={{ color: "white" }}>Höhenmeter: </span>
                  <span style={{ marginLeft: 91, color: "#9eff55" }}>
                    {item.sd_hoehenmeter}
                  </span>
                  <span style={{ color: "white" }}> m</span>
                  <br />
                  <span style={{ color: "white" }}>Distanz: </span>
                  <span style={{ marginLeft: 129, color: "#9eff55" }}>
                    {item.sd_distanz}
                  </span>
                  <span style={{ color: "white" }}> km</span>
                  <br />
                  <span style={{ color: "white" }}>Dauer: </span>
                  <span style={{ marginLeft: 141, color: "#9eff55" }}>
                    {item.sd_dauer}
                  </span>
                  <span style={{ color: "white" }}> Std</span>
                  <br />
                  <span style={{ color: "white" }}>Geschwindigkeit: </span>
                  <span style={{ marginLeft: 60, color: "#9eff55" }}>
                    {item.sd_geschwindigkeit}
                  </span>
                  <span style={{ color: "white" }}> km/h</span>
                  <br />
                  <span style={{ color: "white" }}>Max. Geschwindigkeit: </span>
                  <span style={{ marginLeft: 20, color: "#9eff55" }}>
                    {item.sd_maxgeschwindigkeit}
                  </span>
                  <span style={{ color: "white" }}> km/h</span>
                </Box>
              </Link>
            ))}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Statistiken;
