import React from "react"; // Add this line
import { render } from "react-dom";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";
import { withEmotionCache } from "@emotion/react";



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

  useEffect(() => {
    const fetchData = async() =>{
      setLoading(true);
      try{
        const response = await fetch("http://localhost:5000/api/messdaten");
        if (!response.ok){
          throw new Error("Network response from Messdaten was not ok");
        }
        const data = await response.json();
        setWeatherData(data[0]);
        setLoading(false);
      } catch (error){
        console.error("Error fetching weather data", error);
        setError("Error fetching weatherdata. Please try again.");
        setLoading(false);
      }
      try{
        const respnse2 = await fetch("http://localhost:5000/api/schneehoehe");
        if (!respnse2.ok){
          throw new Error("Network response from Schneehöhe was not ok");
        }
        const data2 = await respnse2.json();
        setSnowData(data2[0]);
        setSnowLoading(false);
      } catch(snowerror){
        console.error("Error fetchin snowdata", snowerror);
        setSnowError("Eroro fetching snowada. Please try again.");
      }
    };
    fetchData();
  },[]);

 



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
