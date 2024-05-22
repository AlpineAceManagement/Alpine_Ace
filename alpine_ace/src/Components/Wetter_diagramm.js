/* Vega-Spezifikation für das lineares Temperaturdiagramm */
const spec_wetter = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "A basic line chart example.",
  width: 300,
  height: 170,
  padding: 5,

  signals: [
    {
      name: "interpolate",
      value: "basis",
    },
  ],

  data: [
    {
      name: "table",
      values: [
        { x: 0, y: 5.9 },
        { x: 1, y: 6.0 },
        { x: 2, y: 5.8 },
        { x: 3, y: 5.0 },
        { x: 4, y: 4.2 },
        { x: 5, y: 4.0 },
        { x: 6, y: 5.7 },
        { x: 7, y: 5.9 },
        { x: 8, y: 5.9 },
        { x: 9, y: 5.7 },
        { x: 10, y: 5.9 },
        { x: 11, y: 6.0 },
        { x: 12, y: 5.9 },
        { x: 13, y: 6.1 },
        { x: 14, y: 6.5 },
        { x: 15, y: 6.1 },
        { x: 16, y: 5.7 },
        { x: 17, y: 5.5 },
        { x: 18, y: 5.2 },
        { x: 19, y: 5.2 },
        { x: 20, y: 5.1 },
        { x: 21, y: 5.1 },
        { x: 22, y: 5.1 },
        { x: 23, y: 5.1 },
      ],
    },

    {
      name: "tag",
      values: [
        {
          start: 0,
          end: 8,
          text: "Lift geschlossen",
        },
        {
          start: 17,
          end: 23,
          text: "Lift geschlossen",
        },
      ],
    },
  ],

  scales: [
    {
      name: "x",
      type: "point",
      range: "width",
      domain: { data: "table", field: "x" },
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y" },
    },
    {
      name: "color",
      type: "ordinal",
      range: ["grey"],
      domain: { data: "tag", field: "text" },
    },
  ],

  axes: [
    { orient: "bottom", scale: "x", title: "Tageszeit", titlePadding: 10 },
    {
      orient: "left",
      scale: "y",
      title: "Temperatur [C°]",
      titlePadding: 10,
      tickCount: 7,
    },
  ],
  marks: [
    {
      type: "rect",
      from: { data: "tag" },
      encode: {
        enter: {
          x: { scale: "x", field: "start" },
          x2: { scale: "x", field: "end" },
          y: { value: 0 },
          y2: { signal: "height" },
          fill: { scale: "color", field: "text" },
          opacity: { value: 0.2 },
        },
      },
    },
    {
      type: "line",
      from: { data: "table" },
      encode: {
        enter: {
          interpolate: { value: "monotone" },
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          stroke: { value: "red" },
          strokeWidth: { value: 3 },
        },
      },
    },
  ],
  legends: [
    {
      fill: "color",
      orient: "bottom",
      offset: 8,
      encode: {
        symbols: {
          update: {
            strokeWidth: { value: 0 },
            shape: { value: "square" },
            opacity: { value: 0.3 },
          },
        },
      },
    },
  ],
};

export default spec_wetter;
