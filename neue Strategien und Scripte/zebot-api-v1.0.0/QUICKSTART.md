# Zebot API v1.0.0 - Schnellstart

Willkommen bei der Zebot API! Diese Anleitung hilft Ihnen beim schnellen Einstieg.

## 🚀 Installation

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **API testen:**
   ```bash
   node test.js
   ```

3. **Beispiele ausführen:**
   ```bash
   node examples.js
   ```

## 📖 Erste Schritte

### Einfaches Beispiel
```javascript
const ZebotAPI = require('./zebot_api');

// Erstelle API-Instanz
const api = new ZebotAPI('coinbase');

// Hole Bitcoin-Preis
const ticker = await api.fetchTicker('BTC/USD');
if (ticker.success) {
    console.log('BTC Preis:', ticker.data.last);
}
```

### Mit Authentifizierung
```javascript
const api = new ZebotAPI('coinbase', 'your_api_key', 'your_secret');

// Hole Kontoguthaben
const balance = await api.fetchBalance();
if (balance.success) {
    console.log('Guthaben:', balance.data.total);
}
```

## 📚 Dokumentation

- **[API-Referenz](docs/api-reference.md)** - Vollständige Methodendokumentation
- **[Installation](docs/installation.md)** - Detaillierte Installationsanleitung  
- **[Beispiele](docs/examples.md)** - Umfassende Beispielsammlung
- **[Changelog](CHANGELOG.md)** - Versionshistorie

## 🔧 Verfügbare Dateien

- `zebot_api.js` - Haupt-API-Klasse
- `examples.js` - Praktische Beispiele
- `test.js` - Test-Suite
- `package.json` - NPM-Konfiguration

## 🌟 Features

- ✅ 106+ unterstützte Börsen
- ✅ Einheitliche API für alle Börsen
- ✅ Robuste Fehlerbehandlung
- ✅ Sandbox-Modus für Tests
- ✅ Umfassende Dokumentation

## 🆘 Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Dokumentation in `docs/`
2. Führen Sie `node test.js` aus
3. Kontaktieren Sie den Support

---

**Entwickelt von Manus AI** | **Version 1.0.0** | **MIT License**

