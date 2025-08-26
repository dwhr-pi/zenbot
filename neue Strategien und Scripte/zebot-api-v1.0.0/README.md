# Zebot API - CCXT-kompatible Kryptowährungs-Trading-API

Eine umfassende Javascript-API für den Handel mit Kryptowährungen über CCXT-kompatible Börsen.

## Überblick

Die Zebot API ist eine benutzerfreundliche Wrapper-Bibliothek, die auf der bewährten CCXT-Bibliothek aufbaut und eine vereinfachte Schnittstelle für den Handel mit Kryptowährungen bietet. Sie unterstützt über 100 verschiedene Kryptowährungsbörsen und bietet einheitliche Methoden für Marktdaten, Trading-Operationen und Kontoverwaltung.

## Hauptmerkmale

- **Umfassende Börsenunterstützung**: Unterstützt alle CCXT-kompatiblen Börsen (Binance, Coinbase, Kraken, etc.)
- **Einheitliche API**: Konsistente Schnittstelle für alle unterstützten Börsen
- **Robuste Fehlerbehandlung**: Detaillierte Fehlertypisierung und -behandlung
- **Async/Await-Unterstützung**: Moderne Javascript-Syntax
- **Sandbox-Modus**: Sicheres Testen ohne echte Trades
- **Rate-Limiting**: Automatische Begrenzung der API-Aufrufe
- **Umfassende Dokumentation**: Vollständige API-Referenz und Beispiele

## Schnellstart

### Installation

```bash
npm install
```

### Grundlegende Verwendung

```javascript
const ZebotAPI = require('./zebot_api');

// Erstelle eine API-Instanz für Binance
const api = new ZebotAPI('binance');

// Lade Märkte
const markets = await api.loadMarkets();

// Hole Ticker-Daten
const ticker = await api.fetchTicker('BTC/USDT');
console.log('BTC Preis:', ticker.data.last);
```

### Authentifizierte Operationen

```javascript
const api = new ZebotAPI('binance', 'your_api_key', 'your_secret');

// Hole Kontoguthaben
const balance = await api.fetchBalance();

// Erstelle eine Limit-Order
const order = await api.createOrder('BTC/USDT', 'limit', 'buy', 0.001, 50000);
```

## Unterstützte Börsen

Die API unterstützt alle CCXT-kompatiblen Börsen, einschließlich:

- Binance
- Coinbase Pro
- Kraken
- Bitfinex
- Huobi
- OKX
- KuCoin
- Und viele mehr...

Eine vollständige Liste erhalten Sie mit:

```javascript
console.log(ZebotAPI.getAvailableExchanges());
```

## Projektstruktur

```
zebot-api/
├── zebot_api.js          # Haupt-API-Klasse
├── examples.js           # Verwendungsbeispiele
├── package.json          # NPM-Konfiguration
├── README.md             # Diese Datei
├── docs/
│   ├── api-reference.md  # Vollständige API-Referenz
│   ├── installation.md   # Installationsanleitung
│   └── examples.md       # Detaillierte Beispiele
└── node_modules/         # Abhängigkeiten
```

## Dokumentation

- [API-Referenz](docs/api-reference.md) - Vollständige Methodendokumentation
- [Installation](docs/installation.md) - Detaillierte Installationsanleitung
- [Beispiele](docs/examples.md) - Umfassende Verwendungsbeispiele

## Beispiele ausführen

```bash
node examples.js
```

## Lizenz

MIT License

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie das Entwicklungsteam.

## Beitragen

Beiträge sind willkommen! Bitte lesen Sie die Beitragsrichtlinien vor dem Einreichen von Pull Requests.

---

**Entwickelt von Manus AI** - Eine moderne, benutzerfreundliche API für Kryptowährungs-Trading.

