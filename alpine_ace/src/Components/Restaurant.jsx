import React, { useState, useEffect } from "react";

const Restaurant = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurant")
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

  return (
    <div>
      <h1>Restaurant Data</h1>
      <ul>
        {restaurantData.map((restaurant) => (
          <li key={restaurant.restaurant_id}>
            <h2>{restaurant.r_name}</h2>
            <p>Infos: {restaurant.r_infos}</p>
            <p>Öffnungszeiten: {restaurant.r_oeffnungszeiten}</p>
            <p>Telefon: {restaurant.r_telefon}</p>
            <p>Email: {restaurant.r_email}</p>
            <p>Webseite: {restaurant.r_webseite}</p>
            <p>Foto Datei: {restaurant.r_dateiname_foto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurant;
