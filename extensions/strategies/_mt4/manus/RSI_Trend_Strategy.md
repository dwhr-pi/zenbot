## 7. RSI-Trend Strategie

**Zenbot-Dateiname:** `RSI_Trend_Strategy.js`

Diese Strategie basiert auf der Idee der relativen Stärke, die im MT4-Indikator **`CM_Strength_TF_M_V1.0.mq4`** verwendet wird. Da die Währungsstärke in Zenbot nicht direkt implementierbar ist, wurde die Strategie auf eine Kombination aus **RSI** (Relative Strength Index) und einem **EMA** (Exponential Moving Average) als Trendfilter reduziert. Sie ist eine **Momentum- und Trendfolgestrategie**.

### Strategie-Logik

Die Strategie nutzt den RSI, um Momentum-Signale zu generieren (Crossover der 50er-Linie) und filtert diese Signale mit einem längeren EMA, um sicherzustellen, dass nur in Richtung des übergeordneten Trends gehandelt wird.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Momentum-Signal:** Der RSI kreuzt die Mittellinie (z.B. 50) von unten nach oben. **UND** |
| | 2. **Aufwärtstrend:** Der aktuelle Preis liegt über dem EMA. |
| **Verkauf (Short)** | 1. **Momentum-Signal:** Der RSI kreuzt die Mittellinie (z.B. 50) von oben nach unten. **UND** |
| | 2. **Abwärtstrend:** Der aktuelle Preis liegt unter dem EMA. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Standard-Zeitrahmen für Trendfolgestrategien. |
| `rsi_periods` | Perioden für den RSI | `14` | Standardwert für den RSI. |
| `ema_periods` | Perioden für den EMA zur Trendfilterung | `50` | Ein mittlerer bis langer EMA zur Bestimmung des übergeordneten Trends. |
| `rsi_center_line` | RSI-Level für das Crossover-Signal | `50` | Die Mittellinie des RSI, die oft als Trendwechselpunkt interpretiert wird. |

**Zenbot-Befehl (Beispiel für RSI-Trend Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=rsi_trend_strategy --period=1h --rsi_periods=14 --ema_periods=50 --rsi_center_line=50
```
