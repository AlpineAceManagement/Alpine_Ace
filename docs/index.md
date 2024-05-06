<a id=start></a>

# Alpine Ace - Ski App

Das ist die Projekt Website des *Alpine Ace Ski App*. Das App enthält eine Server und eine Client Umgebung.
- Server: FastAPI
- Client: React + OpenLayers

GitHub Repository: [AlpineAceManagement/Alpine_Ace](https://github.com/AlpineAceManagement/Alpine_Ace)

![Alpine Ace Startseite Screenshot](images/Startseite.png)

## Inhaltsverzeichnis
- [Beschrieb](#beschrieb)
- [Funktionen](#funktionen)
    - [Backend](#backend)
    - [Frontend](#frontend)   
- [Incoming Features](#features)
- [Contribution](#contribution)

## Beschrieb des Apps
<a id=beschrieb></a>



## Funktionen
<a id=funktionen></a>

### Backend
<a id=backend></a>

#### API
Um dem User die aktuellsten Informationen über das Skigebiet zur Verfügung stellen zu kön- nen, werden einige APIs benötigt.

- Meteo:Die Wetter Daten werden über [https://www.meteomatics.com/de/free-wetter-api/](https://www.meteomatics.com/de/free-wetter-api/) bezogen. 500 Abfragen pro Tag sind kostenlos. Die Abfrage der Daten erfolgt im Viertelstunden Takt.

- Lawineninformation: Lawineninformation werden über die API des Institut für Schnee und Lawinenforschung (SLF) bezogen [https://www.slf.ch/de/services-und-produkte/slf-datenservice/](https://www.slf.ch/de/services-und-produkte/slf-datenservice/). Dabei kommen die Daten von den Interkantonalen Mess- und Informationssystem (IMIS) bezogen. Der Bezug der Daten ist kostenlos. Die Abfrage der Daten erfolgt im 24h Takt.

- Schneehöhen:DieSchneehöhenwerdenüberdieAPIdesSLFbezogen.Dabeihandelt es sich um die Gleiche API wie bei den Lawineninformation. Die Abfrage der Daten erfolgt im 24h Takt

- Informationen über Skigebiet: Die Informationen zu den offenen Anlagen oder den offenen Pisten werden entweder über Scraping oder über eine API der einzelne Bergbah- nen bezogen, dies ist jedoch noch in Abklärung.

#### Datenbanken

In diesem Projekt werden neben herkömmlichen Daten auch räumliche Daten wie Pisten und Anlagen als Geometrien gespeichert. Um sicherzustellen, dass die Datenbank die geometrischen Daten effizient verarbeiten kann, wurde entschieden, die relationalen Datenbank PostgreSQL in Verbindung mit der räumlichen Erweiterung PostGIS zu verwenden. Dadurch wird PostgreSQL in der Lage sein, räumliche Abfragen und Operationen durchzuführen, was für unser Projekt von entscheidender Bedeutung ist. Darüber hinaus erleichtert es die Integration der Datenbank in ein Geoinformationssystem (GIS), da PostgreSQL mit PostGIS nahtlos mit anderen GIS-Systemen zusammenarbeiten kann.
Durch die Verwendung der räumlichen Datenbank (RDB) ist sichergestellt, dass die Applika- tion in der Lage ist, räumliche Daten ohne grössere Probleme zu verarbeiten und somit eine robuste Lösung für unsere Anforderungen zu bieten.

### Frontend
<a id=frontend></a>

Da das Ziel ist eine APP für Mobiltelefone zu entfernen musste ein Performance starkes Fra- mework gewählt werden. Dabei kamen drei Frameworks in Frage, wie React Nativ, Flutter oder Progressive Web App (PWA).
Der Entscheid fiel auf PWAs, da die sie Webbasiert sind und somit keine Installation notwendig ist. Trotzdem ist ein App-like Design gegeben. Zudem funktionieren PWAs auf allen gängigen Plattformen und Betriebssystemen. Einschliesslich iOs, Andoird, Windows und macOS. Ein weiterer Vorteil ist, dass PWAs über ein offline Modus verfügen. Heisst sie können auch offline verwendet werden. Weiter können PWAs schneller gestartet werden als native Apps, da sie im Browser bereits zwischen gespeichert sind.

## Incoming Features
<a id=features></a>

## Contribution
<a id=contribution></a>

- Andrea Bricali, GitHub: [AJPB4133](https://github.com/AJPB4133)
- Fabian Gross, GitHub: [loopercamera](https://github.com/loopercamera)
- Théo Reibel, GitHub: [TheoR14](https://github.com/TheoR14)


[Zurück nach oben](#start)