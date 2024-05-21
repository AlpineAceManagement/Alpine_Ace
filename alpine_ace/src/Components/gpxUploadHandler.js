const express = require("express");
const router = express.Router();
const xml2js = require("xml2js");
const { Pool } = require("pg");
const config = require("./config");

// Namespace
const ns = { gpx: "http://www.topografix.com/GPX/1/1" };

// Fonction pour calculer la distance 3D entre deux points
function entfernung_3d(lat1_m, lon1_m, ele1, lat2_m, lon2_m, ele2) {
  const dx = lon2_m - lon1_m;
  const dy = lat2_m - lat1_m;
  const dz = ele2 - ele1;

  return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
}

// Fonction pour déterminer la saison en fonction de la date
function get_season(date) {
  const month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
  if (month >= 11) {
    return `${date.getFullYear()}/${date.getFullYear() + 1}`;
  } else if (month <= 4) {
    return `${date.getFullYear() - 1}/${date.getFullYear()}`;
  }
}

router.post("/api/upload", async (req, res) => {
  try {
    const uploadedFile = req.files.file; // Récupère le fichier envoyé depuis la requête POST

    // Charger le fichier GPX
    const parser = new xml2js.Parser();
    const gpxData = await parser.parseStringPromise(uploadedFile.data);

    // Initialiser les variables
    let max_geschwindigkeit = -Infinity;
    let gesamtzeit = 0;
    let gesamtgeschwindigkeit_kmh = 0;
    let anzahl_punkte = 0;
    let gesamtdistanz_m = 0;
    let hoehenmeter = 0;

    // Parcourir les points de la piste
    const streckenpunkte = gpxData.gpx.trk[0].trkseg[0].trkpt;
    const zeit1 = new Date(streckenpunkte[0].time[0]);

    // Traiter chaque point de la piste
    for (let i = 0; i < streckenpunkte.length - 1; i++) {
      const point1 = streckenpunkte[i];
      const point2 = streckenpunkte[i + 1];

      // Extraire les informations des points
      const lat1_grad = parseFloat(point1.$.lat);
      const lon1_grad = parseFloat(point1.$.lon);
      const lat2_grad = parseFloat(point2.$.lat);
      const lon2_grad = parseFloat(point2.$.lon);
      const ele1 = parseFloat(point1.ele[0]);
      const ele2 = parseFloat(point2.ele[0]);

      // Convertir les coordonnées degrés en mètres
      const lat1_m = lat1_grad * 111319.9;
      const lon1_m =
        lon1_grad * 111319.9 * Math.cos((lat1_grad * Math.PI) / 180);
      const lat2_m = lat2_grad * 111319.9;
      const lon2_m =
        lon2_grad * 111319.9 * Math.cos((lat2_grad * Math.PI) / 180);

      // Calculer la distance 3D
      const distance = entfernung_3d(
        lat1_m,
        lon1_m,
        ele1,
        lat2_m,
        lon2_m,
        ele2
      );

      // Calculer la différence d'altitude
      const hoehenunterschied = ele2 - ele1;

      // Calculer la différence de temps
      const zeit2 = new Date(point2.time[0]);
      const zeitunterschied = (zeit2 - zeit1) / 1000; // Convertir en secondes

      // Calculer la vitesse en m/s
      const geschwindigkeit_mps =
        zeitunterschied !== 0 ? distance / zeitunterschied : 0;

      // Convertir la vitesse en km/h
      const geschwindigkeit_kmh = geschwindigkeit_mps * 3.6;

      // Mettre à jour la vitesse maximale
      if (geschwindigkeit_kmh > max_geschwindigkeit) {
        max_geschwindigkeit = geschwindigkeit_kmh;
      }

      // Ajouter le temps au temps total
      gesamtzeit += zeitunterschied;

      // Ajouter la vitesse à la vitesse totale
      gesamtgeschwindigkeit_kmh += geschwindigkeit_kmh;
      anzahl_punkte++;

      // Ajouter la différence d'altitude à la somme totale si elle est inférieure à 10 mètres
      if (hoehenunterschied < 10) {
        hoehenmeter += hoehenunterschied;
      }

      gesamtdistanz_m += distance;
    }

    // Convertir le temps total en heures, minutes et secondes
    const gesamtstunden = Math.floor(gesamtzeit / 3600);
    const gesamtminuten = Math.floor((gesamtzeit % 3600) / 60);
    const gesamtsekunden = Math.floor(gesamtzeit % 60);

    // Formater le temps total
    const gesamtzeit_formatted = `${gesamtstunden
      .toString()
      .padStart(2, "0")}:${gesamtminuten
      .toString()
      .padStart(2, "0")}:${gesamtsekunden.toString().padStart(2, "0")}`;

    // Se connecter à la base de données PostgreSQL
    const pool = new Pool(config.db_config);

    // Extraire les données géométriques du fichier GPX et les convertir au format PostgreSQL
    const geometrie_text = streckenpunkte
      .map((point) => `${parseFloat(point.$.lon)} ${parseFloat(point.$.lat)}`)
      .join(",");

    // Insérer les données dans la base de données
    const insert_query = `
            INSERT INTO Skidaten (sd_date, sd_hoehenmeter, sd_distanz, sd_dauer, sd_geschwindigkeit, sd_maxgeschwindigkeit, sd_saison, sd_geometrie)
            VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8));
        `;
    const insert_values = [
      zeit1.toISOString().split("T")[0],
      Math.abs(hoehenmeter),
      gesamtdistanz_m / 1000, // Convertir en kilomètres
      gesamtzeit_formatted,
      gesamtgeschwindigkeit_kmh / anzahl_punkte,
      max_geschwindigkeit,
      get_season(zeit1),
      `LINESTRING(${geometrie_text})`,
    ];

    await pool.query(insert_query, insert_values);

    // Fermer la connexion
    await pool.end();

    // Envoyer une réponse
    res
      .status(200)
      .json({ message: "GPX file uploaded and processed successfully." });
  } catch (error) {
    console.error("Error uploading and processing GPX file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
