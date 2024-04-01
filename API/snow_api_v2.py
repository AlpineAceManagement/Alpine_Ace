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

def fetch_and_store_measurement(station_code):
    api_url = f"https://measurement-api.slf.ch/public/api/imis/station/{station_code}/measurements"

    response = requests.get(api_url)
    response.raise_for_status()

    data = response.json()  
    item= len(data)
    # Extract the second measurement
    second_measurement = data[item -1]  # Zero-based indexing

    with psycopg2.connect(**db_config) as conn:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO schneehoehe (station_code, sh_zeit, sh_hoehe)
                VALUES (%s, %s, %s)
            """
            values = (
                second_measurement['station_code'], 
                second_measurement['measure_date'], 
                second_measurement['HS']
            )
            cursor.execute(sql, values)

if __name__ == '__main__':
    station_codes = ["ROT3", "CMA2", "GOS3"] 
     

    while True:
        for station_code in station_codes:
            fetch_and_store_measurement(station_code)
        time.sleep(30 * 60)  # Sleep for 30 minutes 