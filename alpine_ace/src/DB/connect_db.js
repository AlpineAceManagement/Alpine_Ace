const express = require("express");
const { Pool } = require("pg"); // Importieren Sie Pool hier
const cors = require("cors");
<<<<<<< HEAD
require("dotenv").config(); // Importieren Umgebungsvariablen
=======
const dotenv = require('dotenv'); // Importieren dotenv
dotenv.config(); // Importieren Umgebungsvariablen

>>>>>>> 38ac42fc30b1f3765187f1819301082982073f4f

const app = express();

app.use(cors());

// Zugriffsdaten zum GeoServer
const pool = new Pool({
  user: "postgres",
<<<<<<< HEAD
  host: "localhost",
  database: "geoserver",
  password: "jNtd2C13ka9oaPpRy1jP",
  port: 5433,
=======
  host: "locahost",
  database: "AlpineAce",
  password: "TeamLH44",
  port: 5432,
>>>>>>> 38ac42fc30b1f3765187f1819301082982073f4f
});

// ---------Théo---------
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'geoserver',
//   password: 'Mj5ty2ga8',
//   port: 5433,
// })

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

app.get("/api/prognose", async(reg, res) =>{
  try{
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM prognose ORDER BY prognose_id;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  }catch(error){
    console.error("Error executing query", error);
    res.status(500).json({error: "Internal server error"});
  }
})

app.get("/api/schneehoehe", async(reg,res) =>{
  try{
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM Schneehoehe ORDER BY schneehoehe_id;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  }catch(error){
    console.error("Error executing query", error);
    res.status(500).json({error: "Internal server error"});
  }
})

app.get("/api/messdaten", async(reg,res) =>{
  try{
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM messdaten ORDER BY schneehoehe_id;"
    );
    const data = result.rows;
    client.release();
    res.json(data);
  }catch(error){
    console.error("Error executing query", error);
    res.status(500).json({error: "Internal server error"});
  }
})

// Starten den Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
