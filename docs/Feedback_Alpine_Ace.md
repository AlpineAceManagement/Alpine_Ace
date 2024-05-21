**Projekt Feedback GitHub Pages:** Alpine Ace

**GitHub Projekt:** Théo Reibel, Fabian Gross, Andrea Bricalli

- https://github.com/AlpineAceManagement/Alpine_Ace
- https://alpineacemanagement.github.io/Alpine_Ace/

**README**: Einleitung zur Installation und Projekt ergänzen mit einem klaren Verweis auf die GitHub Pages.

- About (oben rechts) ergänzen mit Kurzbeschrieb und GitHub Pages Link #erledigt
- Habt Ihr den FME Import Prozess mit jemandem getestet, der/die nicht Teil des Projekt-Teams ist. #Nein, sollte aber funktionieren, da mehrmals getestet.
- Sowie die Aufsetzen des Geoservers? # Hinweiss zur offiziellen Installationsanleitung vom GeoServer und welche Version.
- Datenbank befühlen Variante 1 hat auf der gleichen Ebene keine Variante 2 #erledigt, Variante 2 Import Datenbank Dump erstellt.
- Vielleicht ist eine Übersichtsgrafik mit den Installationsschritten noch hilfreich, sowie ein Erklärung der Ordnerstruktur API, DB_PG, GPX_Files, .. da die Ordner nicht in Frontend, Backend, Preprocessing unterteilt sind.

- Preprocessing Ordner noch genauer erläutern, Struktur / Nutzung

Code Organisation:

- Code ist strukturiert, die Kommentare könnten noch erweitert werden. Frontend keine Kommentare vorhanden.
- Gute Auflistung der Ordnerorganisation ev. anstatt die Beschreibung der Datei auf zwei Zeilen, diese auf einer Zeile anzeigen, was zu einer kompakteren Übersicht der Struktur führt.
- Wie wird der Geoserver aufgesetzt und wie sind die Layer eingbunden und vorprozessiert?

**GitHub Pages:**

**Allgemein**: Gute Übersicht zum Projekt, es fehlt eine grafische Übersicht der implementierten und geplanten Features. Einleitung direkt auf das Ziel eingehen, der Projektkontext kann später erklärt werden, der hat nicht die Priorität, zuerst genannt zu werden.

- Menu falls zeitlich noch möglich in die Sidebar einfügen
- Reflektion einführen
- Literatur und Daten/Library Übersicht am Ende als Quellenverzeichnis oder geeigneter Stelle einfügen.
- zum Teil sehr detailliert

Kommentare zu den einzelnen Pages/Abschnitten:

Architektur:

- Diagramm, Schrift zT. zu klein, was ist genau im Frontend und was im Backend (npm, node.js)
- Begründen warum kein Bezug der Skigebiet Informationen zur Verfügung steht.
- Localhost anstatt local host
- Datenbankschema routing -> welche Tabellen werden nun verwendet?, wie sind die Sicherheitinformationen eingebunden?
- Express-API nicht FastAPI Rest Schnittstelle?

Funktionen

- Ist beim Lawinen-Bulletin die Region der Lawinengefahr immer auf den Kanton bezogen?
- Video - Einbindung Höhe vergrössern, ist doch sehr klein. Die Video lassen sich zum Teil nur mit mehrfachem probieren abspielen.
- Bei der Prozessierung z.B. der Pisten wären Grafiken/Workflow mit Beispielen noch hilfreich für das Verständnis der Vorprozessierung
- Methoden z.B. Dijkstra PostGIS Dokumentation und Paper als Literatur hinzufügen.
- Datenaufbereitung, sowie Routing mit einem Workflow/Grafik Beispiel ergänzen.

Incoming Features

- Incoming -> Upcoming Features ändern
- Übersicht Feature Grafik erstellen mit bestehenden und upcoming Features

**Visualisierung und weitere Kommentare**

- für Lawinengefahrkarte weniger Transparenz nutzen - Pseudostandards der Anbieter nutzen (z.B. WhiteRisk, MeteoSchweiz)
- viel zu viele Skalenstriche bei den Anlagen/Pisten Balken, Beschriftung zu klein - viel besser im Mockup als in der App
- Rote Buttons mit Icon ergänzen - grossgeschriebene Wörter können wir am schlechtesten lesen - zuviele Container (weisser Hintergrund für die Buttons weglassen, Rundung der Ecken anpassen)
- gut, dass der Einstellungsknopf vom Mockup in der Anwendung in den Hintergrund gerückt ist
- Karte hat mehr Platz erhalten, gut - was ist 'E' (links unter der Navigation)?
- Wetterdaten sehen zufällig aus - Gestaltprinzipien wirken nicht (insbesondere Abstände)
- allenfalls invertierte Markierung der Tageszeit wählen - Nacht grau, Tag weiss
- Restaurants - Gestaltprinzip Nähe - Beschriftung näher zum zu bezeichnenden Restaurantbild platzieren als zum nächsten Bild
