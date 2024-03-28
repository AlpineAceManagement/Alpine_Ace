const express = require("express");
const { Pool } = require("pg"); // Importieren Sie Pool hier
const cors = require("cors");
const app = express();

app.use(cors());

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geoserver",
  password: "jNtd2C13ka9oaPpRy1jP",
  port: 5433, // Default PostgreSQL port
});

// Route to fetch all data from the Restaurant table
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
