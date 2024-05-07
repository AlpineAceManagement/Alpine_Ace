import psycopg2 as pg2
import json
import logging
import os

# Definieren der Verbindungsparameter zur PostgreSQL-Datenbank
dbname = 'geoserver'   # Name der Datenbank
user = 'postgres'      # Benutzername für die Datenbank
psw = 'jNtd2C13ka9oaPpRy1jP'  # Passwort für die Datenbank
host = 'localhost'     # Hostname der Datenbank
port = '5433'          # Portnummer der Datenbank (Standard ist 5432)
schema = user          # Schema, das verwendet werden soll (hier gleich dem Benutzernamen)

# Definieren des Dateipfads für das Logfile im Ordner "API"
log_file_path = os.path.join("API", "API_import_DB.log")

# Konfigurieren des Loggings
logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s - %(message)s')

def extract_measure_date_HS(api_response):
    values_list = []

    # Ersetzen von einfachen Anführungszeichen durch doppelte Anführungszeichen in der API-Antwort
    api_response = api_response.replace("'", "\"")

    # Aufteilen der Antwort in einzelne JSON-Objekte
    api_response_list = api_response.split("}, {")
    # Behandlung des Falls, in dem die Antwort mit '{' oder '}' beginnt oder endet
    if len(api_response_list) > 1:
        api_response_list[0] += "}"
        api_response_list[-1] = "{" + api_response_list[-1]
    else:
        api_response_list = [api_response]

    # Extrahieren des Messdatums und des Schneehöhenwerts aus jedem JSON-Objekt
    for item in api_response_list:
        data = json.loads(item)
        measure_date = data.get('measure_date')
        HS_value = data.get('HS')
        values_list.append({'measure_date': measure_date, 'HS': HS_value})

    return values_list

def send_sql(dbname, user, psw, host, port, sql, param=[]):
    # Herstellen der Verbindung zur Datenbank
    connection = pg2.connect(' '.join(['dbname='+dbname, 'user='+user, 'password='+psw, 'host='+host, 'port='+port]))
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
    values_list = extract_measure_date_HS(api_response)
    # Verwendung der extrahierten Werte
    for values in values_list:
        measure_date = values.get('measure_date')
        HS_value = values.get('HS')
        # Erstellen des SQL-Befehls zum Einfügen der Daten in die Tabelle 'Schneehoehe'
        sql = f"INSERT INTO Schneehoehe (SH_Zeit, SH_Hoehe) VALUES (TIMESTAMP '{measure_date}', {HS_value})"
        print(sql)
        # Ausführen des SQL-Befehls
        resultat = send_sql(dbname, user, psw, host, port, sql, param=[schema])
        print(resultat)

# Beispiel-API-Antwortstring
api_response = "{'station_code': 'ROT3', 'measure_date': '2024-03-17T17:30:00Z', 'HS': 224.4, 'TA_30MIN_MEAN': -2.757, 'RH_30MIN_MEAN': 93.2, 'TSS_30MIN_MEAN': -3.872, 'TS0_30MIN_MEAN': 0.071, 'TS25_30MIN_MEAN': -0.503, 'TS50_30MIN_MEAN': -0.99, 'TS100_30MIN_MEAN': -1.817, 'RSWR_30MIN_MEAN': 10.46, 'VW_30MIN_MEAN': 0.547, 'VW_30MIN_MAX': 1.428, 'DW_30MIN_MEAN': 20.87, 'DW_30MIN_SD': 17.22}"
# Aufruf der Funktion zum Extrahieren und Verwenden von Werten
extract_and_use_values(api_response)


