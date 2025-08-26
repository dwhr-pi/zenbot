# Zenbot Multi-Trading Dokumentation

## Übersicht

Zenbot Multi-Trading ist eine Erweiterung für Zenbot, die es ermöglicht, mehrere Kryptowährungen gleichzeitig mit individuellen Strategien auf verschiedenen Börsen zu handeln. Diese Dokumentation beschreibt die Installation, Konfiguration und Verwendung des Multi-Trading-Systems.

## Funktionen

- **Paralleles Trading mehrerer Coins**: Handeln Sie verschiedene Kryptowährungen gleichzeitig
- **Individuelle Strategien pro Coin**: Konfigurieren Sie für jeden Coin eine eigene Trading-Strategie
- **Paralleler Börsenbetrieb**: Nutzen Sie mehrere Börsen gleichzeitig
- **Coin-Zuweisung zu Börsen**: Weisen Sie bestimmte Coins spezifischen Börsen zu
- **Zentrales Monitoring**: Überwachen Sie alle Trading-Aktivitäten an einem Ort
- **Robuste Fehlerbehandlung**: Isolierte Fehlerbehandlung für jede Trading-Instanz

## Installation

1. Stellen Sie sicher, dass Node.js (Version 8.3.0 oder höher) installiert ist
2. Klonen Sie das Zenbot Multi-Trading Repository:
   ```
   git clone https://github.com/yourusername/zenbot-multitrading.git
   cd zenbot-multitrading
   ```
3. Führen Sie das Installationsskript aus:
   ```
   chmod +x install.sh
   ./install.sh
   ```

## Konfiguration

Die Konfiguration erfolgt über die Datei `config/multi_trading.json`. Diese Datei wird automatisch erstellt, wenn sie nicht existiert.

### Beispielkonfiguration

```json
{
  "instances": [
    {
      "exchange": "binance",
      "coin": "BTC",
      "strategy": "macd_cross",
      "apiKey": "your_api_key",
      "apiSecret": "your_api_secret",
      "strategyParams": {
        "fastPeriod": 12,
        "slowPeriod": 26,
        "signalPeriod": 9,
        "upThreshold": 0.1,
        "downThreshold": -0.1
      },
      "riskParams": {
        "maxPositionSize": 0.05,
        "maxOpenPositions": 3,
        "maxDailyLoss": 0.03
      }
    },
    {
      "exchange": "kraken",
      "coin": "ETH",
      "strategy": "rsi",
      "apiKey": "your_api_key",
      "apiSecret": "your_api_secret",
      "strategyParams": {
        "period": 14,
        "overbought": 70,
        "oversold": 30
      },
      "riskParams": {
        "maxPositionSize": 0.03,
        "maxOpenPositions": 2,
        "maxDailyLoss": 0.02
      }
    }
  ],
  "globalSettings": {
    "maxParallelInstances": 10,
    "defaultRiskParams": {
      "maxPositionSize": 0.05,
      "maxOpenPositions": 3,
      "maxDailyLoss": 0.03
    },
    "logLevel": "info",
    "monitoringInterval": 60000
  }
}
```

### Konfigurationsparameter

#### Instanz-Konfiguration

- **exchange**: Name der Börse (z.B. binance, kraken, coinbase)
- **coin**: Kryptowährung (z.B. BTC, ETH, LTC)
- **strategy**: Name der Trading-Strategie (z.B. macd_cross, rsi, bollinger_bands)
- **apiKey**: API-Schlüssel für die Börse
- **apiSecret**: API-Secret für die Börse
- **strategyParams**: Parameter für die Trading-Strategie (abhängig von der gewählten Strategie)
- **riskParams**: Risikomanagement-Parameter
  - **maxPositionSize**: Maximale Positionsgröße pro Trade (als Anteil des verfügbaren Kapitals)
  - **maxOpenPositions**: Maximale Anzahl offener Positionen
  - **maxDailyLoss**: Maximaler täglicher Verlust (als Anteil des verfügbaren Kapitals)

#### Globale Einstellungen

- **maxParallelInstances**: Maximale Anzahl paralleler Trading-Instanzen
- **defaultRiskParams**: Standard-Risikomanagement-Parameter für alle Instanzen
- **logLevel**: Log-Level (debug, info, warn, error)
- **monitoringInterval**: Intervall für das Monitoring in Millisekunden

## Verwendung

### Starten des Multi-Trading-Managers

```
node multi_trading.js start
```

Optionen:
- `--log-level <level>`: Log-Level (debug, info, warn, error), Standard: info

### Stoppen des Multi-Trading-Managers

```
node multi_trading.js stop
```

### Hinzufügen einer Trading-Instanz

```
node multi_trading.js add <exchange> <coin> <strategy> [options]
```

Optionen:
- `--api-key <key>`: API-Schlüssel für die Börse
- `--api-secret <secret>`: API-Secret für die Börse
- `--strategy-params <params>`: Strategie-Parameter als JSON-String
- `--risk-params <params>`: Risiko-Parameter als JSON-String

Beispiel:
```
node multi_trading.js add binance BTC macd_cross --api-key your_api_key --api-secret your_api_secret --strategy-params '{"fastPeriod":12,"slowPeriod":26,"signalPeriod":9}' --risk-params '{"maxPositionSize":0.05,"maxOpenPositions":3,"maxDailyLoss":0.03}'
```

### Entfernen einer Trading-Instanz

```
node multi_trading.js remove <instanceId>
```

Die Instanz-ID setzt sich zusammen aus `<exchange>_<coin>_<strategy>`.

Beispiel:
```
node multi_trading.js remove binance_BTC_macd_cross
```

### Anzeigen der Statistiken

```
node multi_trading.js stats
```

### Ausführen des Integrationstests

```
node multi_trading.js test
```

## Unterstützte Strategien

### MACD Cross

Die MACD Cross-Strategie basiert auf dem Moving Average Convergence Divergence (MACD) Indikator und generiert Kauf- und Verkaufssignale, wenn der MACD-Histogram bestimmte Schwellenwerte überschreitet.

Parameter:
- **fastPeriod**: Periode für den schnellen EMA (Standard: 12)
- **slowPeriod**: Periode für den langsamen EMA (Standard: 26)
- **signalPeriod**: Periode für die Signal-Linie (Standard: 9)
- **upThreshold**: Schwellenwert für Kaufsignale (Standard: 0)
- **downThreshold**: Schwellenwert für Verkaufssignale (Standard: 0)

### RSI

Die RSI-Strategie basiert auf dem Relative Strength Index (RSI) und generiert Kauf- und Verkaufssignale, wenn der RSI bestimmte Schwellenwerte überschreitet.

Parameter:
- **period**: Periode für den RSI (Standard: 14)
- **overbought**: Schwellenwert für überkaufte Bedingungen (Standard: 70)
- **oversold**: Schwellenwert für überverkaufte Bedingungen (Standard: 30)

### Bollinger Bands

Die Bollinger Bands-Strategie generiert Kauf- und Verkaufssignale, wenn der Preis die oberen oder unteren Bollinger Bands berührt oder durchbricht.

Parameter:
- **period**: Periode für den SMA (Standard: 20)
- **stdDev**: Anzahl der Standardabweichungen (Standard: 2)

## Unterstützte Börsen

Das Multi-Trading-System unterstützt alle Börsen, die von der CCXT-Bibliothek unterstützt werden, darunter:

- Binance
- Kraken
- Coinbase Pro
- Bitfinex
- Bitstamp
- und viele mehr

Eine vollständige Liste der unterstützten Börsen finden Sie in der [CCXT-Dokumentation](https://github.com/ccxt/ccxt/wiki/Exchange-Markets).

## Fehlerbehandlung

### Häufige Probleme

1. **API-Schlüssel ungültig**: Stellen Sie sicher, dass Ihre API-Schlüssel korrekt sind und die erforderlichen Berechtigungen haben.
2. **Rate-Limit überschritten**: Reduzieren Sie die Anzahl der API-Aufrufe oder erhöhen Sie das Intervall zwischen den Aufrufen.
3. **Unzureichendes Guthaben**: Stellen Sie sicher, dass Sie über ausreichend Guthaben auf der Börse verfügen.
4. **Strategie-Parameter ungültig**: Überprüfen Sie die Parameter für Ihre Trading-Strategie.

### Logs

Die Logs werden im Verzeichnis `logs` gespeichert. Für jedes Log-Level (debug, info, warn, error) wird eine separate Datei erstellt.

## Erweiterung

### Hinzufügen einer neuen Strategie

Um eine neue Strategie hinzuzufügen, erstellen Sie eine neue Klasse im `src/strategies`-Verzeichnis und implementieren Sie die erforderlichen Methoden:

```javascript
class MyStrategy {
  constructor(params) {
    // Initialisierung der Strategie-Parameter
  }
  
  async evaluate(data, indicators) {
    // Auswertung der Marktdaten und Generierung von Handelssignalen
  }
  
  getRequiredIndicators() {
    // Rückgabe der benötigten Indikatoren
  }
}
```

### Hinzufügen einer neuen Börse

Das Multi-Trading-System verwendet die CCXT-Bibliothek für die Kommunikation mit den Börsen. Wenn Sie eine neue Börse hinzufügen möchten, die von CCXT unterstützt wird, müssen Sie keine Änderungen am Code vornehmen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die LICENSE-Datei für Details.
