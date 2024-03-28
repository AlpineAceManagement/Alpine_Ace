import React from "react";
import Box from "@mui/material/Box";
import restaurantData from "./restaurant_data.js";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "../App.css";

const Restaurant = () => {
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
            width: "45vh",
            minHeight: "50vh", // Set a minimum height
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto", // Add scrollbar if needed
          }}
        >
          <h1 style={{ textAlign: "center" }}>Restaurants</h1>

          <Box
            marginTop={"2vh"}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            gap={2} // Adjust the gap between items as needed
          >
            {restaurantData.map((restaurant) => (
              <Box key={restaurant.id} className="restaurant-box">
                <img
                  className="foto_restaurant"
                  src={require(`../Restaurant_data/${restaurant.fileName}`)}
                  alt={restaurant.name}
                />
                <h3 className="name_restaurant">{restaurant.name}</h3>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Restaurant;
