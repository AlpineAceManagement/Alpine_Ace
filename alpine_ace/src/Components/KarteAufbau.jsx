import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import View from "ol/View";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import { Icon, Circle, Fill, Stroke, Style } from "ol/style";
import { Projection } from "ol/proj";
import LineString from "ol/geom/LineString.js";

const KarteAufbau = ({ mapRef, setSelectedFeature, source, target }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // GeoServer layer arbeitsbereich:datenspeicher
    const geoserverWFSPointLayer = "Alpine_Ace:Restaurant";
    const geoserverWFSLineLayer = "Alpine_Ace:pisten";
    const geoserverWFSAnlagenLayer = "Alpine_Ace:anlagen";
    const geoserverWFSNaviLayer = "Alpine_Ace:a_a_shortest_path";

    const pointVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSPointLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    const lineVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSLineLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });

    const naviVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSNaviLayer +
          "&viewparams=source:" +
          source +
          ";target:" +
          target +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS line data:", error);
      },
    });
    console.log("naviVectorSource", naviVectorSource);
    const anlagenVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          geoserverWFSAnlagenLayer +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      onError: function (error) {
        console.error("Error fetching WFS anlagen data:", error);
      },
    });

    const pointVectorLayer = new VectorLayer({
      source: pointVectorSource,
      style: new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({
            color: "green",
          }),
        }),
      }),
    });

    const pistenVectorLayer = new VectorLayer({
      source: lineVectorSource,
      style: function (feature) {
        const colorAttribute = feature.get("p_farbe");
        let color = "#E40513"; // Default color: red

        if (colorAttribute === "Blau") {
          color = "#0077BA";
        } else if (colorAttribute === "Schwarz") {
          color = "#000000";
        }
        return new Style({
          stroke: new Stroke({
            color: color,
            width: 4,
          }),
        });
      },
    });

    const naviVectorLayer = new VectorLayer({
      source: naviVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "orange",
          width: 4,
        }),
      }),
    });

    const offsetDistance = 20;
    const anlagenStyle = function (feature) {
      const geometry = feature.getGeometry();

      if (geometry.getType() === "LineString") {
        const coordinates = geometry.getCoordinates();
        const lineStyles = [];

        const originalLineStyle = new Style({
          stroke: new Stroke({
            color: "black",
            width: 6,
          }),
        });

        lineStyles.push(originalLineStyle);

        let totalLength = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
          totalLength += Math.sqrt(
            Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
              Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2)
          );
        }

        const numIntervals = 5;
        const intervalLength = totalLength / numIntervals;

        for (let i = 0; i < coordinates.length - 1; i++) {
          const segmentLength = Math.sqrt(
            Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
              Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2)
          );

          const numSegments = Math.ceil(segmentLength / intervalLength);
          const intervalDistance = segmentLength / numSegments;

          const segmentVector = [
            (coordinates[i + 1][0] - coordinates[i][0]) / segmentLength,
            (coordinates[i + 1][1] - coordinates[i][1]) / segmentLength,
          ];

          for (let j = 0; j < numSegments; j++) {
            const intervalStart = [
              coordinates[i][0] + segmentVector[0] * j * intervalDistance,
              coordinates[i][1] + segmentVector[1] * j * intervalDistance,
            ];

            const intervalEndRight = [
              intervalStart[0] + segmentVector[1] * offsetDistance,
              intervalStart[1] - segmentVector[0] * offsetDistance,
            ];

            const intervalEndLeft = [
              intervalStart[0] - segmentVector[1] * offsetDistance,
              intervalStart[1] + segmentVector[0] * offsetDistance,
            ];

            const line = new LineString([intervalEndLeft, intervalEndRight]);

            const lineStyle = new Style({
              geometry: line,
              stroke: new Stroke({
                color: "black",
                width: 6,
              }),
            });

            lineStyles.push(lineStyle);
          }
        }

        return lineStyles;
      }
    };

    const anlagenVectorLayer = new VectorLayer({
      source: anlagenVectorSource,
      style: anlagenStyle,
    });

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

    swisstopoLayer.setZIndex(0);
    anlagenVectorLayer.setZIndex(1);
    pistenVectorLayer.setZIndex(2);
    naviVectorLayer.setZIndex(3);
    pointVectorLayer.setZIndex(4);

    const newMap = new Map({
      layers: [
        swisstopoLayer,
        pistenVectorLayer,
        pointVectorLayer,
        naviVectorLayer,
        anlagenVectorLayer,
      ],
      target: mapRef.current,
      view: new View({
        center: [2762073, 1180429],
        zoom: 16,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    const handleClick = (event) => {
      console.log("Map clicked");
      const clickedCoordinate = event.coordinate;
      console.log("Clicked Coordinate:", clickedCoordinate);

      newMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        console.log("Feature Properties:", feature.getProperties());
        setSelectedFeature(feature.getProperties());
      });
    };
  }, []);
  return null; // Or return any UI elements if needed
};

export default KarteAufbau;
