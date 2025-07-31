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
