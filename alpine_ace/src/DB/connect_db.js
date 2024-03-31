const express = require("express");
const { Pool } = require("pg"); // Importieren Sie Pool hier
const cors = require("cors");
const app = express();

app.use(cors());

// Zugriffsdaten zum GeoServer
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geoserver",
  password: "jNtd2C13ka9oaPpRy1jP",
  port: 5433, // Port auf PC nicht Standart (5433) WICHTIG auf Server ändern
});

// Route um Restaurant Daten zu beziehen
app.get("/api/restaurant", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Restaurant");
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
