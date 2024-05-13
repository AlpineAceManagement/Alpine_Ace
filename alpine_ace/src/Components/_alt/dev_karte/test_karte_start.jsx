import React, { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";

const Test = () => {
  useEffect(() => {
    const extent = [2420000, 130000, 2900000, 1350000];
    const swisstopoLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        attributions:
          '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
          'en/home.html">geo.admin.ch</a>',
        projection: "EPSG:2056",
        params: {
          LAYERS: "ch.swisstopo.pixelkarte-farbe-winter",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
    });
    // Create a new map instance
    const map = new Map({
      target: "map", // The ID of the DOM element where the map will be rendered
      layers: [swisstopoLayer],
      view: new View({
        center: [2762073, 1180429],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    // Cleanup function
    return () => {
      map.setTarget(null); // Remove the map from the DOM when the component is unmounted
    };
  }, []); // Run this effect only once after the initial render

  return (
    <div id="map" style={{ width: "100%", height: "400px" }}></div> // Container for the map
  );
};

export default Test;
