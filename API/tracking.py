# Import relevants libraries
import requests
import json
import time
import gpxpy
import gpxpy.gpx
import gpsd


# location over IP-Adress
def get_location_data():
    # Get external IP address
    try:
        response = requests.get("https://api.ipify.org?format=json")
        response.raise_for_status() 
        ip_address = response.json()["ip"]
    except requests.exceptions.RequestException as e:
        print(f"Error getting IP address: {e}")
        return None  # Return None on error

    # Get location data from IP address
    try:
        geo_url = f"http://ip-api.com/json/{ip_address}"
        response = requests.get(geo_url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting geolocation data: {e}")
        return None  # Return None on error
    
# location over GPS
def get_gps_data():
    try:
        gpsd.connect() 
        packet = gpsd.get_current()
        if packet.mode >= 2:  # 2D or 3D fix
            return {
                "latitude": packet.lat,
                "longitude": packet.lon 
            }
        else:
            return None
    except Exception as e:
        print(f"Error getting GPS data: {e}")
        return None





# main loop for tracking
if __name__ == "__main__":
    while True:
        geo_data = get_gps_data()

        if geo_data:
            # Store location data in the JSON file (append mode)
            with open("location.json", "a") as outfile:
                json.dump(geo_data, outfile)
                outfile.write("\n")  # Add a newline for separation
            print("Location data appended to 'location.json'")

        time.sleep(1)  # Check every second
