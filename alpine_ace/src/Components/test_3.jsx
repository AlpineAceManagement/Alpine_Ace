import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { TileWMS } from "ol/source";
import { Projection } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import Button from "@mui/material/Button";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";

const Test = () => {
  const mapRef = useRef(null); // Reference to the map container
  const [nodeSource, setNodeSource] = useState(646);
  const [nodeTarget, setNodeTarget] = useState(6085);
  const [showMarker1, setShowMarker1] = useState(false);
  const [markers, setMarkers] = useState([]); // Store marker positions
  const [mapInstance, setMapInstance] = useState(null);
  const [naviVectorLayer, setNaviVectorLayer] = useState(null);

  const handleButtonClick1 = () => {
    setShowMarker1(true);
    if (mapInstance) {
      const view = mapInstance.getView();
      const centerCoord = view.getCenter();

      if (centerCoord) {
        setMarkers([...markers, centerCoord]); // Save marker position
        addMarker(centerCoord);
      }
    }
  };

  const addMarker = (coord) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/map-marker_green.svg",
        scale: 1.75,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker coordinates to the marker object
    marker.setProperties({ coordinate: coord });

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    mapInstance.addLayer(vectorLayer);

    // Add translate interaction
    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    mapInstance.addInteraction(translate);

    translate.on("translateend", (evt) => {
      const updatedCoord = evt.coordinate;
      marker.setCoordinates(updatedCoord); // Update marker coordinates directly
      marker.setProperties({ coordinate: updatedCoord }); // Update marker properties
      fetchDataForMarker(updatedCoord);

      // Log the new position of the marker into the console
      console.log("New position:", updatedCoord);

      // Remove the existing marker
      mapInstance.removeLayer(vectorLayer);

      // Add a new marker at the same location
      addNewMarker(updatedCoord);
    });
  };

  const handleHideMarker1 = () => {
    setShowMarker1(false);
    setMarkers([]); // Clear marker positions
    // Remove marker1 from the map
  };

  const addNewMarker = (coord) => {
    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        src: "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/map-marker_green.svg",
        scale: 1.75,
        anchor: [0.5, 1],
      }),
    });

    // Create marker feature
    const marker = new Point(coord);
    const markerFeature = new Feature(marker);
    markerFeature.setStyle(markerStyle);

    // Add marker coordinates to the marker object
    console.log("coord:", coord);
    marker.setProperties({ coordinate: coord });

    // Add marker to the map
    const vectorSource = new VectorSource({
      features: [markerFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    mapInstance.addLayer(vectorLayer);
  };

  const fetchDataForMarker = (coordinate) => {
    const [x, y] = coordinate;
    const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.0.0&request=getFeature&typeName=Alpine_Ace:a_a_nearest_vertex&viewparams=x:${x};y:${y};&outputformat=application/json`;
    // Make a request to the generated URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const id = data.features[0].properties.id; // Extract ID from response
        console.log("nodeSource:", id);
        setNodeSource(id); // Update the node_source variable with the ID
        // Add the new marker at the updated coordinates
        addNewMarker(coordinate);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error accordingly
      });
  };

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

    const naviVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          "Alpine_Ace:a_a_shortest_path" +
          "&viewparams=source:" +
          nodeSource +
          ";target:" +
          nodeTarget +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });

    const newNaviVectorLayer = new VectorLayer({
      source: naviVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    setNaviVectorLayer(newNaviVectorLayer);

    const newMap = new Map({
      layers: [swisstopoLayer, newNaviVectorLayer],
      view: new View({
        center: [2762073, 1180429],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    setMapInstance(newMap);
  }, []); // Listen for changes in nodeSource and nodeTarget

  useEffect(() => {
    // Add markers when map is re-rendered
    const newMap = setMapInstance();
  }, [nodeSource, nodeTarget]);

  const handleButtonClick = () => {
    // Change the values of nodeSource and nodeTarget
    setNodeSource(6049);
    setNodeTarget(6085);
  };

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", borderRadius: "3vh" }}
      ></div>{" "}
      <Button onClick={handleButtonClick}>Change Values</Button>
      <Button onClick={handleButtonClick1}>Start</Button>
    </div>
  );
};

export default Test;
