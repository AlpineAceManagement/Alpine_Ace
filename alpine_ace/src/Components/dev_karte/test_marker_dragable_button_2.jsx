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
  const [markerLayer1, setMarkerLayer1] = useState(null);
  const [markerLayer2, setMarkerLayer2] = useState(null);

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

  const handleButtonClick1 = () => {
    setShowMarker1(true);
  };

  const handleButtonClick2 = () => {
    setShowMarker2(true);
  };

  useEffect(() => {
    if (showMarker1 && map && !markerLayer1) {
      const marker1 = createMarker([2762073, 1180429]);
      const vectorLayer = new VectorLayer({
        source: marker1.vectorSource,
      });
      map.addLayer(vectorLayer);
      setMarkerLayer1(vectorLayer);
    }
  }, [showMarker1, map, markerLayer1]);

  useEffect(() => {
    if (showMarker2 && map && !markerLayer2) {
      const marker2 = createMarker([2772173, 1190829]);
      const vectorLayer = new VectorLayer({
        source: marker2.vectorSource,
      });
      map.addLayer(vectorLayer);
      setMarkerLayer2(vectorLayer);
    }
  }, [showMarker2, map, markerLayer2]);

  const createMarker = (coord) => {
    const markerStyle = new Style({
      image: new Icon({
        src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    });

    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [markerFeature],
    });

    return {
      vectorSource: vectorSource,
    };
  };

  return (
    <div>
      <button onClick={handleButtonClick1} disabled={showMarker1}>
        Show Marker 1
      </button>
      <button onClick={handleButtonClick2} disabled={showMarker2}>
        Show Marker 2
      </button>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapWithMarkers;
