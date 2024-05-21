/* WFS-Anfrage für die Karte */
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

// WFS Anfrage-Funktion
// Eine der besten Funktionen, die ich geschrieben habe

const geoserverWFSAnfrage =
  "http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
const geoserverWFSOutputFormat = "&outputFormat=application/json";

export function createVectorSource(Abfrage, bboxStrategy) {
  return new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        geoserverWFSAnfrage + "Alpine_Ace:" + Abfrage + geoserverWFSOutputFormat
      );
    },
    strategy: bboxStrategy,
    onError: function (error) {
      console.error("Error fetching WFS data for " + Abfrage + ":", error);
    },
  });
}
