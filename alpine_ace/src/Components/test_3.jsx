import React, { useEffect, useState, useRef } from "react";
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

// this could be moved to a separate JS module
function createMap() {
  // TODO: refactor hard-coded values as function parameters

  // Base map
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

  const map = new Map({
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

  return map;
}

function createMarkersLayer(map) {
  if (!map) {
    throw new Error("Map is required");
  }

  const vectorSource = new VectorSource({
    features: [],
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);

  return vectorLayer;
}

function addMarker(map, layer, coords, style) {
  const markerStyle = new Style(
    style || {
      image: new Icon({
        src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    }
  );

  const markerGeometry = new Point(coords);
  const markerFeature = new Feature(markerGeometry);
  markerFeature.setStyle(markerStyle);

  // add feature to the layer
  layer.getSource().addFeature(markerFeature);

  // event handling
  const translate = new Translate({
    features: new Collection([markerFeature]), // Use a collection to pass markerFeature1
  });
  map.addInteraction(translate);

  translate.on("translatestart", evt => {
    // Handle translatestart event
    console.log("Translatifon started:", evt);
  });

  translate.on("translateend", evt => {
    // Handle translateend event
    console.log("Translation ended:", evt);
  });
}

// creating the map and markers layer outside the component!!!
const map = createMap();
const markersLayer = createMarkersLayer(map);

const MapWithMarkers = () => {
  const [markersLayerHidden, setMarkersLayerHidden] = useState(false);
  const mapContainerRef = useRef();

  const handleButtonClick = () => {
    setMarkersLayerHidden(!markersLayerHidden);
  };

  useEffect(() => {
    markersLayer.setVisible(!markersLayerHidden);
  }, [markersLayerHidden]);

  useEffect(() => {
    // add a test marker
    addMarker(map, markersLayer, [2762073, 1180429]);

    // set the DOM node target for the map
    map.setTarget(mapContainerRef.current);
  }, []);

  return (
    <div>
      <button onClick={handleButtonClick}>
        {markersLayerHidden ? "Show Marker" : "Hide Marker"}
      </button>
      <div
        ref={mapContainerRef}
        // id="map"
        style={{ width: "100%", height: "400px" }}
      ></div>
    </div>
  );
};

export default MapWithMarkers;
