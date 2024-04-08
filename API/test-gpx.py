'''import relevant libraries'''
import os
import xml.etree.ElementTree as ET
import logging
from math import sqrt
import psycopg2
from pyproj import Transformer, CRS
from datetime import datetime
from shapely.geometry import LineString

# Logging + configuration

gpx_directory = "GPX_files"
logging.basicConfig(filename="gpx_import.log", level=logging.INFO)

db_config = {
    "host": "localhost",        #Hostname or IP-Adress
    "port": 5432,               #Portnumber
    "database": "AlpineACE",    #DB Name
    "user": "postgres",         #Username
    "password": "TeamLH44"      #Password
}

wgs84_crs = CRS.from_epsg(4326)   #WGS84 Coordinate Reference System (CRS)
lv95_crs = CRS.from_epsg(2056)    #Swiss LV95 / CH1903+ 
transformer = Transformer.from_crs(wgs84_crs, lv95_crs)     #Transformer Object to convert from WGS84 to LV95/CH1903+


# Namespace

ns = {"gpx": "http://www.topografix.com/GPX/1/1"}

# Distanz Calculation

def dist_3d(lv95_north1, lv95_east1, ele1,lv95_north2, lv95_east2, ele2):
    dx = lv95_east2-lv95_east1
    dy = lv95_north2-lv95_north1
    dz = ele2 - ele1

    return sqrt(dx**2+dy**2+dz**2)

# import gpx-file

def import_gpx(path, transformer):
    # laod gpx-file
    baum = ET.parse(path)
    wurzel = baum.getroot()

    # extraction metadata
    metadata = wurzel.find('.//gpx:metadata', ns)
    name = metadata.find('gpx:name', ns).text
    beschreibung = metadata.find('gpx:desc', ns).text

    # Initialize variables to calculate summary statistics

    max_speed = float('-inf')
    duration = 0
    total_speed = 0
    anzahl_punkte = 0
    total_distance = 0
    elevation = 0

    coordinates = []

    # run trouhgh tour points
    streckenpunkte = wurzel.findall('.//gpx:trkpt', ns)
    for i in range(len(streckenpunkte)-1):
        lat1 = float(streckenpunkte[i].attrib["lat"])
        lon1 = float(streckenpunkte[i].attrib["lon"])
        lat2 = float(streckenpunkte[i+1].attrib["lat"])
        lon2 = float(streckenpunkte[i+1].attrib["lon"])
        ele1 = float(streckenpunkte[i].find("gpx:ele", ns).text)
        ele2 = float(streckenpunkte[i+1].find("gpx:ele", ns).text)

        # Transformation in LV95
        lv95_north1 = transformer.transform(lat1)
        lv95_east1 = transformer.transform(lon1)
        lv95_north2 = transformer.transform(lat2)
        lv95_east2 = transformer.transform(lon2)

        # collect coordinates for line String
        coordinates.append((lv95_east1, lv95_north1))

        # distance calculation

        distance = dist_3d(lv95_north1, lv95_east1,ele1, lv95_north2, lv95_east2, ele2)

        # hight calculation

        delta_h = ele2-ele1

        # delta time calculation

        time1 = datetime.strptime(streckenpunkte[i].find("gpx:time", ns).text, "%Y-%m-%dT%H:%M:%S")
        time2 = datetime.strptime(streckenpunkte[i+1].find("gpx:time", ns).text, "%Y-%m-%dT%H:%M:%S")
        delta_time = (time2 - time1).total_seconds()

        # speed calculation

        if delta_time != 0:
            speed = (distance/delta_time) *3.6
        else:
            speed= 0
        
        if speed >  max_speed:
            max_speed = speed

        # calcualtion duration
        
        duration += delta_time

        duration_s = int(duration // 3600)
        duration_m = int((duration%3600) //60)
        duration_h = int(duration%60)

        duration_tot = "{:02d}:{:02d}:{:02d}".format(duration_h, duration_m, duration_s)

        # calculation totalspeed

        total_speed += speed
        anzahl_punkte +=1

        avarage_speed = total_speed/anzahl_punkte

        # calculation elevation
        if (delta_h) < 10:
            elevation += delta_h
        
        # calculation total distance
            
        total_distance += (distance / 1000)

        # extract geometries from  GPX-file and convert PostgreSQL-Format
        line = LineString(coordinates)

        # DB connection
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()

        sql = """
          INSERT INTO your_tracks_table (name, description, duration, max_speed, average_speed, 
                                        elevation, total_distance, geometry)
          VALUES (%s, %s, %s, %s, %s, %s, %s, ST_GeomFromText(%s, 2056)) 
          """

        values = (name, beschreibung, duration_tot, max_speed, avarage_speed, 
                  elevation, total_distance, line.wkt)

        try:
            cur.execute(sql, values)
            conn.commit()
        except (Exception, psycopg2.DatabaseError) as e: 
            logging.error(e)
            conn.rollback()


# main loop for dataprocessing

if __name__ == "__main__":
    for filename in os.listdir(gpx_directory):
        if filename.endswith(".gpx"):
            path = os.path.join(gpx_directory,filename)
            try:
                import_gpx(path,transformer)
                logging.info("GPX-File processed: %s", path)
            except Exception as e:
                logging.error("Error at processing from %s: %s", path, e)
