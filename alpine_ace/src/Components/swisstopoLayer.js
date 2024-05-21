/* Dieser Code erstellt mithilfe von OpenLayers eine WMS-Kachelschicht von swisstopo */
import TileLayer from "ol/layer/Tile"; // Importiere direkt aus ol/layer
import { TileWMS } from "ol/source";

export function SwisstopoLayer(extent) {
  return new TileLayer({
    // Verwende direkt den importierten Namen TileLayer
    extent: extent,
    source: new TileWMS({
      // Basis-URL
      url: "https://wms.geo.admin.ch/",
      crossOrigin: "anonymous",
      //Quellenangabe
      attributions:
        '© <a href="https://www.geo.admin.ch/de/wms-verfuegbare-dienste-und-daten" >geo.admin.ch</a>',
      projection: "EPSG:2056",
      params: {
        // Layer-URL
        LAYERS: "ch.swisstopo.pixelkarte-farbe-winter",
        FORMAT: "image/jpeg",
      },
      serverType: "mapserver",
    }),
  });
}
