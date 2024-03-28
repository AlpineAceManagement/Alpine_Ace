// Verwende dynamisches Import, um node-fetch zu importieren
import("node-fetch")
  .then((module) => {
    // Importiere erfolgreich, verwende das Modul
    const fetch = module.default;

    // Führe die API-Anfrage durch
    fetch("http://localhost:5000/api/restaurant")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Response from server:", data);
        const jsonData = JSON.parse(data);
        console.log("Parsed JSON data:", jsonData);
      })
      .catch((error) => {
        console.error("Error fetching restaurant data", error);
      });
  })
  .catch((error) => {
    // Fehler beim Importieren des Moduls
    console.error("Error importing node-fetch module", error);
  });
