import { Style, Stroke, Icon, Fill } from "ol/style";
import LineString from "ol/geom/LineString";

const strichStaerkeAnlage = 4;
const farbeAnlage = "#757575";
const offsetDistance = 20;

export function anlagenStyle(feature) {
  const geometry = feature.getGeometry();
  if (geometry.getType() === "LineString") {
    const coordinates = geometry.getCoordinates();
    const lineStyles = [];
    const originalLineStyle = new Style({
      stroke: new Stroke({
        color: farbeAnlage,
        width: strichStaerkeAnlage,
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
            color: farbeAnlage,
            width: strichStaerkeAnlage,
          }),
        });
        lineStyles.push(lineStyle);
      }
    }
    return lineStyles;
  }
}

export function pistenStyle(feature) {
  // Klassierung nach Farbe
  const colorAttribute = feature.get("p_farbe");
  let color = null;
  // Farbe zuweisen
  if (colorAttribute === "Blau") {
    color = "#0077BA";
  } else if (colorAttribute === "Rot") {
    color = "#E40513";
  } else if (colorAttribute === "Schwarz") {
    color = "#000000";
  }
  // Rückgabe des Styles mit dynamischer Farbe
  return new Style({
    stroke: new Stroke({
      color: color,
      width: 4,
    }),
  });
}

const basisPfadKartenSymbole =
  "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/";

// Haltestellen Layer Styl mit Icon
export function oevStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "oev_haltestelle.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

export function parkplatzStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "parkplatz.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

export function restaurantStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "restaurant.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

export function kantonsGrenzenStyle() {
  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0,0)",
    }),
  });
}

export function landesGrenzenStyle() {
  return new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0,0.5)",
      width: 2.5,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0,0)",
    }),
  });
}
