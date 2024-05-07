# Alpine_Ace
Die Skigebiets-App zielt darauf ab, eine zentrale Plattform für verschiedene Skigebiete bereitzustellen, die wichtige Funktionen für den Wintersport bietet. Zu diesen Funktionen gehören eine hochwertige Karte für die Orientierung und Navigation im Gelände, aktuelle Wetter- und Lawinensituationen sowie Informationen zu Verpflegungsmöglichkeiten. Darüber hinaus ermöglicht die App die Darstellung von Statistiken für den Benutzer.

## Funktionen

- Hochwertige Karten zur Orientierung und Navigation im Gelände.
- Akutelle Informationen über Wetter und Lawinensituation für jedes Skigebiet.
- Informationen zu Verpflegungsmöglichkeiten in den Skigebieten.
- Statistikfunktionen zur Analyse der Aktivitäten des Benutzers.

## Installation

### Repositroy lokal klonen

Mit Git in einem Terminal das GitHub Repository *Alpine_Ace* in ein lokales verzeichnis klonen.

1. Speicherort angeben
```python
cd /path/to/workspace
```
2. Repository klonen
```python
git clone https://github.com/AlpineAceManagement/Alpine_Ace.git
```

### Python-Requirements

Folgende Python-Module müssen für das Backend Installiert werden:

- Python 3.8.19
- openmeteo_request
- psycopgg2
- requests
- pyproj
- xml.etree.ElementTree
- pandas

Die Module können über das __requirements.txt__ im gewünschten Prompt installiert werden.

1. Speicherort für Enviroment festlegen
```python
cd path/to/workspace
```

2. Python Enviroment erstellen
```python
conda create -n my_env python=3.8.19 -c conda-forge --file path/to/requirements.txt
```

### Node-Requirements


### Frontend
Um die Webapp zum laufen zu bringen müssen folgende Schritte ausgeführt werden: 

1. neues Terminal öffnen -> als GitBasch
2. Ordner wechseln
```pyhton
cd alpine_ace
```
3. npm Module instaliieren
```python
npm install
```
4. React-App starten
```python
npm start
```
### Backend
Das Backend besteht aus drei Komponenten. Einem Datenbezugsteil (Python),  einem Speicherungsteil (Postgres inkl. Postgis) und einem Geoserver.



#### Postgres inkl. Postgis

Das Schema der DB findet sich unter *Backend/DB_PG.* Schema in pgAdmin kopieren und ausführen.

Damit die bezogenen Daten über die APIs gespeicher werden könne, muss das __config_template.py__ angepasst und in __config.py__ umbenannt werden.


#### Node-Server

1. neues Terminal öffnen -> als GitBasch
2. Verbindungsaufbau zu Node Server
```python
cd alpine_ace/src/DB
```
3. Node Server staren
```python
node connect_db.js
```

#### Geoserver


## Datenbank befüllen
Um die Datenbank mit den API Daten zu befüllen muss das __main.py__ in *Backend/API* ausgeführt werden.

1. Neues Terminal öffnen -> als Command Prompt 
2. Ordner wechseln
```python
cd API
```
3. main.py ausführen
```python
python main.py
```


### API
Es werden drei APIs verwendent. Die Dokumentationen dazu sind unter folgenden Links ersichtlich:
- [Open-Meteo](https://open-meteo.com/en/docs)
- [SLF Measurement API](https://measurement-api.slf.ch/)
- Lawinenbulletins Daten werden über eine API des SLF bezogen.





## Mitwirkende
* [Andrea Bricalli](https://github.com/AJPB4133)
* [Fabian Gross](https://github.com/loopercamera)
* [Théo Reibel](https://github.com/TheoR14)


## Lizenz





## Page
Für weiter Informationen zum Projekt besuche unsere GitHub Page:
[alpineacemanagement.github.io](https://alpineacemanagement.github.io/Alpine_Ace/)
