import React from "react";
import Box from "@mui/material/Box";
import restaurantData from "./restaurant_data.js";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "../App.css";

const Restaurant = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>List of Restaurants</h2>
        <Box
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
      </div>
    </ThemeProvider>
  );
};

export default Restaurant;
