'''import relevant libraries'''
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import time
import schedule
import os
import psycopg2
import datetime
from datetime import timezone
import numpy as np
import logging
import config

# Configure logging
logging.basicConfig(filename="weather_data_updates.log",
                    level=logging.INFO,
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 15*60)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://api.open-meteo.com/v1/forecast"
params = {
	"latitude": 46.72,
	"longitude": 9.55,
	"current": ["temperature_2m", "precipitation", "weather_code", "surface_pressure", "wind_speed_10m", "wind_direction_10m"],
	"hourly": ["temperature_2m",  "precipitation_probability", "precipitation","weather_code", "cloud_cover","surface_pressure",  "wind_speed_10m", "wind_direction_10m"],
	"forecast_days": 3
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")


weather_codes = {
    0:"sonnig",
    1:"bewölkt",
    2:"bewölkt",
    3:"bewölkt",
    45:"bewölkt",
    48:"bewölkt",
    51:"regnerisch",
    53:"regnerisch",
    55:"regnerisch",
    61:"regnerisch",
    63:"regnerisch",
    65:"regnerisch",
    66:"regnerisch",
    67:"regnerisch",
    71:"schneereich",
    73:"schneereich", 
    75:"schneereich",
    77:"schneereich",
    80:"regnerisch",
    81:"regnerisch",
    82:"regnerisch",
    85:"schneereich",
    86:"schneereich",
    95:"gewitter",
    96:"gewitter",
    99:"gewitter"
    }
def convert_wind_direction(degrees):
    directions = ["Nord", "Nord-Ost", "Ost", "Sued-Ost", "Sued", "Sued-West", "West", "Nord-West"]  # Adjust if needed 
    sections = len(directions)
    section_size = 360 / sections

    index = int((degrees + section_size / 2) / section_size)  
    return directions[index % sections]



def save_current_weather():
    # Current values. The order of variables needs to be the same as requested.
    current = response.Current()
    current_temperature_2m = current.Variables(0).Value()
    current_precipitation = current.Variables(1).Value()
    current_weather_code = current.Variables(2).Value()
    current_surface_pressure = current.Variables(3).Value()
    current_wind_speed_10m = current.Variables(4).Value()
    current_wind_direction_10m = current.Variables(5).Value()

  
    current_weather_description = weather_codes.get(current_weather_code, "unknown")
    current_wind_direction_description = convert_wind_direction(current_wind_direction_10m)

    current_time = current_time = datetime.datetime.fromtimestamp(current.Time(), tz=timezone.utc)
    current_data ={
        "md_timestamp": current_time,
        "md_temperatur": current_temperature_2m,
        "md_niederschlag": current_precipitation,
        "md_wetter": current_weather_description,
        "md_druck": current_surface_pressure,
        "md_windgeschwindigkeit": current_wind_speed_10m,
        "md_windrichtung": current_wind_direction_description
    }

    station_id= "ROT3"
    
    try:
        # Connect to the database

        # conn = psycopg2.connect(
        #     dbname= "AlpineACE",    # DB Name
        #     user= "postgres",       # Username
        #     password= "TeamLH44",   # Password
        #     host= "localhost",      # Host adress
        #     port="5432"             # Port number
        # )
        conn = psycopg2.connect(**config.db_config)
        # Create a cursor object
        cur = conn.cursor()

        

        # Insert the current weather data into the table
        cur.execute(
            "Insert INTO messdaten (md_timestamp, md_temperatur, md_niederschlag, md_wetter, md_druck, md_windgeschwindigkeit, md_windrichtung, station_id)VALUES(%s, %s, %s, %s, %s, %s,%s,%s)",
            (
                current_data["md_timestamp"],
                current_data["md_temperatur"],
                current_data["md_niederschlag"],
                current_data["md_wetter"],
                current_data["md_druck"],
                current_data["md_windgeschwindigkeit"],
                current_data["md_windrichtung"],
                station_id

            )
        )   
        # Commit the changes and close the
        conn.commit()
        cur.close()
        conn.close()

        logging.info("Current weather data saved to database")
    except psycopg2.Error as e:
        logging.error(f"Database error while saving current weather: {e}")


# Process hourly data. The order of variables needs to be the same as requested.

def save_hourly_forecast():

    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_precipitation_probability = hourly.Variables(1).ValuesAsNumpy()
    hourly_precipitation =  hourly.Variables(2).ValuesAsNumpy()
    hourly_weather_code = hourly.Variables(3).ValuesAsNumpy()
    hourly_cloud_cover = hourly.Variables(4).ValuesAsNumpy()
    hourly_surface_pressure = hourly.Variables(5).ValuesAsNumpy()
    hourly_wind_speed_10m = hourly.Variables(6).ValuesAsNumpy()
    hourly_wind_direction_10m = hourly.Variables(7).ValuesAsNumpy()
    hourly_wind_direction_description = convert_wind_direction(np.mean(hourly_wind_direction_10m))

    station_id = "ROT3"

    hourly_data = {"pg_datum": pd.date_range(
	    start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
	    end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
	    freq = pd.Timedelta(seconds = hourly.Interval()),
	    inclusive = "left"
    )}
    hourly_data["pg_wetter"] = hourly_weather_code
    hourly_data["pg_windgeschwindigkeit"] = hourly_wind_speed_10m
    hourly_data["pg_windrichtung"] = hourly_wind_direction_description
    hourly_data["pg_niederschlag"] = hourly_precipitation
    hourly_data["pg_niederschlagswahrscheinlichkeit"] = hourly_precipitation_probability
    hourly_data["pg_druck"]= hourly_surface_pressure
    hourly_data["pg_temperatur"] = hourly_temperature_2m
    hourly_data["pg_cloud_cover"] = hourly_cloud_cover
    hourly_data["station_id"] = station_id
    
    # Convert the weather code to a pandas Series
    hourly_data["pg_wetter"] = pd.Series(hourly_data["pg_wetter"])
    # Convert the weather code to a string using the weather_code_map
    hourly_data["pg_wetter"] = hourly_data["pg_wetter"].map(weather_codes)

    

    try:
        # Connect to database
        conn = psycopg2.connect(**config.db_config)

        # Create a cursor object
        cur = conn.cursor()

        # Clear existing data from the table
        cur.execute("TRUNCATE TABLE prognose")

        # Create a temporary DataFrame for efficient insertion
        df = pd.DataFrame(hourly_data)
        # Ausgabe der Daten in eine CSV-Datei, falls gewünscht
        #df.to_csv('hourly_forecast.csv', mode='w', header=not os.path.exists('hourly_forecast.csv'))

        # Use executemany with tuples for efficiency:
        tuples_list = [tuple(x) for x in df.to_numpy()]
        # Insert the hourly forecast data into the table
        cur.executemany(
            "INSERT INTO prognose (pg_datum,pg_wetter, pg_windgeschwindigkeit, pg_windrichtung,pg_niederschlag, pg_niederschlagswahrscheinlichkeit, pg_druck,  pg_temperatur,pg_cloud_cover, station_id ) VALUES ( %s,%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            tuples_list
        )

        # Commit the transaction
        conn.commit()

        # Close the cursor and the connection
        cur.close()
        conn.close()
        logging.info("Hourly forecast data saved to database.")
    except psycopg2.Error as e:
        logging.error(f"Database error while saving hourly forecast: {e}")


save_current_weather()
save_hourly_forecast()

# Schedule updates every 15 minutes
schedule.every(15).minutes.do(save_current_weather)
schedule.every().day.at("00:00").do(save_hourly_forecast)

while True:
    schedule.run_pending()
    time.sleep(60)