'''import relevant libraries'''

import requests
import psycopg2
import time
import logging
import csv
import config

# Request to API

api_zone = f"https://aws.slf.ch/api/bulletin/caaml/DE/geojson"
api_bulletins = "https://aws.slf.ch/api/bulletin/caaml/de/json"


# Get regions from API Zone

response = requests.get(api_zone)
if response.status_code == 200:
    data = response.json()
    features = data["features"]

    regions = []

    for feature in features:
        if "properties" in feature and "regions" in feature["properties"]:
            regions_array = feature["properties"]["regions"]
            if len(regions_array) > 0: 
                region_id = regions_array[0]["regionID"]
                geometry = feature["geometry"]
                regions.append({'region_id': region_id, 'geometry': geometry})
else:
    print("error:", response.status_code)

# Get bulletins from API Bulletins

response_bulletin = requests.get(api_bulletins)
if response_bulletin.status_code == 200:
    data = response_bulletin.json()
    # Extract bulletins data
bulletins = data['bulletins']

# Process each bulletin
for bulletin in bulletins:
    regions = bulletin['regions']
    danger_ratings = bulletin['dangerRatings']

    # Only proceed if there are regions in this bulletin
    if regions:
        first_region = regions[0]  # Get the first region
        print(f"\nRegion: {first_region}")

        for rating in danger_ratings:
            main_value = rating['mainValue']
            subdivision = rating['customData'].get('CH', {}).get('subdivision')

            print(f"  - Danger Rating: {main_value}")
            if subdivision:
                print(f"      - Subdivision: {subdivision}")
