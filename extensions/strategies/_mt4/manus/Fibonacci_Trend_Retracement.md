## 12. Fibonacci Trend Retracement Strategie

**Zenbot-Dateiname:** `Fibonacci_Trend_Retracement.js`

Diese Strategie basiert auf dem MT4 EA **`EA RoboFibo v.11.2.mq4`**. Sie nutzt **Fibonacci-Retracements**, um Einstiegspunkte während Korrekturen in einem bestehenden Trend zu identifizieren. Zur Trendbestimmung wird ein EMA (Exponential Moving Average) und zur Momentum-Filterung der RSI (Relative Strength Index) verwendet.

### Strategie-Logik

Die Strategie berechnet die Fibonacci-Levels (0%, 23.6%, 38.2%, 50%, 61.8%, 76.4%, 100%) basierend auf der Preisspanne der letzten `bars_back` Kerzen. Ein Signal wird generiert, wenn der Preis in einem Aufwärtstrend auf ein Fibonacci-Level zurückfällt oder in einem Abwärtstrend auf ein Level ansteigt.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Aufwärtstrend:** Preis liegt über dem EMA. **UND** |
| | 2. **Retracement:** Preis fällt auf oder unter das 38.2% Fibonacci-Level zurück. **UND** |
| | 3. **Momentum:** RSI ist nicht überkauft (RSI < 60). |
| **Verkauf (Short)** | 1. **Abwärtstrend:** Preis liegt unter dem EMA. **UND** |
| | 2. **Retracement:** Preis steigt auf oder über das 61.8% Fibonacci-Level an. **UND** |
| | 3. **Momentum:** RSI ist nicht überverkauft (RSI > 40). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Fibonacci-Levels sind auf höheren Zeitrahmen oft aussagekräftiger. |
| `bars_back` | Anzahl der Kerzen für Fibo-Berechnung | `20` | Entspricht dem Standardwert im Original-EA. |
| `ema_period` | Perioden für den Trend-EMA | `60` | Entspricht dem `maperiod` im Original-EA. |
| `rsi_period` | Perioden für den RSI-Filter | `14` | Standardwert für den RSI. |

**Zenbot-Befehl (Beispiel für Fibonacci Trend Retracement Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=fibo_trend_retracement --period=1h --bars_back=20 --ema_period=60 --rsi_period=14
```
