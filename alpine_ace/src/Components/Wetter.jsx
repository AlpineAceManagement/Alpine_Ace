import React from "react"; 
import { render } from "react-dom";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";
import { withEmotionCache } from "@emotion/react";
import { vegaSpec } from './vegaConfig.js';



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
        const [response, response2, response3] = await Promise.all([
          fetch("http://localhost:5000/api/messdaten"),
          fetch("http://localhost:5000/api/schneehoehe"),
          fetch("http://localhost:5000/api/prognose")
        ]);
  
        if (!response.ok) { 
          throw new Error("Network response from Messdaten was not ok");
        }
        if (!response2.ok) {
          throw new Error("Network response from Schneehöhe was not ok");
        }
        if (!response3.ok) {
          throw new Error("Network response from Prognose was not ok");
        }
  
        const [data, data2, data3] = await Promise.all([
          response.json(),
          response2.json(),
          response3.json()
        ]);
  
        // Data Transformation (directly after fetching)
        const transformedChartData = data.map(datapoint => ({
          pg_datum: datapoint.pg_datum,
          pg_temperatur: datapoint.pg_temperatur,
        }));
  
        setWeatherData(data[0]);
        setSnowData(data2[0]);
        setWeatherChartData(transformedChartData);
        setLoading(false);  
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors appropriately for all data sources
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); 
  
  // useEffect for rendering the chart
  useEffect(() => {
    if (weatherChartData) {  // Ensure data exists before rendering
        vegaSpec.data[0].values = weatherChartData;
  
      vegaEmbed("#chart-container", vegaSpec)
        .then(result => console.log("Chart embedded:", result))
        .catch(console.error);
    }  
  }, [weatherChartData]); 
  

  

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
          <h1 style={{textAlign:"center", color:"#282c34"}}>Wetter</h1>
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
                padding: "20px"
              }}>
                <WeatherDataItem label="Temperatur" value={parseFloat(weatherData.md_temperatur).toFixed(1)} />
                <WeatherDataItem label="Wetter" value={weatherData.md_wetter}/>
                <WeatherDataItem label="Windgeschwindigkeit" value={parseFloat(weatherData.md_windgeschwindigkeit).toFixed(1)} />
                <WeatherDataItem label="Windrichtung" value={weatherData.md_windrichtung} />
            </Box>
          )}
          {snowData &&(
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "20px",
                padding: "20px"
                }}>
                <WeatherDataItem label= "Schneehöhe" value={parseFloat(snowData.sh_hoehe).toFixed(1)} />
            </Box>
          )}
          <Box sx={{ 
                marginTop: "20px" // Add some spacing
              }}>
            <div id="chart-container"></div> 
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

const WeatherDataItem = ({label, value}) => (
  <div>
    <p style={{fontWeight: "bold", color:"black"}}>{label}</p>
    <p style={{color:"black"}}>{value}</p>
  </div>
)
export default Wetter;
