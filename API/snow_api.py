'''import relevant libraries'''
import requests
import psycopg2
import json
import time
import logging
import csv
import config
import schedule


# Extrac Station from statio_daten.csv

def extract_station(csv_file):
    station = []
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            station.append(row[0])
    return station

csv_file = "DB_PG\station_daten.csv"
station = extract_station(csv_file)

# Configure logging
logging.basicConfig(filename="snow_measuremnts.log",
                    level=logging.INFO,
                    format="%(asctime)s - %(levelname)s - %(message)s")

#  Connect to the database
def fetch_and_store_measurement(station_code):
    api_url = f"https://measurement-api.slf.ch/public/api/imis/station/{station_code}/measurements"
    try:
        response = requests.get(api_url)
        response.raise_for_status()

        data = response.json()  
        item= len(data)
        # Extract the last measurement
        last_measurement = data[item -1]  # Zero-based indexing

        with psycopg2.connect(**config.db_config) as conn:
            with conn.cursor() as cursor:
                sql = """
                    INSERT INTO schneehoehe (sh_zeit, sh_hoehe, station_id)
                    VALUES (%s, %s, %s)
                """
                values = (
                    last_measurement['measure_date'], 
                    last_measurement['HS'], 
                    last_measurement['station_code']
                )
                cursor.execute(sql, values)
        logging.info(f"Measurement fetched and stored for station: {station_code}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error for station {station_code}: {e}")
    except psycopg2.Error as e:
        logging.error(f"Database error for station {station_code}: {e}")




if __name__ == '__main__':
    station_codes = station 
    
    while True:
        for station_code in station_codes:
            fetch_and_store_measurement(station_code)
        time.sleep(30 * 60)  # Sleep for 30 minutes 
