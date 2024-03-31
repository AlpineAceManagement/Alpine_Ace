'''import libraries'''
import requests
import psycopg2
import json
import time

# Database credentials
db_config = {
    'host': 'localhost',
    'database': 'AlpineACE',
    'user': 'postgres',
    'password': 'TeamLH44'
}

def fetch_and_store_measurements(station_code):
    api_url = f"https://measurement-api.slf.ch/public/api/imis/station/{station_code}/measurements"

    response = requests.get(api_url)
    response.raise_for_status()

    data = response.json()
    # Extract the newest measurement
    newest_measurement = data[46]  # Zero-based indexing

    with psycopg2.connect(**db_config) as conn:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO schneehoehe (station_code, sh_zeit, sh_hoehe)
                VALUES (%s, %s, %s)
            """
            values = (
                newest_measurement['station_code'], 
                newest_measurement['measure_date'], 
                newest_measurement['HS'],
            )
            cursor.execute(sql, values)

if __name__ == '__main__':
    station_code = "ROT3"    

    while True:
        fetch_and_store_measurements(station_code) 
        time.sleep(60 * 60)  # Sleep for 30 minutes 