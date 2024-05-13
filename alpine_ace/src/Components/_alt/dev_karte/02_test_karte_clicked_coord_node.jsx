import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";
import { toStringXY } from "ol/coordinate";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { DragAndDrop } from "ol/interaction";

const Test = () => {
  const [clickCoord, setClickCoord] = useState(null);
  const [geoJSONResponse, setGeoJSONResponse] = useState(null);
  const [error, setError] = useState(null);

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

    // Create a new vector source and layer for the draggable marker
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
    });

    // Create a new map instance
    const map = new Map({
      target: "map", // The ID of the DOM element where the map will be rendered
      layers: [swisstopoLayer, markerLayer], // Add the marker layer to the map
      view: new View({
        center: [2762073, 1180429],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    // Function to handle click event
    const handleClick = (event) => {
      const clickedCoord = event.coordinate;
      const clickedCoordStr = toStringXY(clickedCoord, 2); // Format the coordinates to string
      console.log("Clicked coordinates:", clickedCoordStr);
      setClickCoord(clickedCoord);
    };

    // Add click event listener to the map
    map.on("click", handleClick);

    // Add DragAndDrop interaction to allow dragging the marker
    const dragAndDropInteraction = new DragAndDrop({
      source: markerSource,
    });
    map.addInteraction(dragAndDropInteraction);

    // Cleanup function
    return () => {
      map.setTarget(null); // Remove the map from the DOM when the component is unmounted
      map.un("click", handleClick); // Remove click event listener
      map.removeInteraction(dragAndDropInteraction); // Remove DragAndDrop interaction
    };
  }, []); // Run this effect only once after the initial render

  useEffect(() => {
    if (clickCoord) {
      const [x, y] = clickCoord;
      const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
      console.log("Generated URL:", url);
      // Make a request to the generated URL
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Response from GeoServer:", data);
          setGeoJSONResponse(data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
          setGeoJSONResponse(null);
        });
    }
  }, [clickCoord]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      {error && <div>Error: {error}</div>}
      {geoJSONResponse && (
        <pre>GeoJSON Response: {JSON.stringify(geoJSONResponse, null, 2)}</pre>
      )}
    </div>
  );
};

export default Test;
