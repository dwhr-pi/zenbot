# Zenbot Dashboard Erweiterung: Terminalsteuerung über `dashboard.ejs`

Dieses Tutorial zeigt dir, wie du das Zenbot-Web-Dashboard (`dashboard.ejs`) erweiterst, um über das Frontend Terminalbefehle auszuführen – z. B. um alle verfügbaren Coins einer Börse (wie Binance) aufzulisten.

1. Eine neue Route im Zenbot-Backend (Node.js/Express) erstellen.


2. Eine AJAX-Verbindung von 'dashboard.ejs' aus aufbauen.


3. Im Backend entsprechende Funktionen einbauen (z. B. 'zenbot list-products' ausführen oder direkt per API auf Exchange-Daten zugreifen).


4. Das Ergebnis im Frontend anzeigen.


---

## 🔧 1. Neue API-Route im Backend hinzufügen

Öffne deine Backend-Datei (z. B. `server.js` oder `web.js`) und füge eine neue Route hinzu, die den Befehl `zenbot list-products binance` ausführt:

```js
const express = require('express')
const router = express.Router()
const { exec } = require('child_process')

router.get('/api/coins', (req, res) => {
  exec('zenbot list-products binance', (error, stdout, stderr) => {
    if (error) {
      console.error(`Fehler: ${error.message}`)
      return res.status(500).json({ error: error.message })
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
    }
    res.json({ output: stdout })
  })
})

module.exports = router
```


> Achte darauf, dass zenbot im PATH verfügbar ist oder nutze den vollständigen Pfad zum Skript.
Dann stelle sicher, dass server.js die neue Route einbindet:

```js
const routes = require('./routes')
app.use('/', routes)
```

## 🔧 2. Frontend (dashboard.ejs) um AJAX-Funktion erweitern

Füge folgenden HTML- und JavaScript-Code zu deiner dashboard.ejs-Datei hinzu:
```JS
<button id="load-coins">Coins laden</button>
<pre id="coin-output"></pre>

<script>
document.getElementById('load-coins').addEventListener('click', () => {
  fetch('/api/coins')
    .then(response => response.json())
    .then(data => {
      document.getElementById('coin-output').textContent = data.output
    })
    .catch(err => {
      document.getElementById('coin-output').textContent = 'Fehler beim Abrufen: ' + err
    })
})
</script>
```

## 🔧 3. Optional: Direktes Einbinden von Zenbot-Modulen

Statt 'child_process.exec' kannst du auch direkt auf das Zenbot-Modul zugreifen (z. B. via 'lib/exchange/'), um die Produkte über die Zenbot-API zu listen. Das ist performanter und sicherer – erfordert jedoch mehr Verständnis der internen Zenbot-Architektur.


---

🧪 Beispielausgabe

Nach dem Klick auf „Coins laden“ wird im Frontend eine Liste wie folgt angezeigt:

```
binance.BTC-USDT
binance.ETH-USDT
binance.ADA-USDT
```


---

🧱 Weiterführende Ideen

*Suchfunktion*: Filtere Coins nach Namen.

*Dropdown-Menü*: Auswahl der Börse (binance, kraken, etc.).

*Auto-Reload*: Aktualisierung der Liste in Intervallen.

*Befehls-Konsole*: Weitere Zenbot-Befehle per UI ausführen.



---

🛡 Sicherheitshinweis

Das direkte Ausführen von Shell-Kommandos aus dem Webfrontend ist potenziell gefährlich. Nutze entsprechende Sicherheitsmechanismen (z. B. Authentifizierung, Parameter-Validierung oder direkte API-Zugriffe), bevor du das System öffentlich zugänglich machst.  


xxxxxx



# Für Zenbot möchte ich eine Erweiterung für das Webinterface. In dem die CPU Last pro Kern, bzw. der gesamt Last, sowie den freier Speicherplatz auf der ausführenden Festplatte, RAM Speicher Auslastung und LAN/WLAN Auslastung des ausführenden Systems grafisch alle 200 msek. ausgeben wird. 

Hallo! Das ist eine ausgezeichnete Idee, um die Leistung des Systems, auf dem Zenbot läuft, direkt im Auge zu behalten. Eine solche Erweiterung kann sehr nützlich sein, um Engpässe schnell zu erkennen.

Gerne skizziere ich die Schritte und den technologischen Ansatz, den wir verfolgen könnten, um diese Erweiterung für das Zenbot-Webinterface zu entwickeln.

### Technologischer Ansatz

Um die Systemdaten in Echtzeit (alle 200 Millisekunden) an das Webinterface zu senden, benötigen wir eine ständige Verbindung zwischen dem Server (dem Zenbot-Prozess) und dem Client (Ihrem Browser).

1.  **Backend (Zenbot-Server):** Wir müssen den Zenbot-Server erweitern, damit er die Systemmetriken auslesen kann. Dafür eignen sich Node.js-Bibliotheken, die plattformübergreifend funktionieren.
2.  **Kommunikation:** Die beste Methode für eine solche Echtzeit-Kommunikation sind **WebSockets**. Wir würden einen WebSocket-Endpunkt im Zenbot-Server einrichten, der die gesammelten Daten alle 200 ms an alle verbundenen Web-Clients sendet.
3.  **Frontend (Webinterface):** Im Zenbot-Webinterface würden wir mit JavaScript eine Verbindung zu diesem WebSocket herstellen. Die empfangenen Daten werden dann verwendet, um die grafischen Anzeigen zu aktualisieren. Für die Visualisierung eignen sich Bibliotheken wie **Chart.js** oder **D3.js**, da sie animierte und performante Graphen erstellen können.

### Benötigte Systeminformationen

Wir müssen die folgenden Daten auf dem Server auslesen:

*   **CPU-Auslastung:** Sowohl die durchschnittliche Gesamtauslastung als auch die Auslastung für jeden einzelnen Prozessorkern.
*   **RAM-Auslastung:** Genutzter und freier Arbeitsspeicher.
*   **Festplattenspeicher:** Freier und gesamter Speicherplatz des relevanten Laufwerks.
*   **Netzwerkauslastung:** Datenrate für eingehenden und ausgehenden Traffic (LAN/WLAN).

Um diese Informationen zu sammeln, werde ich zunächst die passenden Systembibliotheken für Node.js recherchieren.

Die Recherche bestätigt, dass Zenbot eine Kommandozeilen-Handelsbot ist, der auf Node.js und MongoDB basiert. Er verfügt über eine Plugin-Architektur, die sich für Erweiterungen eignet.

Für die Datenerfassung im Backend können wir auf verschiedene Node.js-Module zurückgreifen:

*   **CPU-Last:** Das eingebaute `os`-Modul von Node.js liefert Informationen über die CPUs, einschließlich der Zeiten für verschiedene Zustände (user, nice, sys, idle, irq). Daraus lässt sich die Auslastung pro Kern und die Gesamtauslastung berechnen. Alternativ gibt es Pakete wie `os-utils` oder `node-system-stats`, die diese Berechnung vereinfachen.
*   **RAM-Auslastung:** `process.memoryUsage()` gibt Auskunft über die Speichernutzung des Node.js-Prozesses selbst. Um den gesamten Systemspeicher zu überwachen, ist das `os`-Modul mit `os.totalmem()` und `os.freemem()` die richtige Wahl.
*   **Festplattenspeicher:** Hierfür gibt es keine eingebaute Node.js-Funktion, aber zuverlässige Pakete wie `check-disk-space` oder `diskusage` können den freien und gesamten Speicherplatz eines Laufwerks ermitteln.
*   **Netzwerkauslastung:** Dies ist am komplexesten. Pakete wie `node-network-bandwidth-monitor` oder `node-system-stats` können den Netzwerkverkehr überwachen.

### Nächste Schritte

1.  **Backend-Implementierung:**
    *   Wir erstellen ein neues Modul innerhalb der Zenbot-Struktur.
    *   In diesem Modul installieren wir die notwendigen Pakete (`systeminformation` scheint eine gute All-in-One-Lösung zu sein, da es viele der benötigten Metriken abdeckt).
    *   Wir richten einen WebSocket-Server (z.B. mit dem `ws`-Paket) ein, der in einem Intervall von 200 ms die Systemdaten abfragt und an alle verbundenen Clients sendet.

2.  **Frontend-Implementierung:**
    *   Wir identifizieren die relevanten Dateien im Zenbot-Webinterface, um unseren Code hinzuzufügen.
    *   Wir fügen JavaScript-Code hinzu, der eine WebSocket-Verbindung zum Backend aufbaut.
    *   Wir integrieren eine Charting-Bibliothek (z.B. Chart.js) und erstellen Graphen, die sich bei jedem eintreffenden Datenpaket über den WebSocket aktualisieren.

Dies ist ein klar definierter Plan. Wir können nun mit der konkreten Umsetzung beginnen, falls Sie dies wünschen.

---
Sollen wir mit der Implementierung des Backends beginnen, indem wir die notwendigen Abhängigkeiten installieren und den WebSocket-Server aufsetzen? Oder möchten Sie zuerst einen detaillierteren Entwurf für die Benutzeroberfläche im Frontend sehen? Lassen Sie uns gemeinsam den ersten Schritt festlegen.

