/* Code für das Restaurantmenü mit für jedes Restaurant einem Bild */
/*Beim anklicken eines Restaurants wird in den RestaurantViewer.jsx navigiert*/
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link } from "react-router-dom";
import "../App.css";
import config from "./Network/network_config";

const Restaurant = () => {
  //------------------------------------------------------------------------
  // Anziehen der Restaurant API :)
  //------------------------------------------------------------------------
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aufrufen der API von Node Server connect_db
    fetch(`${config.projectIPadress}:5000/api/restaurant`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      // Setzen der Daten in RestaurantData
      .then((data) => {
        setRestaurantData(data);
        setLoading(false);
      })
      //Fehler in der Konsole anzeigen
      .catch((error) => {
        console.error("Error fetching restaurant data", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Text der während des Ladens angezeigt wird
  if (loading) {
    return <div>Lade die Daten vom Server...</div>;
  }
  // Fehlermeldung anzeigen
  if (error) {
    return <div>Fehler: {error.message}</div>;
  }
  //------------------------------------------------------------------------
  return (
    // Theme wird aufgerufen
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
            // Styling der Hintergrund Box
            width: "90vw",
            minHeight: "50vh",
            borderRadius: 4,
            bgcolor: "p_white.main",
            marginBottom: "20px",
            overflowY: "auto",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Restaurants</h1>

          <Box //Box für die Anordnung der Restuarntboxen
            marginTop={"2vh"}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="right"
            gap={3} // Abstand zwischen zwei Boxen
          >
            {restaurantData.map(
              (
                restaurant // Mapping der Restaurantdaten
              ) => (
                <Link
                  key={restaurant.restaurant_id}
                  to={`/Restaurant_Viewer?Restaurant_ID=${restaurant.restaurant_id}`} // Link auf Restaurant_Viewer
                  style={{ textDecoration: "none", color: "inherit" }} // Link wird immer gleich angezigt auch wenn dieser schon verwendet wurde
                >
                  <Box
                    width="40vw"
                    className="restaurant-box"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="foto_restaurant"
                      src={require(`../Restaurant_data/${restaurant.r_dateipfad_bildname}`)} //Bildpfad
                      alt={restaurant.r_name} //Bildbeschreibung
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
