import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileWMS, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Style, Icon } from "ol/style";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Projection } from "ol/proj";

const Test_2 = () => {
  const [map, setMap] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null); // State to store the selected feature properties

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

    const pointVectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        // URL to the WFS resource on the GeoServer
        return (
          "http://localhost:8080/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=" +
          "Alpine_Ace:Restaurant" +
          "&outputFormat=application/json"
        );
      },
      strategy: bboxStrategy,
      // Add error handler
      onError: function (error) {
        console.error("Error fetching WFS point data:", error);
      },
    });

    const pointVectorLayer = new VectorLayer({
      source: pointVectorSource,
      style: new Style({
        image: new Icon({
          src: "https://www.svgrepo.com/show/399602/restaurant.svg", // Path to your icon image
          anchor: [0.5, 1], // Set the anchor point to the center bottom of the icon
          scale: 0.025,
        }),
      }),
    });

    // Create a new map instance
    const map = new Map({
      target: "map", // ID of the DOM element where the map will be rendered
      layers: [swisstopoLayer, pointVectorLayer],
      view: new View({
        center: [2762073, 1180429],
        zoom: 12,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    // Parse URL parameters
    const getUrlParameter = (name) => {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(window.location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    const r_name = getUrlParameter("r_name");

    // Filter point layer based on the parameter
    if (r_name) {
      pointVectorSource.once("change", function (evt) {
        if (pointVectorSource.getState() === "ready") {
          const features = pointVectorSource.getFeatures();
          const selectedFeature = features.find(
            (feature) => feature.get("name") === r_name
          );
          if (selectedFeature) {
            // Highlight or select the feature
            // For example, change its style
            selectedFeature.setStyle(
              new Style({
                image: new Icon({
                  src: "https://www.svgrepo.com/show/399602/restaurant.svg", // Path to your highlighted icon image
                  anchor: [0.5, 1],
                  scale: 0.05,
                }),
              })
            );
            // Pan to the selected feature
            const selectedFeatureCoords = selectedFeature
              .getGeometry()
              .getCoordinates();
            map
              .getView()
              .animate({ center: selectedFeatureCoords, duration: 1000 });
          }
        }
      });
    }

    const handleClick = (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        console.log("Feature Eigenschaften:", feature.getProperties());

        // Setzen von Mindest- und Maximalzoomstufen
        const minZoomLevel = 8; // Beispielwert für Mindestzoomstufe
        const maxZoomLevel = 16; // Beispielwert für Maximalzoomstufe
        map.getView().setMinZoom(minZoomLevel);
        map.getView().setMaxZoom(maxZoomLevel);

        // Zoom auf das ausgewählte Feature
        map.getView().fit(feature.getGeometry().getExtent(), {
          duration: 500, // Optional: Animate the zooming process
          padding: [1000, 1000, 1000, 1000], // Optional: Add padding around the extent
        });

        setSelectedFeature(feature.getProperties()); // Update selected feature state
      });
    };

    // Event-Handler für das Klicken auf Features hinzufügen
    map.on("click", handleClick);

    // Update the size of the map when the window is resized
    window.addEventListener("resize", () => {
      map.updateSize();
    });

    return () => {
      // Event-Handler beim Entfernen der Komponente entfernen
      map.on("click", handleClick);
      window.removeEventListener("resize", () => {
        map.updateSize();
      });
    };
  }, []);

  return (
    <div id="map" style={{ width: "100%", height: "200px" }}>
      {selectedFeature && (
        <div className="informationen-karte">
          {/* Wenn ein Restaurant ausgewählt ist */}
          {selectedFeature.r_name && (
            <>
              <h2>{selectedFeature.r_name}</h2>
              <p>Öffnungszeiten: {selectedFeature.r_oeffnungszeiten}</p>
              <p>Telefon: {selectedFeature.r_telefon}</p>
              <p>Email: {selectedFeature.r_email}</p>
              <p>Webseite: {selectedFeature.r_webseite}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Test_2;
