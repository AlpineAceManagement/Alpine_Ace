import React, { useState, useEffect } from "react";

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

    //------------------------------------------------------------------------
  }

  return (
    <div>
      <h1>Restaurant Data</h1>
      <ul>
        {restaurantData.map(
          (
            restaurant //Mapen nach Restaurantnamen
          ) => (
            <li key={restaurant.restaurant_id}>
              <h2>{restaurant.r_name}</h2>
              <p>Foto Datei: {restaurant.r_dateiname_foto}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Restaurant;
