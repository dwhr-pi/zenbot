# Zenbot Dashboard Erweiterung: Terminalsteuerung über `dashboard.ejs`

Dieses Tutorial zeigt dir, wie du das Zenbot-Web-Dashboard (`dashboard.ejs`) erweiterst, um über das Frontend Terminalbefehle auszuführen – z. B. um alle verfügbaren Coins einer Börse (wie Binance) aufzulisten.

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
