import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
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
                <Box
                  width="40vw"
                  key={restaurant.restaurant_id}
                  className="restaurant-box"
                >
                  <img
                    className="foto_restaurant"
                    src={require(`../Restaurant_data/${restaurant.r_dateipfad_bildname}`)} // Pfad zum Ordner mit allen Bilder
                    alt={restaurant.r_name}
                  />
                  <h3 className="name_restaurant">{restaurant.r_name}</h3>
                </Box>
              )
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Restaurant;
