# Alpine_Ace

Die Skigebiets-App zielt darauf ab, eine zentrale Plattform für verschiedene Skigebiete bereitzustellen, die wichtige Funktionen für den Wintersport bietet. Zu diesen Funktionen gehören eine hochwertige Karte für die Orientierung und Navigation im Gelände, aktuelle Wetter- und Lawinensituationen sowie Informationen zu Verpflegungsmöglichkeiten. Darüber hinaus ermöglicht die App die Darstellung von Statistiken für den Benutzer.

## Funktionen

- Hochwertige Karten zur Orientierung und Navigation im Gelände.
- Aktuelle Informationen über Wetter und Lawinensituation für jedes Skigebiet.
- Informationen zu Verpflegungsmöglichkeiten in den Skigebieten.
- Statistikfunktionen zur Analyse der Aktivitäten des Benutzers.

## Installation

### Repository lokal klonen

Mit Git in einem Terminal das GitHub Repository _Alpine_Ace_ in ein lokales Verzeichnis klonen.

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
- os
- urllib
- zipfile
- shutil

Die Module können über das **requirements.txt** im gewünschten Prompt installiert werden.

1. Speicherort für Environment festlegen

```python
cd path/to/workspace
```

2. Python Environment erstellen

```python
conda create -n my_env python=3.8.19 -c conda-forge --file path/to/requirements.txt
```

### FME-Requirements

FME Workbench 2023.1 (Build 23619) oder aktueller. Kann auf der von der Webseite von [Safe Software heruntergeladen](https://fme.safe.com/downloads/) werden. Die Software ist Lizenzpflichtig.

### QGIS-Requirements

Eine QGIS Desktop 3.32.3-Lima oder aktueller. Kann auf der von der Webseite von [QGIS](https://qgis.org/de/site/forusers/download.html) werden. Die Software ist Open-Source.

### Node-Requirements

### Frontend

Um die Webapp zum laufen zu bringen müssen folgende Schritte ausgeführt werden:

1. neues Terminal öffnen -> als GitBash
2. Ordner wechseln

```python
cd alpine_ace
```

3. npm Module installieren

```python
npm install
```

4. React-App starten

```python
npm start
```

### Backend

Das Backend besteht aus drei Komponenten. Einem Datenbezugsteil (Python), einer Datenbank (Postgres inkl. Postgis) und einem Geoserver.

#### Postgres inkl. Postgis

Das Schema der DB findet sich unter _Backend/DB_PG._ Schema in pgAdmin kopieren und ausführen.

Damit die bezogenen Daten über die APIs gespeichert werden könne, muss das **config_template.py** angepasst und in **config.py** umbenannt werden.

#### Node-Server

1. neues Terminal öffnen -> als GitBash
2. Verbindungsaufbau zu Node Server

```python
cd alpine_ace/src/DB
```

3. Node Server starten

```python
node connect_db.js
```

## Datenbank

1. Mit pgAdmin 4 eine neue Datenbank erstellen mit dem Namen: `geoserver`
2. Extension [postgis](https://postgis.net/) und [pgrouting](https://pgrouting.org/) installieren.

```
CREATE EXTENSION postgis;
CREATE EXTENSION pgrouting;
```

### Datenbank befüllen Variante 1 mit FME

Download vom Höhenmodell DHM25 der Swisstopo.

1. Zurück ins Bassverzeichnis navigieren:

```
cd $(git rev-parse --show-toplevel)
```

2. Daten download starten:

```
python DB_PG/ASCII_Hoehenmodell_download.py
```

3. Ausführen der FME Workbench `geoserver_Datenimport.fmw`. Unter `Tools ->  FME Options -> Database Connections` die Verbindungsinformationen zur Datenbank eintragen.

- `DB_PG\geoserver_DB_erstellen.txt`: Datenbankschema für den Reader `DB_erstellen_script`
- `DB_PG\gpkg_Daten\Pisten_OSM.gpkg`: Daten für den Reader `Pisten_OSM`
- `DB_PG\gpkg_Daten\Pisten_OSM.gpkg`: Daten für den Reader `Skigebiete_OSM`
- `DB_PG\gpkg_Daten\Anlagen.gpkg`: Daten für den Reader `Anlagen`
- `DB_PG\ASCII_Hoehenmodell\dhm25_grid_raster.asc`: Daten für den Reader `DHM25`
- `DB_PG\CSV_Daten\Restaurants_Arosa_Lenzerheide.csv` : Daten für den Reader `Restaurants_Arosa_Lenzerheide`
- `DB_PG\CSV_Daten\Parkplatz.csv` : Daten für den Reader `Parkplatz`
- `DB_PG\CSV_Daten\OeV.csv` : Daten für den Reader `OeV`
- `DB_PG\CSV_Daten\meteo_stationen.csv` : Daten für den Reader `meteo_stationen`

1. Ausführen der FME Workbench `geoserver_Datenimport.fmw`.

- `C:\FHNW_lokal\4230\Alpine_Ace\Routing\alpine_ace_routing_DB_erweitern.txt`: Datenbankschema für die Routing Erweiterung für den Reader `DB_erweitern_Routing`
- Daten von Reader `geoserver_daten` von der Datenbank

5. Routing Script in PG Admin 4 kopieren und ausführen:
   `Routing\alpine_ace_routing.txt`

## Datenbank befüllen API

Um die Datenbank mit den API Daten zu befüllen muss das **main.py** in _Backend/API_ ausgeführt werden.

1. Neues Terminal öffnen -> als Command Prompt
2. Ordner wechseln

```python
cd API
```

3. main.py ausführen

```python
python main.py
```

### GeoServer

#### GeoServer Basis aufsetzten

#TODO Müssen wir das machen?

#### Arbeitsbereich erstellen

1. Arbeitsbereiche
2. Arbeitsbereich hinzufügen
3. Name

```
Alpine_Ace
```

3. Namensraum URI

```
http://geoserver.org/Alpine_Ace
```

4.  - [x] Standardarbeitsbereich
5.  Security
6.  - [x] Erlaube Zugriff auf jede Rolle
7.  Speichern

#### Datenspeicher hinzufügen

1. Datenspeicher
2. Datenspeicher hinzufügen
3. PostGIS
4. Arbeitsbereich `Alpine_Ace` auswählen
5. Name der Datenquelle

```
geoserver
```

7. host

```
localhost
```

8. port: `Portnummer`

9. database

```
geoserver
```

10. user

```
postgres
```

12. passwd: `Passwort`
13. Speichern

#### SQL views

Folgende Layers müssen erstellt werden:

##### Restaurants:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. unter Layer mit Namensraum und Präfix , Zeile `restaurant` auswählen und `Publizieren `
4. Koordinatenreferenzsystem:
   Suche nach `EPSG:2056`
5. Begrenzendes Rechteck:
   Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

6. Aus den nativen Grenzen berechnen, anklicken
7. Speichern

##### Anlagen:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. unter Layer mit Namensraum und Präfix , Zeile `anlagen` auswählen und `	Publizieren `
4. Koordinatenreferenzsystem:
   Suche nach `EPSG:2056`
5. Begrenzendes Rechteck:
   Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

6. Aus den nativen Grenzen berechnen, anklicken
7. Speichern

##### Lawinen Bulletins:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. unter Layer mit Namensraum und Präfix , Zeile `bulletins` auswählen und `	Publizieren `
4. Koordinatenreferenzsystem:
   Suche nach `EPSG:2056`
5. Begrenzendes Rechteck:
   Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

6. Aus den nativen Grenzen berechnen, anklicken
7. Speichern

##### Parkplätze:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. unter Layer mit Namensraum und Präfix , Zeile `parkplatz` auswählen und `	Publizieren `
4. Koordinatenreferenzsystem:
   Suche nach `EPSG:2056`
5. Begrenzendes Rechteck:
   Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

6. Aus den nativen Grenzen berechnen, anklicken
7. Speichern

##### Pisten:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. unter Layer mit Namensraum und Präfix , Zeile `pisten` auswählen und `	Publizieren `
4. Koordinatenreferenzsystem:
   Suche nach `EPSG:2056`
5. Begrenzendes Rechteck:
   Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

6. Aus den nativen Grenzen berechnen, anklicken
7. Speichern

#### SQL views

Folgende SQL views müssen erstellt werden:

##### Routing: Nächster Konten finden:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. SQL View konfigurieren
4. Name der View:

```
a_a_nearest_vertex
```

5. SQL-Statement:

```
   SELECT
    v.id,
    v.the_geom
FROM
    a_a_routing_noded_vertices_pgr AS v,
    a_a_routing_noded AS e
WHERE
    v.id = (
        SELECT
            id
        FROM
            a_a_routing_noded_vertices_pgr
        ORDER BY
            the_geom <-> ST_SetSRID(ST_MakePoint(%x%, %y%), 2056)
        LIMIT 1
    )
    AND (e.source = v.id OR e.target = v.id)
GROUP BY
    v.id, v.the_geom
```

6. Schlage Parameter vor
7. Standartwert für x

```
2600000
```

Reguläre Ausdruck-Validierung

```
^[\d\.\+]+$
```

7. Standartwert für y

```
1200000
```

Reguläre Ausdruck-Validierung

```
^[\d\.\+]+$
```

8. Attribute: Aktualisieren
9. the_geo: `Point` auswählen als Typ
10. Speichern
11. Koordinatenreferenzsystem:
    Suche nach `EPSG:2056`
12. Begrenzendes Rechteck:
    Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken

13. Aus den nativen Grenzen berechnen, anklicken
14. Speichern

##### Routing: Kürzester Weg finden:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. SQL View konfigurieren
4. Name der View:

```
a_a_shortest_path_test
```

5. SQL-Statement:

```
SELECT
    min(r.seq) AS seq,
    e.old_id AS id,
    e.p_farbe,
    sum(e.distance) AS distance,
    ST_Collect(e.the_geom) AS geom,
    sum(e.cost) AS cost,  -- Adding the 'cost' column
    sum(e.rcost) AS rcost  -- Adding the 'rcost' column
FROM
    pgr_dijkstra(
        'SELECT id,source,target,distance AS cost, rcost FROM a_a_routing_noded', %source%, %target%, false
    ) AS r,
    a_a_routing_noded AS e
WHERE
    r.edge = e.id
GROUP BY
    e.old_id, e.p_farbe
```

6. Schlage Parameter vor
7. Standartwert für source

```
0
```

Reguläre Ausdruck-Validierung

```
\d+
```

8. Standartwert für target

```
0
```

Reguläre Ausdruck-Validierung

```
\d+
```

9. Attribute: Aktualisieren
10. the_geo: `MultiLineString` auswählen als Typ
11. Speichern
12. Koordinatenreferenzsystem:
    Suche nach `EPSG:2056`
13. Begrenzendes Rechteck:
    Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken
14. Aus den nativen Grenzen berechnen, anklicken
15. Speichern

##### Restaurant: Angewähltes Restaurant anzeigen:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. SQL View konfigurieren
4. Name der View:

```
Alpine_Ace:a_a_restaurant
```

5. SQL-Statement:

```
  SELECT
    v.Restaurant_ID,
   v.R_Name,
   v.R_Oeffnungszeiten,
   v.R_Telefon,
   v.R_Email,
   v.R_Webseite,
   v.R_Geometry
   FROM
    Restaurant AS v
   WHERE
    v.Restaurant_ID= %Restaurant_ID%
```

6. Schlage Parameter vor
7. Standartwert für Restaurant_ID

```
0
```

Reguläre Ausdruck-Validierung

```
\d+
```

8. Attribute: Aktualisieren
9. the_geo: `Point` auswählen als Typ
10. Speichern
11. Koordinatenreferenzsystem:
    Suche nach `EPSG:2056`
12. Begrenzendes Rechteck:
    Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken
13. Aus den nativen Grenzen berechnen, anklicken
14. Speichern

##### GPX_Viewer: Angewählte Strecke anzeigen:

1. Neuer Layer
2. Arbeitsbereich: `Alpine_Ace:geoserver` anwählen
3. SQL View konfigurieren
4. Name der View:

```
a_a_skidaten_weg
```

5. SQL-Statement:

```
SELECT
    v.Skidaten_ID,
    v.SD_Date,
    v.SD_Hoehenmeter,
    v.SD_Distanz,
    v.SD_Dauer,
    v.SD_Geschwindigkeit,
    v.SD_MaxGeschwindigkeit,
    v.SD_Saison,
    v.Benutzername,
    v.SD_Geometrie
FROM
    Skidaten AS v
WHERE
    v.Skidaten_ID = %Skidaten_ID%
```

6. Schlage Parameter vor
7. Standartwert für Skidaten_ID

```
0
```

Reguläre Ausdruck-Validierung

```
\d+
```

8. Attribute: Aktualisieren
9. the_geo: `LineString` auswählen als Typ
10. Speichern
11. Koordinatenreferenzsystem:
    Suche nach `EPSG:2056`
12. Begrenzendes Rechteck:
    Aus den Grenzen des Koordinatenreferenzsystems berechnen, anklicken
13. Aus den nativen Grenzen berechnen, anklicken
14. Speichern

## Page

Für weiter Informationen zum Projekt besuche unsere GitHub Page:
[alpineacemanagement.github.io](https://alpineacemanagement.github.io/Alpine_Ace/)

```

```

### API

Es werden drei APIs verwendet. Die Dokumentationen dazu sind unter folgenden Links ersichtlich:

- [Open-Meteo](https://open-meteo.com/en/docs)
- [SLF Measurement API](https://measurement-api.slf.ch/)
- Lawinenbulletins Daten werden über eine API des SLF bezogen.

## Mitwirkende

- [Andrea Bricalli](https://github.com/AJPB4133)
- [Fabian Gross](https://github.com/loopercamera)
- [Théo Reibel](https://github.com/TheoR14)

## Lizenz
