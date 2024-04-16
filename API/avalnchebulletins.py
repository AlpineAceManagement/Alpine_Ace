'''import relevant libraries'''

import requests
import psycopg2
import time
import logging
import csv
import config
import schedule
import os
import json


# Configure logging
logging.basicConfig(filename='avalanche_bulletin_script.log', 
                    level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Request to API

api_zone = f"https://aws.slf.ch/api/bulletin/caaml/DE/geojson"
api_bulletins = "https://aws.slf.ch/api/bulletin/caaml/de/json"


# Get regions from API Zone

def get_regions():
    """Fetches region data from the API zone endpoint"""

    regions = []

    response = requests.get(api_zone)
    if response.status_code == 200:
        data = response.json()
        features = data["features"]

        for feature in features:
            if "properties" in feature and "regions" in feature["properties"]:
                regions_array = feature["properties"]["regions"]
                if len(regions_array) > 0:
                    region_id = regions_array[0]["regionID"]
                    geometry = feature["geometry"]
                    regions.append({'region_id': region_id, 'geometry': geometry})
    else:
        logging.error(f"Error fetching regions: {response.status_code}")
    return regions

def store_geometries(region):
    try:
        # Connect to the database
        conn = psycopg2.connect(**config.db_config)
        cursor = conn.cursor()
        # Convert geometry dictionary to GeoJSON string
        geometry_json = json.dumps(region["geometry"])

        cursor.execute(
            '''INSERT INTO BULLETINS (B_GEOMETRIE)
                VALUES (ST_GeomFromGeoJSON(%s))''',
                (geometry_json,)
        )

        conn.commit()
    except (Exception, psycopg2.Error) as error:
        logging.error(f"Error storing geometries: {error}")
    finally:
        if conn:
            cursor.close()
            conn.close()

regions = get_regions()
print(regions)

for region in regions:
    store_geometries(region)


# # Get bulletins from API Bulletins

# def get_and_process_bulletins():
#     """Fetches bulletin data and stores it in the database."""

#     response_bulletin = requests.get(api_bulletins)
#     if response_bulletin.status_code == 200:
#         data = response_bulletin.json()
#         bulletins = data['bulletins']

#         for bulletin in bulletins:
#             regions = bulletin['regions']
#             danger_ratings = bulletin['dangerRatings']

#             if regions:
#                 first_region = regions[0]
#                 logging.info(f"Processing bulletin for region: {first_region}")

#                 for rating in danger_ratings:
#                     main_value = rating['mainValue']
#                     subdivision = rating['customData'].get('CH', {}).get('subdivision')

#                     print(f" - Danger Rating: {main_value}")
#                     if subdivision:
#                         print(f"   - Subdivision: {subdivision}")

#                     try:
#                         with psycopg2.connect(**config.db_config) as conn:
#                             with conn.cursor() as cur:
#                                 cur.execute(
#                                     """
#                                     INSERT INTO avalanche_data (B_Danger)
#                                     VALUES (%s)
#                                     """,
#                                     (main_value)
#                                 )
#                     except (Exception, psycopg2.DatabaseError) as error:
#                         logging.error(f"Error inserting data into database: {error}")

#     else:
#         logging.error(f"Error fetching bulletins: {response_bulletin.status_code}")



# def perform_api_request_and_update():
#     """Encapsulates the entire API request and update process."""

#     regions = get_regions()  # Fetch region data if needed (you might do this less often)
#     get_and_process_bulletins()


# if __name__ == "__main__":
#     logging.info("Starting avalanche bulletin script")

#     while True:
#         perform_api_request_and_update()
#         logging.info("API request completed. Sleeping for 12 hours")
#         time.sleep(12 )#* 60 * 60)  # Sleep for 12 hours 