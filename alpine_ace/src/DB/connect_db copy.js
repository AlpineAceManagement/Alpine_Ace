const express = require("express");
const { Pool } = require("pg"); // Importieren Sie Pool hier
const cors = require("cors");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))

const app = express();

app.use(cors());

// Zugriffsdaten zum GeoServer
const pool = new Pool(config.database);

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

// Starten den Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
