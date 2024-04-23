const express = require("express");
const { Pool } = require("pg"); // Importieren Sie Pool hier
const cors = require("cors");
const dotenv = require("dotenv"); // Importieren dotenv
dotenv.config(); // Importieren Umgebungsvariablen

const app = express();

app.use(cors());

// Zugriffsdaten zum GeoServer
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "AlpineACE",
//   password: "TeamLH44",
//   port: 5432,
// });

// ---------Fabian---------
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "geoserver",
//   password: "jNtd2C13ka9oaPpRy1jP",
//   port: 5433,
// });

// ---------Théo---------
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geoserver',
  password: 'Mj5ty2ga8',
  port: 5433,
});

// Route um Restaurant Daten zu beziehen
app.get("/api/restaurant", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM Restaurant ORDER BY r_name;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route um Skidaten Daten zu beziehen
app.get("/api/skidaten", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM Skidaten ORDER BY skidaten_id;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route um Wetter Daten zu beziehen

app.get("/api/prognose", async (req, res) => {
  try {
    const client = await pool.connect();
    const today = new Date();

    const formattedDate = await client.query(
      "SELECT date_trunc('day', NOW())::date AS today;" 
    )
    const actualDate = formattedDate.rows[0].today;

    const result = await client.query(
      "SELECT pg_datum, pg_niederschlagswahrscheinlichkeit, pg_temperatur, pg_cloud_cover FROM Prognose WHERE date_trunc('day', pg_datum) = $1 order by pg_datum ;",
      [actualDate]
    );

    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/schneehoehe", async (reg, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT sh_hoehe FROM Schneehoehe WHERE station_id = 'ROT3' ORDER BY sh_zeit DESC LIMIt 1;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/messdaten", async (reg, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM messdaten ORDER BY md_timestamp DESC LIMIT 1;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/saison_total", async (reg, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
        "SELECT sd_saison, SUM(sd_hoehenmeter) AS total_hoehenmeter, SUM(sd_distanz) AS total_distanz, AVG(sd_geschwindigkeit) AS average_geschwindigkeit, MAX(sd_maxgeschwindigkeit) AS max_geschwindigkeit FROM  skidaten GROUP BY  sd_saison;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/upload", async (reg, res) => {
  try {
    const client = await pool.connect();
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Starten den Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
