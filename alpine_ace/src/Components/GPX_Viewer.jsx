import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link } from "react-router-dom";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import "../App.css";
import { Vega } from 'react-vega';
import wellknown from 'wellknown';

const GPX_Viewer = () => {
    const [geometryData, setGeometryData] = useState(""); // Assume you have geometry data in WKT format

    // Fetch geometry data from API
    useEffect(() => {
        fetch("http://localhost:5000/api/skidaten")
          .then(response => response.json())
          .then(data => {
              // Assuming the geometry data is stored in the "sd_geometrie" field of each item
              const firstItem = data[0];
              if (firstItem && firstItem.sd_geometrie) {
                  setGeometryData(firstItem.sd_geometrie);
              }
          })
          .catch(error => console.error("Error fetching geometry data:", error));
    }, []);

    // Parse the WKT geometry
    const parsedGeometry = geometryData ? wellknown.parse(geometryData) : null;

    // Check if parsedGeometry is not null before accessing its properties
    const lineData = parsedGeometry && parsedGeometry.coordinates ? parsedGeometry.coordinates.map(coord => ({ x: coord[0], y: coord[1] })) : [];

    // Vega specification for plotting geometry with zoom
    const vegaSpec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 400,
        "height": 200,
        "padding": 5,

        "data": [
            {
                "name": "lineData",
                "values": lineData
            }
        ],

        "scales": [
            {
                "name": "x",
                "type": "linear",
                "range": "width",
                "zero": false,
                "domain": {"data": "lineData", "field": "x"}
            },
            {
                "name": "y",
                "type": "linear",
                "range": "height",
                "zero": false,
                "domain": {"data": "lineData", "field": "y"}
            }
        ],

        "marks": [
            {
                "type": "line",
                "from": {"data": "lineData"},
                "encode": {
                    "enter": {
                        "x": {"scale": "x", "field": "x"},
                        "y": {"scale": "y", "field": "y"},
                        "stroke": {"value": "steelblue"},
                        "strokeWidth": {"value": 2}
                    }
                }
            }
        ]
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
                <button style={{ backgroundColor: "#ff6155", color: "white", padding: "8px", border: "none", borderRadius: "4px", marginBottom: "10px" }}>Stats</button>
              </Link>
              <Link to="/Graph" style={{ textDecoration: "none", position: "absolute", top: "50px", right: "10px" }}>
                <button style={{ backgroundColor: "#ff6155", color: "white", padding: "8px", border: "none", borderRadius: "4px" }}>Graph</button>
              </Link>
    
              <h1 style={{ textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>GPX Viewer</h1>
    
              {/* Vega chart */}
              <div id="vega-container">
                <Vega spec={vegaSpec} renderer="svg" />
              </div>
            </Box>
          </div>
        </ThemeProvider>
      );
};

export default GPX_Viewer;
