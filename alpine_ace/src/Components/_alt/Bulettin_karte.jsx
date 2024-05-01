import React, { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { Icon, Circle, Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";

const Bulettin_karte = () => {
  useEffect(() => {
    const geoserverWFSAnfrage =
      "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
    const geoserverWFSOutputFormat = "&outputFormat=application/json";
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

    const bulettinVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          geoserverWFSAnfrage +
          "Alpine_Ace:bulletins" +
          geoserverWFSOutputFormat
        );
      },
      strategy: bboxStrategy,
      // Set the data projection to EPSG:4326 (WGS 84)
      dataProjection: "EPSG:2056",
      // Set the feature projection to match the map's projection (EPSG:2056)
      featureProjection: "EPSG:2056",
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    const bulettinVectorLayer = new VectorLayer({
      source: bulettinVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
        }),
      }),
    });

    swisstopoLayer.setZIndex(0);
    bulettinVectorLayer.setZIndex(1);

    // Create a new map instance
    const map = new Map({
      target: "map", // The ID of the DOM element where the map will be rendered
      layers: [bulettinVectorLayer],
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

export default Bulettin_karte;
