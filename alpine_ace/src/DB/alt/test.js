const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "geoserver",
  password: "jNtd2C13ka9oaPpRy1jP",
  port: 5433, // Default PostgreSQL port
});

// Test connection to PostgreSQL database
pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Error connecting to PostgreSQL database:", error);
  } else {
    console.log("Connected to PostgreSQL database");
    console.log("Current timestamp from the database:", result.rows[0].now);
  }
  pool.end(); // Close the pool
});
