import React from "react";
import { Vega, VegaLite } from "react-vega";
import { View} from "react-vega";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";
import { parse, scale } from "vega";
import { title } from "vega-lite/build/src/channeldef";
import VegaEmbed from "react-vega/lib/VegaEmbed";

import spec_wetter from "./diagramm_wetter";

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
        setWeatherData(data[0]); 
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
        setSnowLoading(false);
      } catch (error) {
        console.error("Error fetching snow data", error);
        setSnowError("Error fetching snow data. Please try again.");
        setSnowLoading(false);
      }
      try {
        const response2 = await fetch("http://localhost:5000/api/prognose");
        if (!response2.ok) {
          throw new Error("Network respnse was not ok");
        }
        const data2 = await response2.json();
        const formattedData = data2.map((data2Point) => {
          const datum = new Date(data2Point.pg_datum);
          return {
            hour: datum.getHours(), 
            temperature: data2Point.pg_temperatur,
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
            marginBottom: "5px",
            display:"flex",
            flex:1
          }}
        >
          <div className="large-box">
            <h1 style={{textAlign: "center", color: "#282c34"}}>Wetter</h1>
            <div style={{width: "100%", height:"150"}}>
              {weatherChartData ?(
                <VegaLite
                spec={{
                  ...spec_wetter,
                  data: {values:weatherChartData}
                }}
                />
              ):(
                <div> Loading weather data..</div>
        
              )}

              {/* <Vega spec={spec_wetter}/> */}
            </div>
            {loading && <p>Loading weather data...</p>}
            {snowloading && <p> Loadin snow data...</p>}
            {error && <p>{error}</p>}
            {snowerror && <p>{snowerror}</p>}
          </div>
        </Box>
        <Box
          sx={{
            width: "90vw",
            height: "100vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            display:"flex",
            flex:1
          }}
        >  
          <div className="small-boxes-wrapper">
           {weatherData &&(
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}>
               
                  <WeatherDataItem
                    label="Temperatur (C°)"
                    value={parseFloat(weatherData.md_temperatur).toFixed(1)}
                  />
                  <WeatherDataItem2 
                    label="Wetter"
                    value={weatherData.md_wetter} />
                  <WeatherDataItem
                    label="Windgeschwindigkeit [km/h]"
                    value={parseFloat(weatherData.md_windgeschwindigkeit.toFixed(1))}
                  />
                  <WeatherDataItem3
                    label = "Windrichtung"
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
                }}>
                    <WeatherDataItem
                      label="Schneehöhe [cm]"
                      value={parseFloat(snowData.sh_hoehe).toFixed(1)}  
                    />
                </Box>
              )}
          </div>
        </Box>
      </div>
    </ThemeProvider>
  );
};

const WeatherDataItem = ({ label, value }) => (
  <div>
    <p style={{ textAlign: "center",fontWeight: "bold", color: "#00112e" }}>{label}</p>
    <p style={{ textAlign:"center",color: "#00112e" }}>{value}</p>
  </div>
);

const weatherIconMap = {
  "sonnig": "sunny",
  "bewölkt": "cloudy",
  "schneereich": "weather_snwoy",
  "regnerisch": "rainy",
};

const WeatherDataItem2 = ({ label, value }) => {
  const weatherCondition = value;
  const iconName = weatherIconMap[weatherCondition] || "help"; // Fallback to 'help' icon

  return (
    <div>
      <p style={{ textAlign: "center", fontWeight: "bold", color: "#00112e" }}>
        {label}
      </p>
      <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#00112e", display:"block", textAlign:"center" }}> 
        {iconName}
      </span>
    </div>
  );
};

const windIconMap = {
  "Sued": "south",
  "Sued-Ost": "south_east",
  "Sued-West": "south_west",
  "Nord": "north",
  "Nord-West": "north_west",
  "Nord-Ost": "north_east",
};

const WeatherDataItem3 = ({ label, value }) => {
  const windCondition = value;
  const iconName = windIconMap[windCondition] || "help"; // Fallback to 'help' icon

  return (
    <div>
      <p style={{ textAlign: "center", fontWeight: "bold", color: "#00112e" }}>
        {label}
      </p>
      <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#00112e", display:"block", textAlign:"center" }}> 
        {iconName}
      </span>
    </div>
  );
};




export default Wetter;
