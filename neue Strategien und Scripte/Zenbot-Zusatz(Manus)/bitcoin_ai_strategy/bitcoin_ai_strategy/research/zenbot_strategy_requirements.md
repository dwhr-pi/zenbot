# Zenbot Strategie-Anforderungen

## Grundlegende Informationen zu Zenbot

Zenbot ist ein Kommandozeilen-basierter Kryptowährungs-Trading-Bot, der Node.js und MongoDB verwendet. Der Bot bietet folgende Funktionen:

- Vollautomatisierter, auf technischer Analyse basierender Trading-Ansatz
- Unterstützung für verschiedene Kryptowährungsbörsen (Binance, Bitfinex, Bitstamp, Bittrex, CEX.IO, GDAX, Gemini, HitBTC, Kraken, Poloniex und TheRockTrading)
- Plugin-Architektur für die Implementierung von Börsenunterstützung oder das Schreiben neuer Strategien
- Simulator für Backtesting von Strategien gegen historische Daten
- "Paper"-Trading-Modus, der mit einem simulierten Guthaben arbeitet, während der Live-Markt beobachtet wird
- Konfigurierbare Verkaufsstopps, Kaufstopps und (nachfolgende) Gewinnstopps
- Flexible Abtastperiode und Handelsfrequenz

## Struktur einer Zenbot-Strategie

Eine Zenbot-Strategie besteht aus einer JavaScript-Datei, die in einem eigenen Verzeichnis unter `extensions/strategies/` gespeichert wird. Die Strategie-Datei muss vier Hauptfunktionen exportieren:

1. **getOptions**: Definiert die Parameter und Variablen, die die Strategie verwendet
2. **calculate**: Wird bei jedem neuen Trade aufgerufen und aktualisiert Indikatoren
3. **onPeriod**: Wird am Ende jeder Periode aufgerufen und sendet Kauf- oder Verkaufssignale
4. **onReport**: Wird aufgerufen, wenn die Konsole aktualisiert wird, und gibt Informationen zurück, die angezeigt werden sollen

### getOptions

Diese Funktion definiert die Parameter, die die Strategie verwendet. Hier werden Standardwerte festgelegt und die Benutzeroberfläche für die Konfiguration der Strategie bereitgestellt.

```javascript
getOptions: function (s) {
  this.option('period', 'period length, same as --period_length', String, '5m')
  this.option('period_length', 'period length, same as --period', String, '5m')
  this.option('min_periods', 'min. number of history periods', Number, 200)
  // Hier weitere Variablen für die Strategie einfügen
}
```

### calculate

Diese Funktion wird bei jedem neuen Trade aufgerufen und ist der richtige Ort, um Indikatoren zu aktualisieren.

```javascript
calculate: function (s) {
  // Beispiel für die Berechnung von MACD
  ema(s, 'ema_short', s.options.ema_short_period)
  ema(s, 'ema_long', s.options.ema_long_period)
  if (s.period.ema_short && s.period.ema_long) {
    s.period.macd = (s.period.ema_short - s.period.ema_long)
    ema(s, 'signal', s.options.signal_period, 'macd')
    if (s.period.signal) {
      s.period.macd_histogram = s.period.macd - s.period.signal
    }
  }
  
  // Oder für RSI
  rsi(s, 'rsi', s.options.rsi_periods)
}
```

### onPeriod

Diese Funktion wird am Ende jeder Periode aufgerufen und ist der richtige Ort, um Kauf- oder Verkaufssignale zu senden.

```javascript
onPeriod: function (s, cb) {
  // Beispiel für Kauf/Verkauf basierend auf RSI
  if (s.period.rsi < 30) {
    s.signal = 'buy'
  }
  else if (s.period.rsi > 70) {
    s.signal = 'sell'
  }
  
  cb()
}
```

### onReport

Diese Funktion wird aufgerufen, wenn die Konsole aktualisiert wird. Sie muss ein Array zurückgeben, und jedes Element in diesem Array wird in der Konsole angezeigt.

```javascript
onReport: function (s) {
  var cols = []
  if (typeof s.period.rsi === 'number') {
    var color = 'grey'
    if (s.period.rsi <= s.options.oversold_rsi) {
      color = 'green'
    }
    if (s.period.rsi >= s.options.overbought_rsi) {
      color = 'red'
    }
    cols.push(z(4, n(s.period.rsi).format('0'), ' ')[color])
  }
  return cols
}
```

## Zugriff auf historische Daten

Zenbot bietet Zugriff auf historische Daten über das `s.lookback`-Array. Jedes Mal, wenn sich die Periode ändert, wird die aktuelle Periode an den Anfang von `s.lookback` gestellt und `s.period` wird zurückgesetzt. So kann man die letzte Periode in `s.lookback[0]` überprüfen, die vorletzte in `s.lookback[1]` usw.

## Integration von AI/ML in Zenbot-Strategien

Für die Integration von künstlicher Intelligenz oder maschinellem Lernen in eine Zenbot-Strategie gibt es mehrere Ansätze:

1. **Externe Modelle**: Trainieren eines ML-Modells extern (z.B. mit TensorFlow.js oder Brain.js) und Integration in die Strategie
2. **Echtzeit-Lernen**: Implementierung von Online-Lernalgorithmen, die sich während des Handels anpassen
3. **Technische Indikatoren mit ML**: Kombination traditioneller technischer Indikatoren mit ML-Vorhersagen
4. **Sentiment-Analyse**: Integration von Marktsentiment-Daten aus externen Quellen

Für eine Bitcoin-AI-Strategie sollten folgende Aspekte berücksichtigt werden:

- Historische Bitcoin-Preisdaten für das Training
- Volatilitätsmuster von Bitcoin
- Marktzyklen und Trends
- Korrelation mit anderen Märkten oder Wirtschaftsindikatoren
- Handelsvolumen und Liquidität

## Best Practices für Zenbot-Strategien

1. **Backtesting**: Ausführliche Tests der Strategie gegen historische Daten vor dem Live-Einsatz
2. **Parameter-Optimierung**: Finden der optimalen Parameter für die Strategie durch Simulation
3. **Risikomanagement**: Implementierung von Stop-Loss und Take-Profit-Mechanismen
4. **Überwachung**: Regelmäßige Überprüfung der Strategie-Performance
5. **Dokumentation**: Ausführliche Dokumentation der Strategie, ihrer Parameter und ihrer Funktionsweise

## Technische Anforderungen für eine Bitcoin-AI-Strategie

1. Node.js-Umgebung für die Ausführung von Zenbot
2. MongoDB für die Datenspeicherung
3. JavaScript-Kenntnisse für die Implementierung der Strategie
4. Mögliche zusätzliche Bibliotheken für ML/AI (TensorFlow.js, Brain.js, etc.)
5. Zugang zu historischen Bitcoin-Preisdaten für Training und Backtesting
