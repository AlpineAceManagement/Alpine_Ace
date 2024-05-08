import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link } from "react-router-dom";
import "../App.css";

const Restaurant = () => {
  //------------------------------------------------------------------------
  // Anziehen der Restaurant API :)
  //------------------------------------------------------------------------
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurant") // API Pfad zur DB
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setRestaurantData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Funktion zum Navigieren zur Karte
  const navigateToMap = (restaurantId) => {
    // Hier können Sie die Navigation zur Karte implementieren
    console.log("Navigating to map with restaurant ID:", restaurantId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  //------------------------------------------------------------------------
  return (
    <ThemeProvider theme={theme}>
      <div
        className="main"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#282c34",
        }}
      >
        <Box
          sx={{
            width: "90vw",
            minHeight: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Restaurants</h1>

          <Box
            marginTop={"2vh"}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="right"
            gap={2} // Abstand zwischen Boxen
          >
            {restaurantData.map(
              (
                restaurant //Mapen nach Restaurantnamen, key ist id der DB
              ) => (
                <Link
                  key={restaurant.restaurant_id}
                  to={`/Restaurant_Viewer?Restaurant_ID=${restaurant.restaurant_id}`}
                  style={{ textDecoration: "none", color: "inherit" }} // Add color: "inherit" to inherit the text color from the parent
                >
                  <Box
                    width="40vw"
                    key={restaurant.restaurant_id}
                    className="restaurant-box"
                    // Add the click handler for each restaurant
                    onClick={() => navigateToMap(restaurant.restaurant_id)}
                  >
                    <img
                      className="foto_restaurant"
                      src={require(`../Restaurant_data/${restaurant.r_dateipfad_bildname}`)} // Path to the folder containing all images
                      alt={restaurant.r_name}
                    />
                    <h3 className="name_restaurant">{restaurant.r_name}</h3>
                  </Box>
                </Link>
              )
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Restaurant;
