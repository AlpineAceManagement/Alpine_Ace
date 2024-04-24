const vegaSpec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 400,  
  "height": 200, 
  "padding": 5, 

  "data": [
    {
      "name": "table",
      
    }
  ],

  "signals": [
    {"name": "width", "value": 400},
    {"name": "height", "value": 200}
  ],

  "scales": [
    {
      "name": "xScale",
      "type": "time",  // Ensure your dates are treated as time 
      "range": "width", 
      "domain": {"data": "table", "field": "pg_datum"}
    },
    {
      "name": "yScale",
      "type": "linear", 
      "range": "height", 
      "domain": {"data": "table", "field": "pg_temperatur"},
      "nice": true 
    }
  ],

  "axes": [
    {"orient": "bottom", "scale": "xScale", "title": "Time"},
    {"orient": "left", "scale": "yScale", "title": "Temperature (°C)"}
  ],

  "marks": [
    {
      "type": "line",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "x": {"scale": "xScale", "field": "pg_datum"},
          "y": {"scale": "yScale", "field": "pg_temperatur"},
          "stroke": {"value": "steelblue"},
          "strokeWidth": {"value": 2}
        }
      }
    }
  ]
};
