//https://jsfiddle.net/jonataswalker/70vsd0of/

import React, { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Icon } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";

const MapWithMarkers = () => {
  useEffect(() => {
    const coord1 = [-5707673.76, -3499420.81];

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

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer, // Add the vector layer to the map
      ],
      view: new View({
        center: coord1,
        zoom: 5,
      }),
    });

    const translate1 = new Translate({
      features: new Collection([markerFeature1]), // Use a collection to pass markerFeature1
    });
    map.addInteraction(translate1);

    translate1.on("translatestart", (evt) => {
      // Handle translatestart event
      console.log("Translation started:", evt);
    });

    translate1.on("translateend", (evt) => {
      // Handle translateend event
      console.log("Translation ended:", evt);
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default MapWithMarkers;
