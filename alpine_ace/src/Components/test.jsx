import React, { useEffect, useRef } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { Projection } from "ol/proj";

const Test = () => {
  const mapRef = useRef(null); // Reference to the map container

  useEffect(() => {
    const geoserverWFSLineLayer = "Alpine_Ace:pisten"; // Geoserver WFS Linien Layername
    const lineVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // Pfad zur WFS Resource auf dem GeoServer
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSLineLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });

    const map = new Map({
      layers: [lineVectorSource], // Füge den Linien-Layer hinzu
      target: mapRef.current,
      view: new View({
        center: [2762640.8, 1179359.1],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "3vh",
      }}
    ></div>
  );
};

export default Test;
