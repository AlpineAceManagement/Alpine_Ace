import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

const Graph = () => {
  const [skiData, setSkiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [seasonTotals, setSeasonTotals] = useState([]);

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
          sd_date: new Date(item.sd_date).toLocaleDateString("fr-FR"), // Format JJ/MM/AAAA
        }));
        formattedData.sort((a, b) => new Date(b.sd_date) - new Date(a.sd_date)); // Tri des données par date décroissante
        setSkiData(formattedData);
        const uniqueSeasons = [...new Set(formattedData.map(item => item.sd_saison))];
        uniqueSeasons.sort((a, b) => a.localeCompare(b));
        setSeasons(uniqueSeasons);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ski data", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/saison_total")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Season totals from server:", data); // Ajoutez ce log
        setSeasonTotals(data);
      })
      .catch((error) => {
        console.error("Error fetching season totals", error);
        setError(error);
      });
  }, []);
  

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  let chartData;

  if (selectedSeason === "Alle Saison") {
    // Utiliser les données de la saison totale
    chartData = seasonTotals.map(item => ({
      ...item,
      sd_date: item.sd_saison, // Utiliser la saison comme date pour le graphique
      sd_hoehenmeter: item.total_hoehenmeter, // Adapter les clés de données
      sd_distanz: item.total_distanz,
      sd_geschwindigkeit: item.average_geschwindigkeit,
      sd_maxgeschwindigkeit: item.max_geschwindigkeit,
      graphType: "Alle Saison", // Ajouter une propriété pour indiquer le type de graphique
    }));
  } else {
    // Filtrer simplement les données par saison spécifique à partir des données skiData
    chartData = skiData.filter(item => item.sd_saison === selectedSeason)
                       .map(item => ({ ...item, graphType: selectedSeason }));
  }
  
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
            position: "relative"
          }}
        >
          <Link to="/Statistiken" style={{ textDecoration: "none", position: "absolute", top: "10px", right: "10px" }}>
            <button style={{ backgroundColor: "#ff6155", color: "white", padding: "8px", border: "none", borderRadius: "4px" }}>Stats</button>
          </Link>

          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Graphs</h1>

          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center"}}>
            <Select
              value={selectedSeason}
              onChange={handleSeasonChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Season' }}
              style={{
                backgroundColor: "#ff6155",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <MenuItem value="">
                Alle Saison
              </MenuItem>
              {seasons
                .sort((a, b) => b.localeCompare(a)) // Trie décroissant des saisons
                .map((season, index) => (
                  <MenuItem key={index} value={season}>{season}</MenuItem>
                ))}
            </Select>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Höhenmeter</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sd_date" />
                <YAxis domain={[0, 'auto']}>
                  <Label
                    value="Höhenmeter [m]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                  />
                </YAxis>
                <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ background: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
                        <p>{label}</p>
                        {payload.map((item, index) => {
                          let displayName = '';
                          let value = item.value;
                          switch(item.dataKey) {
                            case 'sd_hoehenmeter':
                              value += ' m';
                              break;
                            case 'sd_distanz':
                              value += ' km';
                              break;
                            case 'sd_geschwindigkeit':
                              value += ' km/h';
                              break;
                            case 'sd_maxgeschwindigkeit':
                              value += ' km/h';
                              break;
                            default:
                              displayName = item.dataKey;
                              break;
                          }
                          return (
                            <p key={index}>
                              {value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }} 
              />
                <Bar dataKey="sd_hoehenmeter" fill="#ff6155" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Distanz</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sd_date" />
                <YAxis domain={[0, 'auto']}>
                  <Label
                    value="Kilometer [km]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                  />
                </YAxis>
                <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ background: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
                        <p>{label}</p>
                        {payload.map((item, index) => {
                          let displayName = '';
                          let value = item.value;
                          switch(item.dataKey) {
                            case 'sd_hoehenmeter':
                              value += ' m';
                              break;
                            case 'sd_distanz':
                              value += ' km';
                              break;
                            case 'sd_geschwindigkeit':
                              value += ' km/h';
                              break;
                            case 'sd_maxgeschwindigkeit':
                              value += ' km/h';
                              break;
                            default:
                              displayName = item.dataKey;
                              break;
                          }
                          return (
                            <p key={index}>
                              {value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }} 
              />
                <Bar dataKey="sd_distanz" fill="#ff6155" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Mittlere Geschwindigkeit</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sd_date" />
                <YAxis domain={[0, 'auto']}>
                  <Label
                    value="Geschwindigkeit [km/h]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                  />
                </YAxis>
                <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ background: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
                        <p>{label}</p>
                        {payload.map((item, index) => {
                          let displayName = '';
                          let value = item.value;
                          switch(item.dataKey) {
                            case 'sd_hoehenmeter':
                              value += ' m';
                              break;
                            case 'sd_distanz':
                              value += ' km';
                              break;
                            case 'sd_geschwindigkeit':
                              value += ' km/h';
                              break;
                            case 'sd_maxgeschwindigkeit':
                              value += ' km/h';
                              break;
                            default:
                              displayName = item.dataKey;
                              break;
                          }
                          return (
                            <p key={index}>
                              {value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }} 
              />
                <Bar dataKey="sd_geschwindigkeit" fill="#ff6155" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Maximale Geschwindigkeit</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sd_date" />
                <YAxis domain={[0, 120]}>
                  <Label
                    value="Geschwindigkeit [km/h]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                  />
                </YAxis>
                <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ background: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
                        <p>{label}</p>
                        {payload.map((item, index) => {
                          let displayName = '';
                          let value = item.value;
                          switch(item.dataKey) {
                            case 'sd_hoehenmeter':
                              value += ' m';
                              break;
                            case 'sd_distanz':
                              value += ' km';
                              break;
                            case 'sd_geschwindigkeit':
                              value += ' km/h';
                              break;
                            case 'sd_maxgeschwindigkeit':
                              value += ' km/h';
                              break;
                            default:
                              displayName = item.dataKey;
                              break;
                          }
                          return (
                            <p key={index}>
                              {value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }} 
              />
                <Bar dataKey="sd_maxgeschwindigkeit" fill="#ff6155" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Graph;
