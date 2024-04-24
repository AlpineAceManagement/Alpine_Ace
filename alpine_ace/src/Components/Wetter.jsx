import React from "react";
import { Vega } from "react-vega";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";

const Wetter = () => {
  //------------------------------------------------------------------------
  // Anziehen der aktuellen Wetterdaten API :)
  //------------------------------------------------------------------------
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snowData, setSnowData] = useState(null);
  const [snowloading, setSnowLoading] = useState(true);
  const [snowerror, setSnowError] = useState(null);
  const [weatherChartData, setWeatherChartData] = useState(null);
  const [prognoseerror, setPrognoseError] = useState(null);
  const [prognoseloading, setPrognoseLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/messdaten");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWeatherData(data[0]); // Assuming data is an array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data", error);
        setError("Error fetching weather data. Please try again.");
        setLoading(false);
      }
      try {
        const response1 = await fetch("http://localhost:5000/api/schneehoehe");
        if (!response1.ok) {
          throw new Error("Network response was not ok");
        }
        const data1 = await response1.json();
        setSnowData(data1[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching snow data", error);
        setError("Error fetching snow data. Please try again.");
        setLoading(false);
      }
      try {
        const response2 = await fetch("http://localhost:5000/api/prognose");
        if (!response2.ok) {
          throw new Error("Network respnse was not ok");
        }
        const data2 = await response2.json();
        const formattedData = data2.map((data) => {
          const datum = new Date(data.pg_datum);
          return {
            hour: datum.getHours(),
            md_temperatur: data.pg_temperatur,
          };
        });
        // const temperatur = data2;
        setWeatherChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prognose data", error);
        setError("Error fetching prognose data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const temp = [
    { hour: 0, temperature: 10 },
    { hour: 1, temperature: -4.178500175476074 },
    { hour: 2, temperature: -4.378499984741211 },
    { hour: 3, temperature: -4.628499984741211 },
    { hour: 4, temperature: -4.628499984741211 },
    { hour: 5, temperature: 5 },
    { hour: 6, temperature: 6 },
    { hour: 7, temperature: 5 },
    { hour: 8, temperature: 5 },
    { hour: 9, temperature: 6 },
    { hour: 10, temperature: 5 },
    { hour: 11, temperature: 8 },
  ];
  const vegaSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 350,
    height: 200,
    padding: 5,
    autosize: "fit",
    data: [
      {
        name: "table",
        values: [],
      },
    ],
    signals: [
      { name: "width", value: 400 },
      { name: "height", value: 200 },
    ],
    marks: [
      {
        type: "line",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "x", field: "hour" },
            y: { scale: "y", field: "temperature" },
            stroke: { value: "steelblue" },
            strokeWidth: { value: 2 },
          },
        },
      },
    ],
    scales: [
      {
        name: "x",
        type: "linear",
        domain: [0, 11],
        range: "width",
        zero: false,
      },
      { name: "y", type: "linear", domain: [-12, 12], range: "height" },
    ],
    axes: [
      {
        orient: "bottom",
        scale: "x",
        title: "Tageszeit",
      },
      {
        orient: "left",
        scale: "y",
        title: "Temperatur",
      },
    ],
  };

  // Neue Komponente für das Prognose-Diagramm
  const PrognosisChart = ({ data }) => {
    // ... Vega-Spezifikation und Rendering
    return <Vega spec={vegaSpec} data={{ table: data }} />;
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
        <Box
          sx={{
            width: "90vw",
            height: "100vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#282c34" }}>Wetter</h1>
          {weatherChartData && <PrognosisChart data={temp} />}
          {loading && <p>Loading weather data...</p>}
          {snowloading && <p> Loadin snow data...</p>}
          {error && <p>{error}</p>}
          {snowerror && <p>{snowerror}</p>}
          {weatherData && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}
            >
              <WeatherDataItem
                label="Temperatur (C°)"
                value={parseFloat(weatherData.md_temperatur).toFixed(1)}
              />
              <WeatherDataItem label="Wetter" value={weatherData.md_wetter} />
              <WeatherDataItem
                label="Windgeschwindigkeit [km/h]"
                value={parseFloat(weatherData.md_windgeschwindigkeit).toFixed(
                  1
                )}
              />
              <WeatherDataItem
                label="Windrichtung"
                value={weatherData.md_windrichtung}
              />
            </Box>
          )}
          {snowData && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}
            >
              <WeatherDataItem
                label="Schneehöhe [cm]"
                value={parseFloat(snowData.sh_hoehe).toFixed(1)}
              />
            </Box>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

const WeatherDataItem = ({ label, value }) => (
  <div>
    <p style={{ fontWeight: "bold", color: "black" }}>{label}</p>
    <p style={{ color: "black" }}>{value}</p>
  </div>
);
export default Wetter;
