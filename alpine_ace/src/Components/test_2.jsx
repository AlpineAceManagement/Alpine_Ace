import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { createVectorSource } from "./kartenWFS";
import { SwisstopoLayer } from "./swisstopoLayer.js";
import { Projection } from "ol/proj";
import Stroke from "ol/style/Stroke";

const Test_2 = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [nodeSource, setNodeSource] = useState(643);
  const [nodeTarget, setNodeTarget] = useState(526);

  useEffect(() => {
    if (!mapRef.current) return;
    const extent = [2420000, 130000, 2900000, 1350000];
    const WMSwinterlandeskarteLayer = SwisstopoLayer(extent);

    const newMap = new Map({
      layers: [WMSwinterlandeskarteLayer],
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

    setMap(newMap);

    return () => {
      newMap.setTarget(null);
    };
  }, []);

  const handleLoadVectorData = () => {
    if (!map) return; // Check if map is initialized

    if (vectorLayer) {
      map.removeLayer(vectorLayer);
    }

    const newVectorSource = createVectorSource(
      "a_a_shortest_path&viewparams=source:" +
        nodeSource +
        ";target:" +
        nodeTarget +
        ";",
      bboxStrategy
    );

    const newVectorLayer = new VectorLayer({
      source: newVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    setVectorLayer(newVectorLayer);
    map.addLayer(newVectorLayer);
  };

  const handleChangeSourceAndTarget = () => {
    // Update source and target values
    const newSource = 6034;
    const newTarget = 2273;
    setNodeSource(newSource);
    setNodeTarget(newTarget);
  };

  useEffect(() => {
    handleLoadVectorData();
  }, [nodeSource, nodeTarget]);

  return (
    <div>
      <h1>My OpenLayers Map</h1>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      <button onClick={handleLoadVectorData}>Load Vector Data</button>
      <button onClick={handleChangeSourceAndTarget}>
        Change Source and Target
      </button>
    </div>
  );
};

export default Test_2;
