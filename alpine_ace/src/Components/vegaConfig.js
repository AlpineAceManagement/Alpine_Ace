const fetch = require('node-fetch');
const { compile } = require('vega-lite');

// Daten von der API abrufen
async function fetchWeatherData() {
    const response = await fetch('URL_DER_API');
    const data = await response.json();
    return data;
}

// Daten für das Vega-Liniendiagramm vorbereiten
function prepareChartData(data) {
    const chartData = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": data.map(entry => ({
                date: new Date(entry.pg_datum),
                temperature: entry.pg_temperatur
            }))
        },
        "mark": "line",
        "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "temperature", "type": "quantitative"}
        }
    };
    return chartData;
}

// Hauptfunktion zum Ausführen des Programms
async function main() {
    try {
        // Wetterdaten abrufen
        const weatherData = await fetchWeatherData();

        // Daten für das Diagramm vorbereiten
        const chartSpec = prepareChartData(weatherData);

        // Vega-Spezifikation kompilieren
        const chart = compile(chartSpec).spec;

        // Vega-Diagramm anzeigen oder in eine Datei schreiben
        // Hier kann der Code je nach Bedarf angepasst werden
        console.log(chart);
    } catch (error) {
        console.error('Fehler beim Abrufen oder Verarbeiten der Daten:', error);
    }
}

// Programm ausführen
main();

