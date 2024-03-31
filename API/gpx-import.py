import psycopg2
import gpxpy
import gpxpy.gpx
import datetime

def import_gpx_to_postgres(gpx_file_path, db_config):
    """
    Imports GPX data into a PostgreSQL database with PostGIS extension.

    Args:
        gpx_file_path (str): Path to the GPX file.
        db_config (dict): Dictionary containing database connection details:
                        - host
                        - database
                        - user
                        - password
    """

    try:
        # Connect to the PostgreSQL database
        with psycopg2.connect(**db_config) as conn:
            with conn.cursor() as cur:

                # Open the GPX file
                gpx_file = open(gpx_file_path, 'r')
                gpx = gpxpy.parse(gpx_file)

                # Extract relevant data from GPX
                elevation_gain = sum(p.elevation for p in gpx.tracks[0].segments[0].points)
                distance = gpx.get_moving_data().moving_distance # Assumes single track
                km_distance = distance/1000
                duration = gpx.get_moving_data().moving_time
                time_duration = datetime.timedelta(seconds=duration)
                
                average_speed = distance / duration if duration else 0.0 
                average_speed_km = 3.6*average_speed if average_speed else 0.0
                #max_speed = gpx.get_()

                # Assuming you have 'username' and 'skigebiet_id' from elsewhere
                username = 'your_username'
                skigebiet_id = 123  

                # Construct the geometry (replace with appropriate calculation)
                track_geometry = 'ST_MakeLine(ARRAY[{}])'.format(
                    ','.join(['ST_MakePoint({}, {})'.format(p.longitude, p.latitude) 
                              for p in gpx.tracks[0].segments[0].points])
                )

                # Insert data into the database
                cur.execute(
                    """
                    INSERT INTO Skidaten (
                        SD_Hoehenmeter, SD_Distanz, SD_Dauer, SD_Geschwindigkeit
                    ) VALUES (
                        %s, %s, %s, %s
                    )
                    """,
                    (elevation_gain, km_distance, time_duration, average_speed_km,  
                )
                )
                conn.commit()

                print("GPX data imported successfully!")

    except (Exception, psycopg2.Error) as error:
        print("Error:", error)


# Example usage:
db_config = {
    'host': 'localhost',
    'database': 'AlpineACE',
    'user': 'postgres',
    'password': 'TeamLH44'
}
gpx_file_path = 'Morning_Alpine_Ski.gpx'

import_gpx_to_postgres(gpx_file_path, db_config) 
