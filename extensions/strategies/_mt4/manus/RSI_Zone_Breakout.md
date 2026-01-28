## 13. RSI Zone Breakout Strategie

**Zenbot-Dateiname:** `RSI_Zone_Breakout.js`

Diese Strategie basiert auf der Einstiegslogik des MT4 EA **`OGT Zone Recovery EA v1.5.1.mq4`**. Sie nutzt den **RSI (Relative Strength Index)**, um überkaufte und überverkaufte Zonen zu identifizieren, und generiert Signale, wenn der Preis aus diesen Zonen ausbricht (Mean Reversion). Zur Bewertung der Marktsituation wird zusätzlich der **ATR (Average True Range)** herangezogen.

### Strategie-Logik

Die Strategie wartet darauf, dass der RSI in eine extreme Zone (über 70 oder unter 30) eintritt und diese dann wieder verlässt. Dies signalisiert eine mögliche Erschöpfung des Trends und den Beginn einer Korrektur oder Umkehr.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der RSI war in der vorherigen Periode unter oder gleich 30 (überverkauft) und ist in der aktuellen Periode über 30 gestiegen. |
| **Verkauf (Short)** | Der RSI war in der vorherigen Periode über oder gleich 70 (überkauft) und ist in der aktuellen Periode unter 70 gefallen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 15m, 30m) | `15m` | Entspricht den bevorzugten Zeitrahmen im Original-EA. |
| `rsi_periods` | Perioden für den RSI | `14` | Standardwert für den RSI. |
| `overbought` | RSI-Level für überkauft | `70` | Standardwert für Trendumkehrungen. |
| `oversold` | RSI-Level für überverkauft | `30` | Standardwert für Trendumkehrungen. |

**Zenbot-Befehl (Beispiel für RSI Zone Breakout Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=rsi_zone_breakout --period=15m --rsi_periods=14 --overbought=70 --oversold=30
```
