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
    data_bulletin = response_bulletin.json()
    bulletins = data_bulletin["bulletins"]
