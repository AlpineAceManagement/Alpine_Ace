import requests
import geopandas as gpd
# ... other imports

api_zone = f"https://aws.slf.ch/api/bulletin/caaml/DE/geojson"
api_bulletins = "https://aws.slf.ch/api/bulletin/caaml/de/json"

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

    # Create the GeoDataFrame
    gdf = gpd.GeoDataFrame(regions)
    print(regions)

