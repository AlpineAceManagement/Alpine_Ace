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
  const [map, setMap] = useState(null);
  const [marker1Visible, setMarker1Visible] = useState(false);
  const [marker2Visible, setMarker2Visible] = useState(false);

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
    if (marker1Visible && map) {
      createMarker([2762073, 1180429], map);
    }
  }, [marker1Visible, map]);

  useEffect(() => {
    if (marker2Visible && map) {
      createMarker([2772073, 1190429], map);
    }
  }, [marker2Visible, map]);

  const createMarker = (coord, map) => {
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

  const handleMarker1ButtonClick = () => {
    setMarker1Visible(true);
    setMarker2Visible(false); // Ensure marker 2 is hidden
  };

  const handleMarker2ButtonClick = () => {
    setMarker2Visible(true);
    setMarker1Visible(false); // Ensure marker 1 is hidden
  };

  return (
    <div>
      <button onClick={handleMarker1ButtonClick}>Show Marker 1</button>
      <button onClick={handleMarker2ButtonClick}>Show Marker 2</button>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MapWithMarkers;
