import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";

const Test_2 = ({ map }) => {
  const mapRef = useRef(null);

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

    // Create a new map instance if not passed as prop
    const map = new Map({
      layers: [swisstopoLayer], // Füge den Linien-Layer hinzu
      target: mapRef.current,
      view: new View({
        center: [2750000, 1200000],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    if (!map) {
      // Cleanup function
      return () => {
        map.setTarget(null); // Remove the map from the DOM when the component is unmounted
      };
    }
  }, [map]); // Run this effect whenever the map prop changes or at the initial render

  const flyToPosition = (event) => {
    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      console.log("Feature Eigenschaften:", feature.getProperties());

      // Setzen von Mindest- und Maximalzoomstufen
      const minZoomLevel = 8; // Beispielwert für Mindestzoomstufe
      const maxZoomLevel = 16; // Beispielwert für Maximalzoomstufe
      map.getView().setMinZoom(minZoomLevel);
      map.getView().setMaxZoom(maxZoomLevel);

      // Zoom auf das ausgewählte Feature
      map.getView().fit(feature.getGeometry().getExtent(), {
        duration: 500, // Optional: Animate the zooming process
        padding: [1000, 1000, 1000, 1000], // Optional: Add padding around the extent
      });
    });
  };

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>{" "}
      {/* Container for the map */}
      <button onClick={flyToPosition}>Fly to Position</button>
    </div>
  );
};

export default Test_2;
