/* Datenbankdaten in Form von Diagrammen darstellen */
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

const Graph = () => {
  const [skiData, setSkiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [seasonTotals, setSeasonTotals] = useState([]);
  const [chartData, setChartData] = useState([]);

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
          sd_maxgeschwindigkeit: parseFloat(item.sd_maxgeschwindigkeit).toFixed(
            2
          ),
          sd_date: new Date(item.sd_date).toLocaleDateString("fr-FR"), // Format JJ/MM/AAAA
        }));
        formattedData.sort((a, b) => new Date(b.sd_date) - new Date(a.sd_date)); // Tri des données par date décroissante
        setSkiData(formattedData);
        const uniqueSeasons = [
          ...new Set(formattedData.map((item) => item.sd_saison)),
        ];
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
        console.log("Season totals from server:", data);
        const seasonData = data.map((item) => ({
          ...item,
          sd_date: item.sd_saison,
          sd_hoehenmeter: parseFloat(item.total_hoehenmeter).toFixed(2),
          sd_distanz: parseFloat(item.total_distanz).toFixed(2),
          sd_geschwindigkeit: parseFloat(item.average_geschwindigkeit).toFixed(
            2
          ),
          sd_maxgeschwindigkeit: parseFloat(item.max_geschwindigkeit).toFixed(
            2
          ),
        }));
        seasonData.sort((a, b) => new Date(b.sd_date) - new Date(a.sd_date));
        setSeasonTotals(seasonData);
      })
      .catch((error) => {
        console.error("Error fetching season totals", error);
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (selectedSeason === "") {
      const newData = seasonTotals.map((item) => ({
        ...item,
        graphType: "Alle Saison",
      }));
      setChartData(newData);
    } else {
      const filteredData = skiData
        .filter((item) => item.sd_saison === selectedSeason)
        .map((item) => ({ ...item, graphType: selectedSeason }));
      setChartData(filteredData);
    }
  }, [selectedSeason, seasonTotals, skiData]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
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
            position: "relative",
          }}
        >
          <Link
            to="/Statistiken"
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
              Stats
            </button>
          </Link>

          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            Balkendiagramm
          </h1>

          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Select
              value={selectedSeason}
              onChange={handleSeasonChange}
              displayEmpty
              inputProps={{ "aria-label": "Season" }}
              style={{
                backgroundColor: "#ff6155",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <MenuItem value="">Alle Saison</MenuItem>
              {seasons
                .sort((a, b) => b.localeCompare(a)) // Trie décroissant des saisons
                .map((season, index) => (
                  <MenuItem key={index} value={season}>
                    {season}
                  </MenuItem>
                ))}
            </Select>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Höhenmeter</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData.sort((a, b) => {
                  const [dayA, monthA, yearA] = a.sd_date
                    .split("/")
                    .map(Number);
                  const [dayB, monthB, yearB] = b.sd_date
                    .split("/")
                    .map(Number);

                  if (yearA !== yearB) {
                    return yearA - yearB;
                  }

                  if (monthA !== monthB) {
                    return monthA - monthB;
                  }

                  return dayA - dayB;
                })}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sd_date"
                  domain={selectedSeason === "" ? null : ["11-01", "03-31"]}
                  tickFormatter={(tickItem) => {
                    if (selectedSeason === "") {
                      return tickItem;
                    } else {
                      const [day, month] = tickItem.split("/");
                      return `${day.padStart(2, "0")}/${month.padStart(
                        2,
                        "0"
                      )}`;
                    }
                  }}
                  angle={selectedSeason === "" ? 0 : -90}
                  dx={selectedSeason === "" ? 0 : -6}
                  dy={selectedSeason === "" ? 0 : 20}
                />
                <YAxis domain={[0, selectedSeason === "" ? 80000 : 8000]}>
                  <Label
                    value="[km]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                    dx={-15}
                  />
                </YAxis>
                <Bar
                  dataKey="sd_hoehenmeter"
                  fill="#9eff55"
                  barSize={selectedSeason === "" ? 50 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Distanz</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData.sort((a, b) => {
                  const [dayA, monthA, yearA] = a.sd_date
                    .split("/")
                    .map(Number);
                  const [dayB, monthB, yearB] = b.sd_date
                    .split("/")
                    .map(Number);

                  if (yearA !== yearB) {
                    return yearA - yearB;
                  }

                  if (monthA !== monthB) {
                    return monthA - monthB;
                  }

                  return dayA - dayB;
                })}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sd_date"
                  domain={selectedSeason === "" ? null : ["11-01", "03-31"]}
                  tickFormatter={(tickItem) => {
                    if (selectedSeason === "") {
                      return tickItem;
                    } else {
                      const [day, month] = tickItem.split("/");
                      return `${day.padStart(2, "0")}/${month.padStart(
                        2,
                        "0"
                      )}`;
                    }
                  }}
                  angle={selectedSeason === "" ? 0 : -90}
                  dx={selectedSeason === "" ? 0 : -6}
                  dy={selectedSeason === "" ? 0 : 20}
                />
                <YAxis domain={[0, selectedSeason === "" ? 1000 : 100]}>
                  <Label
                    value="[km]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                    dx={-15}
                  />
                </YAxis>
                <Bar
                  dataKey="sd_distanz"
                  fill="#9eff55"
                  barSize={selectedSeason === "" ? 50 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Mittlere Geschwindigkeit</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData.sort((a, b) => {
                  const [dayA, monthA, yearA] = a.sd_date
                    .split("/")
                    .map(Number);
                  const [dayB, monthB, yearB] = b.sd_date
                    .split("/")
                    .map(Number);

                  if (yearA !== yearB) {
                    return yearA - yearB;
                  }

                  if (monthA !== monthB) {
                    return monthA - monthB;
                  }

                  return dayA - dayB;
                })}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sd_date"
                  domain={selectedSeason === "" ? null : ["11-01", "03-31"]}
                  tickFormatter={(tickItem) => {
                    if (selectedSeason === "") {
                      return tickItem;
                    } else {
                      const [day, month] = tickItem.split("/");
                      return `${day.padStart(2, "0")}/${month.padStart(
                        2,
                        "0"
                      )}`;
                    }
                  }}
                  angle={selectedSeason === "" ? 0 : -90}
                  dx={selectedSeason === "" ? 0 : -6}
                  dy={selectedSeason === "" ? 0 : 20}
                />
                <YAxis domain={[0, 60]}>
                  <Label
                    value="[km/h]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                    dx={-15}
                  />
                </YAxis>
                <Bar
                  dataKey="sd_geschwindigkeit"
                  fill="#9eff55"
                  barSize={selectedSeason === "" ? 50 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Maximale Geschwindigkeit</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData.sort((a, b) => {
                  const [dayA, monthA, yearA] = a.sd_date
                    .split("/")
                    .map(Number);
                  const [dayB, monthB, yearB] = b.sd_date
                    .split("/")
                    .map(Number);

                  if (yearA !== yearB) {
                    return yearA - yearB;
                  }

                  if (monthA !== monthB) {
                    return monthA - monthB;
                  }

                  return dayA - dayB;
                })}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sd_date"
                  domain={selectedSeason === "" ? null : ["11-01", "03-31"]}
                  tickFormatter={(tickItem) => {
                    if (selectedSeason === "") {
                      return tickItem;
                    } else {
                      const [day, month] = tickItem.split("/");
                      return `${day.padStart(2, "0")}/${month.padStart(
                        2,
                        "0"
                      )}`;
                    }
                  }}
                  angle={selectedSeason === "" ? 0 : -90}
                  dx={selectedSeason === "" ? 0 : -6}
                  dy={selectedSeason === "" ? 0 : 20}
                />
                <YAxis domain={selectedSeason === "" ? [0, "auto"] : [0, 120]}>
                  <Label
                    value="[km/h]"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: "middle", fill: "#000" }}
                    dx={-15}
                  />
                </YAxis>
                <Bar
                  dataKey="sd_maxgeschwindigkeit"
                  fill="#9eff55"
                  barSize={selectedSeason === "" ? 50 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Graph;
