# Zenbot Strategie: Fast-Scalper-Zen (Adaptierte Version)

## 1. Strategiebeschreibung

Die Strategie **Fast-Scalper-Zen** ist eine für Zenbot adaptierte Version des ursprünglichen MT4 Expert Advisors "Fast Scalper". Der ursprüngliche EA nutzte eine **Breakout-Strategie** mit **Pending Orders** (BuyStop und SellStop), die knapp außerhalb des High/Low der vorherigen Kerze platziert wurden.

Da Zenbot keine Pending Orders unterstützt, wurde die Logik auf eine **Market Order Breakout-Strategie** umgestellt.

### Kernlogik

1.  **Breakout-Erkennung:** Die Strategie berechnet zwei Schwellenwerte: einen Kauf-Schwellenwert (oberhalb des High der letzten Kerze) und einen Verkaufs-Schwellenwert (unterhalb des Low der letzten Kerze). Die Distanz wird durch den Parameter `breakout_percent` bestimmt.
2.  **Handelssignal:**
    *   Ein Kauf-Signal (`buy`) wird ausgelöst, wenn der aktuelle Kurs den **Kauf-Schwellenwert überschreitet**.
    *   Ein Verkaufs-Signal (`sell`) wird ausgelöst, wenn der aktuelle Kurs den **Verkaufs-Schwellenwert unterschreitet**.
3.  **Risikomanagement:** Die Zenbot-Strategie verwendet die Parameter `stop_loss_percent` und `profit_target_percent`, um das Risikomanagement des ursprünglichen EAs (StopLoss, MaxStopLoss, Trailing Stop) zu simulieren.

## 2. Empfohlene Einstellungswerte (Zenbot-Konfiguration)

Die folgenden Einstellungen sind als Startpunkt für das Backtesting gedacht. Optimale Werte hängen stark vom gehandelten Paar und dem Zeitrahmen ab.

| Parameter | Beschreibung | Typ | Empfohlener Wert |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1m, 5m, 15m) | String | `1m` |
| `breakout_percent` | Prozentuale Distanz vom High/Low der letzten Kerze für den Breakout (entspricht PipsStep) | Number | `0.05` |
| `stop_loss_percent` | Stop Loss in Prozent des Kaufpreises (simuliert StopLoss/MaxStopLoss) | Number | `1.0` |
| `profit_target_percent` | Take Profit in Prozent des Kaufpreises (simuliert Trailing Stop Ziel) | Number | `0.5` |

### Beispiel für die Zenbot-Befehlszeile (Backtesting)

```bash
./zenbot.sh backfill --days 7 ETH-USD
./zenbot.sh backtest ETH-USD --strategy=fast-scalper-zen --period=1m --breakout_percent=0.05 --stop_loss_percent=1.0 --profit_target_percent=0.5
```

## 3. Implementierungsdetails (strategy.js)

Die Logik ist in der Datei `Fast-Scalper-Zen.js` implementiert.

```javascript
// Auszug aus Fast-Scalper-Zen.js
// ...
    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()

      var last_bar = s.lookback[0]
      var current_bar = s.period

      if (!last_bar) return cb()

      // Berechne die Breakout-Schwellen basierend auf dem High/Low der letzten Kerze
      var breakout_delta = last_bar.close * (s.options.breakout_percent / 100)
      var buy_threshold = last_bar.high + breakout_delta
      var sell_threshold = last_bar.low - breakout_delta

      // Breakout-Logik (ersetzt Pending Orders)
      if (current_bar.close > buy_threshold) {
        s.signal = 'buy'
        s.options.stop_loss = s.options.stop_loss_percent
        s.options.profit_target = s.options.profit_target_percent
      }
      else if (current_bar.close < sell_threshold) {
        s.signal = 'sell'
        s.options.stop_loss = s.options.stop_loss_percent
        s.options.profit_target = s.options.profit_target_percent
      }
      else {
        s.signal = null
      }

      cb()
    },
// ...
```
