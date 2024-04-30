import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";

const MapWithMarkers = () => {
  const [showMarker, setShowMarker] = useState(false);
  const [map, setMap] = useState(null);

  const handleButtonClick = () => {
    setShowMarker(true);
  };

  useEffect(() => {
    if (!map) {
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
        target: "map",
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
      setMap(newMap);
    }
  }, [map]);

  useEffect(() => {
    if (showMarker && map) {
      const coord1 = [2762073, 1180429];

      const markerStyle = new Style({
        image: new Icon({
          src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
          scale: 0.7,
          anchor: [0.5, 1],
        }),
      });

      const marker1 = new Point(coord1);
      const markerFeature1 = new Feature(marker1);
      markerFeature1.setStyle(markerStyle);

      const vectorSource = new VectorSource({
        features: [markerFeature1],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);

      const translate1 = new Translate({
        features: new Collection([markerFeature1]), // Use a collection to pass markerFeature1
      });
      map.addInteraction(translate1);

      translate1.on("translatestart", (evt) => {
        // Handle translatestart event
        console.log("Translatifon started:", evt);
      });

      translate1.on("translateend", (evt) => {
        // Handle translateend event
        console.log("Translation ended:", evt);
      });

      return () => {
        map.removeLayer(vectorLayer);
      };
    }
  }, [showMarker]); // Only run once when showMarker changes

  return (
    <div>
      <button onClick={handleButtonClick}>Show Marker</button>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapWithMarkers;
