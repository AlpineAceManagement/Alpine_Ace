**Projekt Feedback GitHub Pages:** Alpine Ace

Im Todo Tree einen eigenen Eintrag erstellt für #erledigt

    "erledigt": {
      "icon": "check",
      "foreground": "white",
      "background": "green",
      "iconColour": "green"
    },

Alle Einträge sind grün welche Erledigt sind.

**GitHub Projekt:** Théo Reibel, Fabian Gross, Andrea Bricalli

- https://github.com/AlpineAceManagement/Alpine_Ace
- https://alpineacemanagement.github.io/Alpine_Ace/

**README**: Einleitung zur Installation und Projekt ergänzen mit einem klaren Verweis auf die GitHub Pages.#erledigt

- About (oben rechts) ergänzen mit Kurzbeschrieb und GitHub Pages Link #erledigt
- Habt Ihr den FME Import Prozess mit jemandem getestet, der/die nicht Teil des Projekt-Teams ist. #erledigt: Nein haben wir nicht, sollte aber funktionieren, da mehrmals getestet.
- Sowie die Aufsetzen des Geoservers? #erledigt, Hinweis zur offiziellen Installationsanleitung vom GeoServer und welche Version.
- Datenbank befühlen Variante 1 hat auf der gleichen Ebene keine Variante 2 #erledigt, Variante 2 Import Datenbank Dump erstellt.
- Vielleicht ist eine Übersichtsgrafik mit den Installationsschritten noch hilfreich #erledigt
- sowie ein Erklärung der Ordnerstruktur API, DB_PG, GPX_Files, .. da die Ordner nicht in Frontend, Backend, Preprocessing unterteilt sind. #erledigt

- Preprocessing Ordner noch genauer erläutern, Struktur / Nutzung #TODO

Code Organisation:

- Code ist strukturiert, die Kommentare könnten noch erweitert werden. Frontend keine Kommentare vorhanden. #erledigt
- Gute Auflistung der Ordnerorganisation ev. anstatt die Beschreibung der Datei auf zwei Zeilen, diese auf einer Zeile anzeigen, was zu einer kompakteren Übersicht der Struktur führt. #TODO
- Wie wird der Geoserver aufgesetzt und wie sind die Layer eingebunden und vorprozessiert? #erledigt, GeoServer wird vorausgesetzt, Installations Anleitung ist angeben.

**GitHub Pages:**

**Allgemein**: Gute Übersicht zum Projekt, es fehlt eine grafische Übersicht der implementierten und geplanten Features. Einleitung direkt auf das Ziel eingehen, der Projektkontext kann später erklärt werden, der hat nicht die Priorität, zuerst genannt zu werden. #TODO

- Menu falls zeitlich noch möglich in die Sidebar einfügen #TODO zeit hat nicht gereicht
- Reflektion einführen #TODO
- Literatur und Daten/Library Übersicht am Ende als Quellenverzeichnis oder geeigneter Stelle einfügen. #TODO
- zum Teil sehr detailliert #erledigt, Wir hoffen, dass man es dank detailliertem Beschrieb gut verstehen kann

Kommentare zu den einzelnen Pages/Abschnitten:

Architektur:

- Diagramm, Schrift zT. zu klein, was ist genau im Frontend und was im Backend (npm, node.js) # erledigt
- Begründen warum kein Bezug der Skigebiet Informationen zur Verfügung steht. #TODO
- Localhost anstatt local host #erledigt
- Datenbankschema routing -> welche Tabellen werden nun verwendet?, wie sind die Sicherheitinformationen eingebunden? #TODO
- Express-API nicht FastAPI Rest Schnittstelle? #erledigt, Express-API wird verwendet, wir verwenden keine Fast-API

Funktionen

- Ist beim Lawinen-Bulletin die Region der Lawinengefahr immer auf den Kanton bezogen? #erledigt Lawinenbulletin im Dashboard bezieht sich auf das aktuelle Skigebiet. In diesem Fall der Lenzerheide. Die Kantone dienen nur zur Orientierung.

- Video - Einbindung Höhe vergrössern, ist doch sehr klein. Die Video lassen sich zum Teil nur mit mehrfachem probieren abspielen. #erledigt, alle Videos getestet (Webseite neu Laden mit ctrl + F5 ohne Cache)
- Bei der Prozessierung z.B. der Pisten wären Grafiken/Workflow mit Beispielen noch hilfreich für das Verständnis der Vorprozessierung #TODO
- Methoden z.B. Dijkstra PostGIS Dokumentation und Paper als Literatur hinzufügen. #TODO
- Datenaufbereitung, sowie Routing mit einem Workflow/Grafik Beispiel ergänzen. #TODO

Incoming Features

- Incoming -> Upcoming Features ändern # erledigt, in der Doku so wie im App
- Übersicht Feature Grafik erstellen mit bestehenden und upcoming Features #erledigt

**Visualisierung und weitere Kommentare**

- für Lawinengefahrkarte weniger Transparenz nutzen - Pseudostandards der Anbieter nutzen (z.B. WhiteRisk, MeteoSchweiz)#erledigt, Transparenz von 0.3 auf 0.5 angepasst, Videos aber nicht angepasst aber auf Print Screen
- viel zu viele Skalenstriche bei den Anlagen/Pisten Balken, Beschriftung zu klein - viel besser im Mockup als in der App #erledigt, Bilder in Doku angepasst
- Rote Buttons mit Icon ergänzen - grossgeschriebene Wörter können wir am schlechtesten lesen - zuviele Container (weisser Hintergrund für die Buttons weglassen, Rundung der Ecken anpassen) #erledigt Schriftgrösse angepasst bei Buttons, Bild Startmenü neu gemacht, Video nicht angepasst, Container nicht angepasst
- gut, dass der Einstellungsknopf vom Mockup in der Anwendung in den Hintergrund gerückt ist
- Karte hat mehr Platz erhalten, gut - was ist 'E' (links unter der Navigation)? #erledigt Schaltfläche ist jetzt auch in der Navigation Beschreiben. Dabei wird auf einen vorgeben Extend gezoomt.
- Wetterdaten sehen zufällig aus - Gestaltprinzipien wirken nicht (insbesondere Abstände) #TODO zeit hat nicht gereicht um dies aufzubauen wie im Mokup.
- allenfalls invertierte Markierung der Tageszeit wählen - Nacht grau, Tag weiss #erledigt
- Restaurants - Gestaltprinzip Nähe - Beschriftung näher zum zu bezeichnenden Restaurantbild platzieren als zum nächsten Bild #erledigt, Abstand zwischen den einzelnen Restaurant-Boxen ist grösser, der Text ist jetzt direkt unter dem Bild. Text und Bild werden jetzt als Einheit wahrgenommen.
