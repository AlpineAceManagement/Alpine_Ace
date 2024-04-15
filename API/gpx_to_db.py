import xml.etree.ElementTree as ET
import csv
from datetime import datetime
from math import sqrt, cos, pi
import psycopg2 # pip install psycopg2 oder pip install psycopg2-binary
import config    

# Namensraum
ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}

# Funktion zur Berechnung des 3D-Abstands zwischen zwei Punkten
def entfernung_3d(lat1_m, lon1_m, ele1, lat2_m, lon2_m, ele2):
    dx = lon2_m - lon1_m
    dy = lat2_m - lat1_m
    dz = ele2 - ele1

    return sqrt(dx**2 + dy**2 + dz**2)

# Laden der GPX-Datei
path = 'GPX_files/15'
baum = ET.parse(path+'.gpx')
wurzel = baum.getroot()

# Öffnen einer CSV-Datei zum Schreiben der Ergebnisse
with open(path+'.csv', 'w', newline='') as csvfile:
    feldnamen = ['Entfernung [m]', 'Höhenunterschied [m]', 'Zeit [s]', 'Geschwindigkeit [m/s]', 'Geschwindigkeit [km/h]']
    schreiber = csv.DictWriter(csvfile, fieldnames=feldnamen)
    schreiber.writeheader()

    # Initialisierung der maximalen Geschwindigkeit, der Gesamtzeit und der Gesamtgeschwindigkeit
    max_geschwindigkeit = float('-inf')
    gesamtzeit = 0
    gesamtgeschwindigkeit_kmh = 0
    anzahl_punkte = 0
    gesamtdistanz_m = 0
    hoehenmeter = 0

    # Durchlaufen der Streckenpunkte
    streckenpunkte = wurzel.findall('.//gpx:trkpt', ns)
    for i in range(len(streckenpunkte) - 1):
        # Extrahieren der Informationen der Punkte
        lat1_grad = float(streckenpunkte[i].attrib['lat'])
        lon1_grad = float(streckenpunkte[i].attrib['lon'])
        lat2_grad = float(streckenpunkte[i + 1].attrib['lat'])
        lon2_grad = float(streckenpunkte[i + 1].attrib['lon'])
        ele1 = float(streckenpunkte[i].find('gpx:ele', ns).text)
        ele2 = float(streckenpunkte[i + 1].find('gpx:ele', ns).text)

        # Umrechnen der Gradkoordinaten in Meter
        lat1_m = lat1_grad * 111319.9
        lon1_m = lon1_grad * 111319.9 * cos(lat1_grad * pi / 180)
        lat2_m = lat2_grad * 111319.9
        lon2_m = lon2_grad * 111319.9 * cos(lat2_grad * pi / 180)

        # Berechnen der 3D-Entfernung
        distance = entfernung_3d(lat1_m, lon1_m, ele1, lat2_m, lon2_m, ele2)

        # Berechnen des Höhenunterschieds
        hoehenunterschied = ele2 - ele1

        # Berechnen des Zeitunterschieds
        zeit1 = datetime.strptime(streckenpunkte[i].find('gpx:time', ns).text, '%Y-%m-%dT%H:%M:%SZ')
        zeit2 = datetime.strptime(streckenpunkte[i + 1].find('gpx:time', ns).text, '%Y-%m-%dT%H:%M:%SZ')
        zeitunterschied = (zeit2 - zeit1).total_seconds()

        # Berechnen der Geschwindigkeit in m/s
        if zeitunterschied != 0:
            geschwindigkeit_mps = distance / zeitunterschied
        else:
            geschwindigkeit_mps = 0

        # Umrechnen der Geschwindigkeit in km/h
        geschwindigkeit_kmh = geschwindigkeit_mps * 3.6

        # Aktualisieren der maximalen Geschwindigkeit
        if geschwindigkeit_kmh > max_geschwindigkeit:
            max_geschwindigkeit = geschwindigkeit_kmh

        # Hinzufügen der Zeit zur Gesamtzeit
        gesamtzeit += zeitunterschied

        # Hinzufügen der Geschwindigkeit zur Gesamtgeschwindigkeit
        gesamtgeschwindigkeit_kmh += geschwindigkeit_kmh
        anzahl_punkte += 1

        # Hinzufügen des Höhenunterschieds zur Gesamtsumme, wenn er kleiner als 10 Meter ist
        if (hoehenunterschied) < 10:
            hoehenmeter += hoehenunterschied

        gesamtdistanz_m += distance
        gesamtdistanz = gesamtdistanz_m/1000

        # Schreiben der Ergebnisse in die CSV-Datei mit Gleitkommazahlen
        schreiber.writerow({'Entfernung [m]': "{:.6f}".format(distance), 
                         'Höhenunterschied [m]': "{:.6f}".format(hoehenunterschied), 
                         'Zeit [s]': "{:.6f}".format(zeitunterschied),
                         'Geschwindigkeit [m/s]': "{:.6f}".format(geschwindigkeit_mps),
                         'Geschwindigkeit [km/h]': "{:.6f}".format(geschwindigkeit_kmh)})

# Umwandeln der Gesamtzeit in Stunden, Minuten und Sekunden
gesamtstunden = int(gesamtzeit // 3600)
gesamtminuten = int((gesamtzeit % 3600) // 60)
gesamtsekunden = int(gesamtzeit % 60)

# Formatiere die Gesamtzeit
gesamtzeit_formatted = "{:02d}:{:02d}:{:02d}".format(gesamtstunden, gesamtminuten, gesamtsekunden)

print("Gesamte Höhenmeter: {:.2f} m".format(abs(hoehenmeter)))
print("Gesamtdistanz: {:.2f} km".format(gesamtdistanz))
print("Gesamtzeit:", gesamtzeit_formatted)
print("Durchschnittsgeschwindigkeit: {:.2f} km/h".format(gesamtgeschwindigkeit_kmh / anzahl_punkte))
print("Maximale Geschwindigkeit: {:.2f} km/h".format(max_geschwindigkeit))

# Verbindung zur PostgreSQL-Datenbank herstellen
conn = psycopg2.connect(**config.db_config)

# Cursor erstellen
cur = conn.cursor()

# Extrahiere Geometriedaten aus der GPX-Datei und konvertiere sie in das PostgreSQL-Format
geometrie = wurzel.find('.//gpx:trkseg', ns)
geometrie_text = "LINESTRING("
for punkt in geometrie.findall('.//gpx:trkpt', ns):
    lon = float(punkt.attrib['lon'])
    lat = float(punkt.attrib['lat'])
    geometrie_text += "{} {}, ".format(lon, lat)
geometrie_text = geometrie_text[:-2] + ")"  # Entferne das letzte Komma und schließe den WKT

# Füge die Geometriedaten in die Datenbank ein
insert_query = '''
    INSERT INTO Skidaten (sd_hoehenmeter, sd_distanz, sd_dauer, sd_geschwindigkeit, sd_maxgeschwindigkeit, sd_geometrie)
    VALUES (%s, %s, %s, %s, %s, ST_GeomFromText(%s));
'''

cur.execute(insert_query, (abs(hoehenmeter), gesamtdistanz, gesamtzeit_formatted, gesamtgeschwindigkeit_kmh / anzahl_punkte, max_geschwindigkeit, geometrie_text))
conn.commit()

# Verbindung schließen
cur.close()
conn.close()

print("\n")
print("Daten erfolgreich in die Tabelle 'Skidaten' der PostgreSQL-Datenbank eingefügt.")
