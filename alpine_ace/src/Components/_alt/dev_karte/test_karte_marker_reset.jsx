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
  const [showMarker1, setShowMarker1] = useState(false);
  const [showMarker2, setShowMarker2] = useState(false);
  const [map, setMap] = useState(null);
  const [marker1Layer, setMarker1Layer] = useState(null);
  const [marker2Layer, setMarker2Layer] = useState(null);

  const handleButtonClick1 = () => {
    setShowMarker1(true);
  };

  const handleButtonClick2 = () => {
    setShowMarker2(true);
  };

  const handleHideMarker1 = () => {
    setShowMarker1(false);
    if (marker1Layer) {
      map.removeLayer(marker1Layer);
    }
  };

  const handleHideMarker2 = () => {
    setShowMarker2(false);
    if (marker2Layer) {
      map.removeLayer(marker2Layer);
    }
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
    if (showMarker1 && map) {
      const marker1Style = new Style({
        image: new Icon({
          src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
          scale: 0.7,
          anchor: [0.5, 1],
        }),
      });

      const marker1 = new Point([2762073, 1180429]);
      const marker1Feature = new Feature(marker1);
      marker1Feature.setStyle(marker1Style);

      const marker1VectorSource = new VectorSource({
        features: [marker1Feature],
      });

      const marker1VectorLayer = new VectorLayer({
        source: marker1VectorSource,
      });

      map.addLayer(marker1VectorLayer);
      setMarker1Layer(marker1VectorLayer);

      const translate1 = new Translate({
        features: new Collection([marker1Feature]),
      });
      map.addInteraction(translate1);

      translate1.on("translatestart", (evt) => {
        console.log("Translation started:", evt);
      });

      translate1.on("translateend", (evt) => {
        console.log("Translation ended:", evt);
      });
    }
  }, [showMarker1, map]);

  useEffect(() => {
    if (showMarker2 && map) {
      const marker2Style = new Style({
        image: new Icon({
          src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
          scale: 0.7,
          anchor: [0.5, 1],
        }),
      });

      const marker2 = new Point([2772173, 1190829]);
      const marker2Feature = new Feature(marker2);
      marker2Feature.setStyle(marker2Style);

      const marker2VectorSource = new VectorSource({
        features: [marker2Feature],
      });

      const marker2VectorLayer = new VectorLayer({
        source: marker2VectorSource,
      });

      map.addLayer(marker2VectorLayer);
      setMarker2Layer(marker2VectorLayer);

      const translate2 = new Translate({
        features: new Collection([marker2Feature]),
      });
      map.addInteraction(translate2);

      translate2.on("translatestart", (evt) => {
        console.log("Translation started:", evt);
      });

      translate2.on("translateend", (evt) => {
        console.log("Translation ended:", evt);
      });
    }
  }, [showMarker2, map]);

  return (
    <div>
      <button onClick={handleButtonClick1} disabled={showMarker1}>
        Show Marker 1
      </button>
      <button onClick={handleButtonClick2} disabled={showMarker2}>
        Show Marker 2
      </button>
      <button
        onClick={() => {
          handleHideMarker1();
          handleHideMarker2();
        }}
      >
        Reset Markers
      </button>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapWithMarkers;
