'''import relevant libraries'''
import requests
import csv
import time
import logging
import os
import psycopg2 as pg2  # Importieren Sie psycopg2

# Definieren der Verbindungsparameter zur PostgreSQL-Datenbank
dbname = 'geoserver'   # Name der Datenbank
user = 'postgres'      # Benutzername für die Datenbank
psw = 'jNtd2C13ka9oaPpRy1jP'  # Passwort für die Datenbank
host = 'localhost'     # Hostname der Datenbank
port = '5433'          # Portnummer der Datenbank (Standard ist 5432)
schema = user          # Schema, das verwendet werden soll (hier gleich dem Benutzernamen)

# Definieren des Dateipfads für das Logfile im Ordner "API"
log_dir = "API"
log_file_path = os.path.join(log_dir, "API_import_DB.log")

# Stellen Sie sicher, dass das Verzeichnis für das Logfile existiert
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Konfigurieren des Loggings
logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s - %(message)s')


def send_sql(dbname, user, psw, host, port, sql, param=[]):
    # Herstellen der Verbindung zur Datenbank
    connection = pg2.connect(dbname=dbname, user=user, password=psw, host=host, port=port)
    try:
        # Öffnen eines Cursors für die Datenbankverbindung
        with connection.cursor() as curs:
            # Ausführen des SQL-Befehls mit den angegebenen Parametern
            curs.execute(sql, param)
        # Commit der Transaktion, um die Änderungen in die Datenbank zu schreiben
        connection.commit()
        result = "Daten erfolgreich eingefügt"
        # Protokollieren des SQL-Statements
        logging.info(sql)
    except Exception as e:
        # Rollback im Fehlerfall, um alle Änderungen rückgängig zu machen
        connection.rollback()
        print("Fehler:", e)
        result = None
    finally:
        # Schließen der Verbindung zur Datenbank
        connection.close()
    return result

def extract_and_use_values(api_response):
    station_code = api_response[0]  # Extrahieren Sie den Wert der Station aus der API-Antwort
    measure_date = api_response[1]
    HS_value = api_response[2]
    if HS_value is None:
        HS_value = "NULL"

    # Erstellen des SQL-Befehls zum Einfügen der Daten in die Tabelle 'Schneehoehe'
    sql = f"INSERT INTO Schneehoehe (Station_code, SH_Zeit, SH_Hoehe) VALUES ('{station_code}', TIMESTAMP '{measure_date}', {HS_value})"
    print(sql)
    # Ausführen des SQL-Befehls
    resultat = send_sql(dbname, user, psw, host, port, sql, param=[schema])
    print(resultat)


'''define API-access'''
def get_station_data(station_code):
    for code in station_code:
        url = f"https://measurement-api.slf.ch/public/api/imis/station/{code}/measurements"
        res = requests.get(url)

        if res.status_code == 200:
            '''Parse the Json response'''
            data = res.json()
            print(data[0])
            if data:
                '''Extract relevant info from the first data point'''
                item = data[0]
                station_code = item.get('station_code')
                measure_date = item.get('measure_date')
                HS_value = item.get('HS')
                values = station_code,measure_date, HS_value
                return values
            else:
                print(f"Error: No data points available for station {code}.")
                continue
        else:
            print(f"Error: Unable to retrieve data from SLF API for station {code} (status code {res.status_code}) ")
            continue
    return None


'''Write the data to a csv-file'''
def write_to_csv(data):
    with open("snowstation.csv", "a", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data)


'''main loop of program - extracting information for every station'''
def main():
    station_codes = ['VSC1']
    while True:
        for station_code in station_codes:
            data = get_station_data([station_code])
            if data:
                write_to_csv(data)
                extract_and_use_values(data)  # Daten in die Datenbank einfügen
            time.sleep(10)

if __name__ == "__main__":
    main()
