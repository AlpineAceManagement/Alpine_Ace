import xml.etree.ElementTree as ET
import csv
from datetime import datetime
from math import sqrt, cos, pi
import psycopg2
import config
from pyproj import Transformer
import os

# Namespace
ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}

# Fonction pour calculer la distance 3D entre deux points
def entfernung_3d(lat1_m, lon1_m, ele1, lat2_m, lon2_m, ele2):
    dx = lon2_m - lon1_m
    dy = lat2_m - lat1_m
    dz = ele2 - ele1

    return sqrt(dx**2 + dy**2 + dz**2)

# Fonction pour déterminer la saison en fonction de la date
def get_season(date):
    month = date.month
    if month >= 11:
        return "{}/{}".format(date.year, date.year + 1)
    elif month <= 4:
        return "{}/{}".format(date.year - 1, date.year)

# Charger le fichier GPX
path = 'GPX_files/1' #--------------------------------------------------
baum = ET.parse(path+'.gpx')
wurzel = baum.getroot()

# Initialiser la vitesse maximale, le temps total et la vitesse totale
max_geschwindigkeit = float('-inf')
gesamtzeit = 0
gesamtgeschwindigkeit_kmh = 0
anzahl_punkte = 0
gesamtdistanz_m = 0
hoehenmeter = 0

# Parcourir les points de la piste
streckenpunkte = wurzel.findall('.//gpx:trkpt', ns)
zeit1 = datetime.strptime(streckenpunkte[0].find('gpx:time', ns).text, '%Y-%m-%dT%H:%M:%SZ')

with open(path+'.csv', 'w', newline='') as csvfile:
    fieldnames = ['Date', 'Entfernung [m]', 'Höhenunterschied [m]', 'Zeit [s]', 'Geschwindigkeit [m/s]', 'Geschwindigkeit [km/h]', 'Saison']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for i in range(len(streckenpunkte) - 1):
        # Extraire les informations des points
        lat1_grad = float(streckenpunkte[i].attrib['lat'])
        lon1_grad = float(streckenpunkte[i].attrib['lon'])
        lat2_grad = float(streckenpunkte[i + 1].attrib['lat'])
        lon2_grad = float(streckenpunkte[i + 1].attrib['lon'])
        ele1 = float(streckenpunkte[i].find('gpx:ele', ns).text)
        ele2 = float(streckenpunkte[i + 1].find('gpx:ele', ns).text)

        # Convertir les coordonnées degrés en mètres
        lat1_m = lat1_grad * 111319.9
        lon1_m = lon1_grad * 111319.9 * cos(lat1_grad * pi / 180)
        lat2_m = lat2_grad * 111319.9
        lon2_m = lon2_grad * 111319.9 * cos(lat2_grad * pi / 180)

        # Calculer la distance 3D
        distance = entfernung_3d(lat1_m, lon1_m, ele1, lat2_m, lon2_m, ele2)

        # Calculer la différence d'altitude
        hoehenunterschied = ele2 - ele1

        # Calculer la différence de temps
        zeit2 = datetime.strptime(streckenpunkte[i + 1].find('gpx:time', ns).text, '%Y-%m-%dT%H:%M:%SZ')
        zeitunterschied = (zeit2 - zeit1).total_seconds()

        # Calculer la vitesse en m/s
        if zeitunterschied != 0:
            geschwindigkeit_mps = distance / zeitunterschied
        else:
            geschwindigkeit_mps = 0

        # Convertir la vitesse en km/h
        geschwindigkeit_kmh = geschwindigkeit_mps * 3.6

        # Mettre à jour la vitesse maximale
        if geschwindigkeit_kmh > max_geschwindigkeit:
            max_geschwindigkeit = geschwindigkeit_kmh

        # Ajouter le temps au temps total
        gesamtzeit += zeitunterschied

        # Ajouter la vitesse à la vitesse totale
        gesamtgeschwindigkeit_kmh += geschwindigkeit_kmh
        anzahl_punkte += 1

        # Ajouter la différence d'altitude à la somme totale si elle est inférieure à 10 mètres
        if hoehenunterschied < 10:
            hoehenmeter += hoehenunterschied

        gesamtdistanz_m += distance
        gesamtdistanz = gesamtdistanz_m / 1000

        # Écrire les résultats dans le fichier CSV avec des nombres à virgule flottante
        writer.writerow({'Date': zeit1.strftime("%Y-%m-%d"), 
                         'Entfernung [m]': "{:.6f}".format(distance), 
                         'Höhenunterschied [m]': "{:.6f}".format(hoehenunterschied), 
                         'Zeit [s]': "{:.6f}".format(zeitunterschied),
                         'Geschwindigkeit [m/s]': "{:.6f}".format(geschwindigkeit_mps),
                         'Geschwindigkeit [km/h]': "{:.6f}".format(geschwindigkeit_kmh),
                         'Saison': get_season(zeit1)})  # Ajout de la saison dans le CSV

        # Mettre à jour le temps de référence pour le prochain calcul
        zeit1 = zeit2

# Convertir le temps total en heures, minutes et secondes
gesamtstunden = int(gesamtzeit // 3600)
gesamtminuten = int((gesamtzeit % 3600) // 60)
gesamtsekunden = int(gesamtzeit % 60)

# Formater le temps total
gesamtzeit_formatted = "{:02d}:{:02d}:{:02d}".format(gesamtstunden, gesamtminuten, gesamtsekunden)

print("Date:", zeit1.strftime("%Y-%m-%d"))
print("Gesamte Höhenmeter: {:.2f} m".format(abs(hoehenmeter)))
print("Gesamtdistanz: {:.2f} km".format(gesamtdistanz))
print("Gesamtzeit:", gesamtzeit_formatted)
print("Durchschnittsgeschwindigkeit: {:.2f} km/h".format(gesamtgeschwindigkeit_kmh / anzahl_punkte))
print("Maximale Geschwindigkeit: {:.2f} km/h".format(max_geschwindigkeit))
print("Saison:", get_season(zeit1))

# Se connecter à la base de données PostgreSQL
conn = psycopg2.connect(**config.db_config)

# Créer un curseur
cur = conn.cursor()

# Extraire les données géométriques du fichier GPX et les convertir au format PostgreSQL
wgs84= "epsg:4326"
lv95= "epsg:2056"
transformer1 = Transformer.from_crs("epsg:4326", "epsg:2056")
geometrie = wurzel.find('.//gpx:trkseg', ns)
geometrie_text = "LINESTRING("
for punkt in geometrie.findall('.//gpx:trkpt', ns):
    lon = float(punkt.attrib['lon'])
    lat = float(punkt.attrib['lat'])
    coord_LV95 = transformer1.transform(lat, lon)
    E = round(coord_LV95[0],3)
    N = round(coord_LV95[1],3)
    geometrie_text += "{} {}, ".format(E, N)
geometrie_text = geometrie_text[:-2] + ")"  # Supprimer la virgule finale et fermer le WKT
print(geometrie_text)

# Insérer les données géométriques dans la base de données
insert_query = '''
    INSERT INTO Skidaten (sd_date, sd_hoehenmeter, sd_distanz, sd_dauer, sd_geschwindigkeit, sd_maxgeschwindigkeit, sd_saison, sd_geometrie)
    VALUES (%s, %s, %s, %s, %s, %s, %s, ST_GeomFromText(%s));
'''

cur.execute(insert_query, (zeit1.strftime("%Y-%m-%d"), abs(hoehenmeter), gesamtdistanz, gesamtzeit_formatted, gesamtgeschwindigkeit_kmh / anzahl_punkte, max_geschwindigkeit, get_season(zeit1), geometrie_text))
conn.commit()

# Fermer la connexion
cur.close()
conn.close()
print("\n")
if os.path.exists(path +'.csv'):
    # Use the remove() function to delete the file
    os.remove(path +'.csv')
    print(f"The file {path +'.csv'} has been deleted.")
else:
    print(f"The file {path +'.csv'} does not exist.")

print("Daten erfolgreich in die Tabelle 'Skidaten' der PostgreSQL-Datenbank eingefügt.")
