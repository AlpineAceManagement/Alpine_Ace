import TileLayer from "ol/layer/Tile"; // Importiere direkt aus ol/layer
import { TileWMS } from "ol/source";

export function SwisstopoLayer(extent) {
  return new TileLayer({
    // Verwende direkt den importierten Namen TileLayer
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
}
