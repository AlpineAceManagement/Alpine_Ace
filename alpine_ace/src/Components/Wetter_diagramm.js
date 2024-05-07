import View from "ol/View";
import { useState, useEffect } from "react";
import * as vega from 'vega';

const WeatherChart = () => {
    const [weatherData, setweatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState(null);

    useEffect(() => {
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await fetch("http://localhost:5000/api/prognose");
                if (!response.ok){
                    throw new Error("Network respnonse was not ok");
                }
                const data = await response.json();
                const f_data = data.map((dataPoint)=>{
                    const datum = new Date(dataPoint.pg_datum);
                    return{
                        hour: datum.getHours(),
                        temperatur: dataPoint.pg_temperatur,
                    };
                });
                setweatherData(f_data);
                setLoading(false);
            }   catch(error){
                console.error("Error fetching prognose data", error);
                setError("Error fetching prognose data. Please try again.");
                setLoading(false);
            } 
        };
        fetchData();
        const spec = {
            $schema: "https://vega.github.io/schema/vega/v5.json",
            width: 600,
            height: 400,
            data: [{
              name: "weatherData",
              values: weatherData
            }],
            marks: [{
              type: "line",
              from: {
                data: "weatherData"
              },
              encode: {
                x: { field: "hour", type: "ordinal" },
                y: { field: "temperatur", type: "quantitative" },
                stroke: { value: "blue" }
              }
            }],
            axes: [{
              orient: "bottom",
              scale: "x"
            }, {
              orient: "left",
              scale: "y"
            }]
        };
        const newView = new vega.View("vega-chart", spec);
        newView.render();
        setView(newView); 
  }, []);

  //zwei effekte

  return (
    <div id="vega-chart">
        {view}
    </div>
  );
};

export default WeatherChart;
