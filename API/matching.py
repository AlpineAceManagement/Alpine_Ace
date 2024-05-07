import pandas as pd
from shapely.geometry import Point, LineString

def match_gps_to_polyline(gps_data, polyline, threshold_distance):
    """Matches GPS data points to a given polyline within a threshold distance.

    Args:
        gps_data (list): A list of GPS coordinates in the format [(latitude, longitude), ...]
        polyline (LineString): A Shapely LineString object representing the polyline.
        threshold_distance (float): The maximum distance for a GPS point to be considered matched.

    Returns:
        pandas.DataFrame: A DataFrame containing the following columns:
            * latitude: The latitude of the GPS point.
            * longitude: The longitude of the GPS point.
            * matched: True if the point is within the threshold distance, False otherwise.
            * distance_to_polyline: The distance from the GPS point to the polyline.
    """

    results = []
    for lat, lon in gps_data:
        point = Point(lon, lat)
        distance = point.distance(polyline)

        results.append({
            'latitude': lat,
            'longitude': lon,
            'matched': distance <= threshold_distance,
            'distance_to_polyline': distance
        })

    return pd.DataFrame(results)

# ----- Example Usage -----

# Sample GPS coordinates
gps_data = [
    (46.8234, -71.2543),
    (46.8198, -71.2409),
    (46.8150, -71.2301)
]

# Sample Polyline coordinates
polyline_coords = [
    (46.8250, -71.2580),
    (46.8201, -71.2455),
    (46.8123, -71.2280)
]
polyline = LineString(polyline_coords)

# Set a distance threshold (adjust as needed)
threshold_distance = 0.002  # Approximately 200 meters

# Perform the matching
matched_data = match_gps_to_polyline(gps_data, polyline, threshold_distance)
print(matched_data)
