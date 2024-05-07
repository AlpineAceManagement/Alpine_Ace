// import { useState, useEffect } from "react";
// import { Vega } from "react-vega";  
// import * as vega from 'vega';
// import { vals } from "vega-lite";

import { field } from "vega";

// const Spec_wetter = () => {
//     const [weatherData, setweatherData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

<<<<<<< Updated upstream
//     useEffect(() => {
//         const fetchData = async()=>{
//             setLoading(true);
//             try{
//                 const response = await fetch("http://localhost:5000/api/prognose");
//                 if (!response.ok){
//                     throw new Error("Network respnonse was not ok");
//                 }
//                 const data = await response.json();
//                 const f_data = data.map((dataPoint)=>{
//                     const datum = new Date(dataPoint.pg_datum);
//                     return{
//                         hour: datum.getHours(),
//                         temperatur: dataPoint.pg_temperatur,
//                     };
//                 });
//                 setweatherData(f_data);
//                 setLoading(false);
//             }   catch(error){
//                 console.error("Error fetching prognose data", error);
//                 setError("Error fetching prognose data. Please try again.");
//                 setLoading(false);
//             } 
//         };
//         fetchData();   
//   }, []);
=======
  //zwei effekte

  return (
    <div id="vega-chart">
        {view}
    </div>
  );
};
>>>>>>> Stashed changes


const spec_wetter = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 600,
  height: 400,
  padding: 5,
  signals: [
    {
      name: "interpolate",
      value: "basis"
    }
  ],
  data: [{
    name: "weatherData",
    values: [
      {x: 0, y:5.9},
      {x: 1, y:6.0},
      {x: 2, y:5.8},
      {x: 3, y:5.0},
      {x: 4, y:4.2},
      {x: 5, y:4.7},
      {x: 6, y:5.7},
      {x: 7, y:5.9},
      {x: 8, y:5.9},
      {x: 9, y:5.7},
      {x: 10, y:5.9},
      {x: 11, y:6.0},
      {x: 12, y:5.9},
      {x: 13, y:6.1},
      {x: 14, y:6.5},
      {x: 15, y:6.1},
      {x: 16, y:5.7},
      {x: 17, y:5.5},
      {x: 18, y:5.2},
      {x: 19, y:5.2},
      {x: 20, y:5.1},
      {x: 21, y:5.1},
      {x: 22, y:5.1},
      {x: 23, y:5.1},
      ]
    }],
    scales: [
      {
        name: "x",
        type: "point",
        range: "width",
        domain: {data: "table", field: "x"}
      },
      {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true,
        "zero": true,
        "domain": {"data": "table", "field": "y"}
      },
    ],
    axes: [{
      orient: "bottom",
      scale: "x"
    }, {
      orient: "left",
      scale: "y"
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
    }]
  };
  // return(
  //   <div>
  //     {/* {loading && <div>Loading</div>}
  //     {error && <div>{error}</div>}
  //     {weatherData &&(
  //       <Vega spec={spec} data={[{name: "weatherData", values: weatherData}]}/>
  //     )} */}
  //       <Vega spec={spec} renderer="svg" actions={false}/>
  //   </div>
  // )
// };

export default spec_wetter;
