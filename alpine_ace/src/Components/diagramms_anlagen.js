const spec_analgen = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 25,
  height: 100,
  padding: 5,

  data: [
    {
      name: "table",
      values: [
        { x: "Anlagen", y: 30, c: 0 },
        { x: "Anlagen", y: 13, c: 1 },
      ],
      transform: [
        {
          type: "stack",
          groupby: ["x"],
          sort: { field: "c" },
          field: "y",
        },
      ],
    },
  ],

  scales: [
    {
      name: "x",
      type: "band",
      range: "width",
      domain: { data: "table", field: "x" },
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y1" },
    },
    {
      name: "color",
      type: "ordinal",
      range: ["#1b8c33", "#8fa6a2"],
      domain: { data: "table", field: "c" },
    },
  ],

  axes: [
    { orient: "bottom", scale: "x", zindex: 1 },
    { orient: "left", scale: "y", zindex: 1 },
  ],

  marks: [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "x", field: "x" },
          width: { scale: "x", band: 1, offset: -1 },
          y: { scale: "y", field: "y0" },
          y2: { scale: "y", field: "y1" },
          fill: { scale: "color", field: "c" },
        },
        update: {
          fillOpacity: { value: 1 },
        },
        hover: {
          fillOpacity: { value: 0.5 },
        },
      },
    },
  ],
};

export default spec_analgen;