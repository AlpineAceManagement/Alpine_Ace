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
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        addMarker(centerCoord);
      }
    }
  };

  const handleButtonClick2 = () => {
    setShowMarker2(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        addMarker(centerCoord);
      }
    }
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

  const addMarker = (coord) => {
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

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
    if (showMarker1) {
      setMarker1Layer(vectorLayer);
    } else if (showMarker2) {
      setMarker2Layer(vectorLayer);
    }

    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translatestart", (evt) => {
      console.log("Translation started:", evt);
    });

    translate.on("translateend", (evt) => {
      console.log("Translation ended:", evt);
    });
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

  return (
    <div>
      <button onClick={handleButtonClick1} disabled={showMarker1}>
        Show Marker 1
      </button>
      <button onClick={handleButtonClick2} disabled={showMarker2}>
        Show Marker 2
      </button>
      {/* <button
        onClick={() => {
          handleHideMarker1();
          handleHideMarker2();
        }}
      >
        Reset Markers
      </button> */}
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapWithMarkers;
