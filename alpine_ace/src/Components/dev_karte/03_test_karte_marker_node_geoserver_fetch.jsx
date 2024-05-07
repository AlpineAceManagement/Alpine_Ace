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
  const [marker1Coord, setMarker1Coord] = useState(null);
  const [marker2Coord, setMarker2Coord] = useState(null);

  const handleButtonClick1 = () => {
    setShowMarker1(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        setMarker1Coord(centerCoord);
        addMarker1(centerCoord, "marker1");
      }
    }
  };

  const handleButtonClick2 = () => {
    setShowMarker2(true);
    if (map) {
      const view = map.getView();
      const centerCoord = view.getCenter();
      if (centerCoord) {
        setMarker2Coord(centerCoord);
        addMarker2(centerCoord, "marker2");
      }
    }
  };

  const handleHideMarker1 = () => {
    setShowMarker1(false);
    setMarker1Coord(null);
    // Remove marker1 from the map
  };

  const handleHideMarker2 = () => {
    setShowMarker2(false);
    setMarker2Coord(null);
    // Remove marker2 from the map
  };

  const addMarker1 = (coord, markerType) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png",
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker1(evt.coordinate);
    });
  };

  const addMarker2 = (coord, markerType) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker_3cc483.png",
        scale: 0.7,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

    translate.on("translateend", (evt) => {
      fetchDataForMarker2(evt.coordinate);
    });
  };

  const [nodeSource, setNodeSource] = useState(null);
  const fetchDataForMarker1 = (coordinate) => {
    const [x, y] = coordinate;
    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
    // Make a request to the generated URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("nodeSource:", id);
        setNodeSource(id); // Update the node_source variable with the ID
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };
  const [nodeTarget, setNodeTarget] = useState(null);
  const fetchDataForMarker2 = (coordinate) => {
    const [x, y] = coordinate;
    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
    // Make a request to the generated URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("nodetarget:", id);
        setNodeTarget(id); // Update the node_source variable with the ID
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };

  useEffect(() => {
    // Initialize map
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
