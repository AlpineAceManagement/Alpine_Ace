import React from "react";
import { VegaLite } from "react-vega";
import { View} from "react-vega";
import vegaEmbed from "vega-embed";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";
import { parse, scale } from "vega";
import { title } from "vega-lite/build/src/channeldef";
import VegaEmbed from "react-vega/lib/VegaEmbed";

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

  // const temp = [
  //   { "hour": 0, "temperature": 10 },
  //       { "hour": 1, "temperature": -4.178500175476074 },
  //       { "hour": 2, "temperature": -4.378499984741211 },
  //       { "hour": 3, "temperature": -4.628499984741211 },
  //       { "hour": 4, "temperature": -4.628499984741211 },
  //       { "hour": 5, "temperature": 5 },
  //       { "hour": 6, "temperature": 6 },
  //       { "hour": 7, "temperature": 5 },
  //       { "hour": 8, "temperature": 5 },
  //       { "hour": 9, "temperature": 6 },
  //       { "hour": 10, "temperature": 5 },
  //       { "hour": 11, "temperature": 8 },
  // ];

  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container", // Use "container" for responsive width
    "height": "container", // Use "container" for responsive height
    "description": "A line chart showing weather forecast",
    "data": {
      "name": "weather-chart",
      "values": weatherChartData // Use your weatherChartData variable
    },
    "mark": {
      "type": "line"
    },
    "encoding": {
      "x": { 
         "field": "hour", 
         "type": "temporal", 
         "axis": { "title": "Hour"} 
      },
      "y": { 
          "field": "temperature", 
          "type": "quantitative",
          "axis": { "title": "Temperature (°C)" }
      }
    }
  };
  



  const vegaSpec = {
      "$schema": "https://vega.github.io/schema/veg-litea/v5.json",
      "description": "Temperature over Time Line Chart",
      "width": 200,
      "height": 100,
      "padding": 5,
    
      "data": [
        {
          // "name": "table",
          "values": weatherChartData
        }
      ],
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "domain": {"data": "table", "field": "hour"},
          "range": "width",
          "padding": 0.05,
          "round": true
        },
        {
          "name": "yscale",
          "domain": {"data": "table", "field": "temperature"},
          "nice": true, 
          "range": "height" 
        }
      ],
    
      "axes": [
        { "orient": "bottom", "scale": "xscale", "title": "Hour" },
        { "orient": "left", "scale": "yscale", "title": "Temperature (°C)" }
      ],
    
      "marks": [
        {
          "type": "line",
          // "from": {"data":"weatherChartData"},
          "encode": {
            "enter": {
              "x": {"scale": "xscale", "field": "hour"},
              "y": {"scale": "yscale", "field": "temperature"},
              "stroke": {"value": "steelblue"},
              "strokeWidth": {"value": 2}
            }
          }
        }
      ]
    };

  // Neue Komponente für das Prognose-Diagramm
  // const PrognosisChart = ({ data }) => {
  //   // ... Vega-Spezifikation und Rendering
  //   return <Vega spec={vegaSpec} data={{ table: data }} />;
  // };
  // const runtime = parse(vegaSpec)
  // var view = new Vega.View(runtime)
  // .logLevel(Vega.Warn) // set view logging level
  // .renderer('svg')     // set render type (defaults to 'canvas')
  // .initialize('#view') // set parent DOM element
  // .hover();            // enable hover event processing, *only call once*!

// view.runAsync(); // evaluate and render the view
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
              {weatherChartData?(
                <VegaLite 
                spec={spec}
                data={{value: weatherChartData}}
                />
              ): (
                <div>Loading weather data...</div>
              )
            }
              {/* {weatherChartData && <PrognosisChart data={temp}/>} */}
              
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
                  <WeatherDataItem
                    label="Wetter"
                    value={weatherData.md_wetter}
                  />
                  <WeatherDataItem
                    label="Windgeschwindigkeit [km/h]"
                    value={parseFloat(weatherData.md_windgeschwindigkeit.toFixed(1))}
                  />
                  <WeatherDataItem
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
export default Wetter;
