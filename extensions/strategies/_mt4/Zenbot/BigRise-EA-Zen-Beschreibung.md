# Zenbot Strategie: BigRise-EA-Zen (Adaptierte Version)

## 1. Strategiebeschreibung

Die Strategie **BigRise-EA-Zen** ist eine für Zenbot adaptierte Version des ursprünglichen MT4 Expert Advisors "BigRise EA". Der ursprüngliche EA basierte auf einer **Multi-Währungs-Korrelationsanalyse** (5 Währungspaare) und einer **Martingale-Grid-Logik**.

Da Zenbot primär für den Handel mit Kryptowährungen auf einem einzelnen Marktpaar konzipiert ist und keine nativen Grid- oder Multi-Währungs-Funktionen bietet, wurde die Kernidee in eine Zenbot-kompatible Momentum-Strategie überführt.

Die Strategie zielt darauf ab, **starke Momentum-Bewegungen** zu identifizieren und in deren Richtung zu handeln.

### Kernlogik

1.  **Momentum-Filter (Ersatz für Multi-Währungs-Korrelation):** Die Strategie prüft, ob die letzte abgeschlossene Kerze eine **Mindestgröße** (`min_pips_filter`) überschritten hat und eine **klare Richtung** (bullish oder bearish) aufweist. Dies simuliert die ursprüngliche Logik, die nur bei starker, koordinierter Marktbewegung handelte.
2.  **Handelssignal:** Ein Kauf-Signal (`buy`) wird ausgelöst, wenn die Kerze groß und bullish ist. Ein Verkaufs-Signal (`sell`) wird ausgelöst, wenn die Kerze groß und bearish ist.
3.  **Martingale-Anpassung:** Nach einem **verlustreichen Trade** wird die Lot-Größe für den nächsten Trade um den Faktor `martingale_factor` erhöht. Nach einem Gewinn wird der Faktor zurückgesetzt. **Achtung:** Die Martingale-Strategie ist mit einem **hohen Risiko** verbunden und sollte nur mit Bedacht eingesetzt werden.

## 2. Empfohlene Einstellungswerte (Zenbot-Konfiguration)

Die folgenden Einstellungen sind als Startpunkt für das Backtesting gedacht. Optimale Werte hängen stark vom gehandelten Paar und dem Zeitrahmen ab.

| Parameter | Beschreibung | Typ | Empfohlener Wert |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1m, 5m, 15m) | String | `1m` |
| `min_pips_filter` | Mindest-Pips-Bewegung des letzten Bars als Filter (entspricht MinPips) | Number | `5` |
| `martingale_factor` | Faktor zur Erhöhung der Lot-Größe nach einem Verlust (1.0 = keine Erhöhung) | Number | `1.2` |

### Beispiel für die Zenbot-Befehlszeile (Backtesting)

```bash
./zenbot.sh backfill --days 7 ETH-USD
./zenbot.sh backtest ETH-USD --strategy=bigrise-ea-zen --period=1m --min_pips_filter=5 --martingale_factor=1.2
```

## 3. Implementierungsdetails (strategy.js)

Die Logik ist in der Datei `BigRise-EA-Zen.js` implementiert.

```javascript
// Auszug aus BigRise-EA-Zen.js
// ...
    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()

      var current_bar = s.period

      // 1. Momentum-Check (vereinfachte Version der Korrelations- und Momentum-Logik)
      var bar_size_pips = Math.abs(current_bar.close - current_bar.open) / s.exchange.asset.tick_size * 10000 

      // Prüfe, ob die Bewegung groß genug ist (MinPips-Filter)
      if (bar_size_pips < s.options.min_pips_filter) {
        s.signal = null
        return cb()
      }

      var is_bullish = current_bar.close > current_bar.open
      var is_bearish = current_bar.close < current_bar.open

      // 2. Martingale-Logik (Lot-Größe anpassen)
      var lot_size_factor = 1.0
      if (s.options.martingale_factor > 1.0) {
        if (s.last_trade && s.last_trade.profit < 0) {
          lot_size_factor = s.options.martingale_factor
        } else {
          lot_size_factor = 1.0
        }
      }
      s.options.size = s.options.size * lot_size_factor

      // 3. Handelssignal
      if (is_bullish && !s.acted_on_this_period) {
        s.signal = 'buy'
      } else if (is_bearish && !s.acted_on_this_period) {
        s.signal = 'sell'
      }

      cb()
    },
// ...
```
