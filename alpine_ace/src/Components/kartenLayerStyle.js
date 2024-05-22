/* Definition von Stillayern für die Karte */
import { Style, Stroke, Icon, Fill } from "ol/style";
import LineString from "ol/geom/LineString";
// -----------------------------------------------------
//                      Anlage Style
// -----------------------------------------------------
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

// -----------------------------------------------------
//                      Pisten Style
// -----------------------------------------------------

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

// Basis Pfad für die Icons

const basisPfadKartenSymbole =
  "https://raw.githubusercontent.com/AlpineAceManagement/Alpine_Ace/main/alpine_ace/src/Components/Karte_Symbole/";

// -----------------------------------------------------
//          Haltestellen Layer Style mit Icon
// -----------------------------------------------------

export function oevStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "oev_haltestelle.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

// ---------------------------------------------------
//          Parkplatz Layer Style mit Icon
// ---------------------------------------------------

export function parkplatzStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "parkplatz.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

// ---------------------------------------------------
//          Restaurant Layer Style mit Icon
// ---------------------------------------------------

export function restaurantStyle() {
  return new Style({
    image: new Icon({
      src: basisPfadKartenSymbole + "restaurant.svg",
      scale: 0.15,
      anchor: [0.5, 0.5],
    }),
  });
}

// ---------------------------------------------------
//          Kantonsgrenze Style
// ---------------------------------------------------

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

// ---------------------------------------------------
//          Landesgrenze Style
// ---------------------------------------------------

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

// ---------------------------------------------------
//          Navigation Style
// ---------------------------------------------------

export function naviStyl() {
  return new Style({
    stroke: new Stroke({
      color: "orange",
      width: 4,
    }),
  });
}

// ---------------------------------------------------
//          Aufgenommene Strecke Style
// ---------------------------------------------------

export function skidatenAnfrageStyl() {
  return new Style({
    stroke: new Stroke({
      color: "orange",
      width: 4,
    }),
  });
}

// ---------------------------------------------------
//               Lawinen-Bulletin Style
// ---------------------------------------------------

export function bulettinStyle(feature) {
  // b_danger vom Feature holen und in dangerAttribute speichern
  const dangerAttribute = feature.get("b_danger");

  // Standardfarben und Transparenz definieren
  let strokeColor = "#FFFFFF";
  let fillColor = "rgba(255, 255, 255, 0.5)";
  let fillOpacity = 0.5; // Default fill opacity

  // Farben und Transparenz anhand des dangerAttributes anpassen
  switch (dangerAttribute) {
    case "low":
      strokeColor = "rgb(175, 255, 1)";
      fillColor = "rgba(175, 255, 1, " + fillOpacity + ")";
      break;
    case "moderate":
      strokeColor = "rgba(255, 255, 0)";
      fillColor = "rgba(255, 255, 0, " + fillOpacity + ")";
      break;
    case "considerable":
      strokeColor = "rgba(254, 165, 0)";
      fillColor = "rgba(254, 165, 0, " + fillOpacity + ")";
      break;
    case "high":
      strokeColor = "rgba(254, 0, 0)";
      fillColor = "rgba(254, 0, 0, " + fillOpacity + ")";
      break;
    case "very_high":
      strokeColor = "rgba(128, 0, 0)";
      fillColor = "rgba(128, 0, 0, " + fillOpacity + ")";
      break;
    case "no_snow":
      strokeColor = "rgba(190, 190, 190)";
      fillColor = "rgba(190, 190, 190, " + fillOpacity + ")";
      break;
    case "no_rating":
      strokeColor = "rgba(0, 0, 0)";
      fillColor = "rgba(0, 0, 0, " + fillOpacity + ")";
      break;
    default:
      break;
  }

  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: 2.5, // Strichstärke der Umrandung
    }),
    fill: new Fill({
      color: fillColor,
    }),
  });
}
