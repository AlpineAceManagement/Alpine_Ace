import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";

const Test = () => {
  const [map, setMap] = useState(null); // State for the map object

  useEffect(() => {
    // Create a new map instance
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
    const newMap = new Map({
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
    setMap(newMap); // Set the map object in state

    // Cleanup function
    return () => {
      newMap.setTarget(null); // Remove the map from the DOM when the component is unmounted
    };
  }, []); // Run this effect only once after the initial render

  useEffect(() => {
    if (map) {
      map.on("pointermove", (e) => {
        if (e.dragging) {
          const centerCoord = map.getView().getCenter();
          if (centerCoord) {
            console.log(centerCoord);
          }
        }
      });
    }
  }, [map]); // Run this effect when the map object is set

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default Test;
