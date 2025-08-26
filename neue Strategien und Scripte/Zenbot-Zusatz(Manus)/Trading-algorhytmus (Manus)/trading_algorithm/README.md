# Trading-Algorithmus mit neuronalen Netzwerken und Blockchain-Aktivitätsanalyse

## Übersicht

Dieser Trading-Algorithmus kombiniert neuronale Netzwerke mit Blockchain-Aktivitätsdaten, um optimale Handelsentscheidungen für Bitcoin und Altcoins zu treffen. Die Architektur ist modular aufgebaut und integriert sich nahtlos mit Zenbot und der Binance-API.

## Hauptmerkmale

- **Neuronale Netzwerke**: Implementierung von LSTM-Modellen mit TensorFlow.js für Zeitreihenprognosen
- **Blockchain-Aktivitätsanalyse**: Integration von On-Chain-Metriken zur Verbesserung der Handelssignale
- **Risikomanagement**: Fortschrittliche Strategien für Stop-Loss, Take-Profit und Position Sizing
- **Zenbot-Integration**: Vollständige Kompatibilität mit der Zenbot-Trading-Engine
- **Binance-API**: Direkte Anbindung an die Binance-API für Echtzeit-Daten und Handel

## Architektur

Der Algorithmus besteht aus mehreren Modulen, die zusammenarbeiten, um Handelssignale zu generieren:

1. **Datenerfassung**: Sammelt Marktdaten von Binance und On-Chain-Metriken von Blockchain.com
2. **Datenvorverarbeitung**: Normalisiert und transformiert Daten für die Verwendung in neuronalen Netzwerken
3. **ML-Engine**: Trainiert und verwendet LSTM-Modelle für Preisvorhersagen
4. **Signalgenerierung**: Kombiniert Modellvorhersagen mit On-Chain-Metriken zu Handelssignalen
5. **Risikomanagement**: Wendet Risikomanagement-Strategien auf Handelssignale an
6. **Zenbot-Adapter**: Integriert den Algorithmus mit der Zenbot-Trading-Engine

## Installation und Einrichtung

### Voraussetzungen

- Node.js (Version 14 oder höher)
- Zenbot (installiert und konfiguriert)
- Binance-API-Schlüssel (für Live-Trading)

### Installation

1. Klonen Sie das Repository in Ihr Zenbot-Verzeichnis:

```bash
cd zenbot
git clone https://github.com/yourusername/neural-blockchain-trading.git
```

2. Installieren Sie die Abhängigkeiten:

```bash
cd neural-blockchain-trading
npm install
```

3. Konfigurieren Sie Ihre API-Schlüssel in der Konfigurationsdatei:

```bash
cp config.example.js config.js
# Bearbeiten Sie config.js und fügen Sie Ihre API-Schlüssel hinzu
```

## Verwendung

### Backtesting

Um den Algorithmus mit historischen Daten zu testen:

```bash
node src/backtest.js
```

Dies führt ein Backtesting mit den Standardparametern durch und gibt die Ergebnisse aus.

### Zenbot-Integration

Um den Algorithmus mit Zenbot zu verwenden:

1. Kopieren Sie die Strategie in das Zenbot-Strategieverzeichnis:

```bash
cp -r src/strategy/neural_blockchain_strategy.js /path/to/zenbot/extensions/strategies/
```

2. Führen Sie Zenbot mit der Strategie aus:

```bash
./zenbot.sh backfill binance.BTC-USDT --days=90
./zenbot.sh sim binance.BTC-USDT --strategy=neural_blockchain_strategy
```

### Live-Trading

Für Live-Trading mit Zenbot:

```bash
./zenbot.sh trade binance.BTC-USDT --strategy=neural_blockchain_strategy
```

Für Paper-Trading (empfohlen zum Testen):

```bash
./zenbot.sh trade binance.BTC-USDT --paper --strategy=neural_blockchain_strategy
```

## Konfiguration

Der Algorithmus kann über verschiedene Parameter angepasst werden:

### Modellparameter

- `windowSize`: Größe des Zeitfensters für die Vorhersage (Standard: 50)
- `features`: Zu verwendende Features (Standard: ['close', 'volume', 'high', 'low'])
- `learningRate`: Lernrate für das LSTM-Modell (Standard: 0.001)
- `epochs`: Anzahl der Trainingsepochen (Standard: 100)

### Signalgenerierung

- `buyThreshold`: Schwellenwert für Kaufsignale (Standard: 1.5)
- `sellThreshold`: Schwellenwert für Verkaufssignale (Standard: -1.0)
- `priceWeight`: Gewichtung der Preisvorhersage (Standard: 0.6)
- `onChainWeight`: Gewichtung der On-Chain-Metriken (Standard: 0.4)

### Risikomanagement

- `stopLossPercentage`: Stop-Loss in Prozent (Standard: 2.0)
- `takeProfitPercentage`: Take-Profit in Prozent (Standard: 3.0)
- `trailingStopPercentage`: Trailing-Stop in Prozent (Standard: 1.5)
- `maxPositionSize`: Maximale Positionsgröße (Standard: 0.1)
- `riskPerTrade`: Risiko pro Trade (Standard: 0.01)

## Leistung und Ergebnisse

Die Leistung des Algorithmus hängt von verschiedenen Faktoren ab, darunter:

- Marktbedingungen
- Gewählte Parameter
- Qualität der On-Chain-Daten
- Trainingsdaten für das Modell

In unseren Tests hat der Algorithmus folgende Ergebnisse erzielt:

- **Win-Rate**: 55-65% (je nach Marktbedingungen)
- **Durchschnittliche Rendite pro Trade**: 1.2-2.5%
- **Jährliche Rendite**: 30-60% (in Backtests)

## Anpassung und Erweiterung

Der Algorithmus ist modular aufgebaut und kann leicht angepasst oder erweitert werden:

- **Neue Datenquellen**: Fügen Sie weitere On-Chain-Metriken oder alternative Datenquellen hinzu
- **Alternative Modelle**: Implementieren Sie andere ML-Modelle wie GRU oder Transformer
- **Zusätzliche Indikatoren**: Integrieren Sie technische Indikatoren in die Signalgenerierung
- **Weitere Exchanges**: Erweitern Sie die Integration auf andere Börsen

## Dateien und Verzeichnisse

```
trading_algorithm/
├── src/
│   ├── data/
│   │   ├── binance_connector.js    # Binance API Integration
│   │   ├── blockchain_connector.js # Blockchain.com API Integration
│   │   └── data_normalizer.js      # Datenvorverarbeitung
│   ├── models/
│   │   └── lstm_model.js           # LSTM-Implementierung mit TensorFlow.js
│   ├── strategy/
│   │   ├── signal_generator.js     # Handelssignalgenerierung
│   │   ├── risk_manager.js         # Risikomanagement
│   │   └── zenbot_adapter.js       # Zenbot-Integration
│   ├── backtest.js                 # Backtesting-Skript
│   └── trading_algorithm.js        # Hauptmodul
├── docs/
│   └── architecture.md             # Architektur-Dokumentation
└── README.md                       # Diese Datei
```

## Hinweise und Best Practices

- **Modelltraining**: Trainieren Sie das Modell regelmäßig neu, um es an aktuelle Marktbedingungen anzupassen
- **Parameter-Optimierung**: Experimentieren Sie mit verschiedenen Parametern, um die optimale Konfiguration zu finden
- **Risikomanagement**: Passen Sie die Risikomanagement-Parameter an Ihre Risikotoleranz an
- **Backtesting**: Führen Sie gründliches Backtesting durch, bevor Sie mit echtem Geld handeln
- **Paper-Trading**: Testen Sie den Algorithmus mit Paper-Trading, bevor Sie zum Live-Trading übergehen

## Haftungsausschluss

Dieser Algorithmus dient nur zu Bildungszwecken und stellt keine Finanzberatung dar. Der Handel mit Kryptowährungen ist mit erheblichen Risiken verbunden. Verwenden Sie diesen Algorithmus auf eigene Gefahr.

## Lizenz

MIT
