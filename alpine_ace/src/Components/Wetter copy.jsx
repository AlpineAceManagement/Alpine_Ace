import React, { useState, useEffect } from 'react';
import { vega } from 'vega';
import vegaEmbed from "vega-embed";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch("http://localhost:5000/api/prognose")
      .then(response => {
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Wetterdaten');
        }
        return response.json();
      })
      .then(data => {
        const vorbereiteteDaten = data.map(datenpunkt => {
          return {
            datum: new Date(datenpunkt.pg_datum),
            temperatur: datenpunkt.pg_temperatur,
            niederschlagswahrscheinlichkeit: datenpunkt.pg_niederschlagswahrscheinlichkeit
          };
        });
        setWeatherData(vorbereiteteDaten);
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Fehler beim Laden:', error);
        // Fehler an den Benutzer melden (z. B. als Fehlermeldung)
        setIsLoading(false); 
      });
  }, []);

  const spezifikation = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: weatherData
    },
    mark: 'line',
    encoding: {
      x: { field: 'datum', type: 'temporal', axis: { title: 'Datum' } },
      y: { field: 'temperatur', type: 'quantitative', axis: { title: 'Temperatur (°C)' } },
      tooltip: [
        { field: 'datum', type: 'temporal', format: '%d.%m.%Y %H:%M' },
        { field: 'temperatur', type: 'quantitative', format: '.2f°C' },
        { field: 'niederschlagswahrscheinlichkeit', type: 'quantitative', format: '%d%%' }
      ]
    },
    scales: {
      x: {
        type: 'time',
        domain: { data: 'values', field: 'datum' }
      },
      y: {
        type: 'linear',
        domain: { data: 'values', field: 'temperatur' }
      }
    }  
  };

  vegaEmbed('#vega-chart', spezifikation).then(function(result) {
    const view = result.view;
  });

  return (
    <div>
      {isLoading && <p>Lade Wetterdaten...</p>}
      <h1>Temperatur am {weatherData.length > 0 ? weatherData[0].datum.toLocaleDateString() : 'unbekannt'}</h1>
      <div id="vega-chart"></div>
    </div>
  );
} 

export default Weather;
