## 8. Triple-Confirmation Strategie

**Zenbot-Dateiname:** `Triple_Confirmation.js`

Diese Strategie basiert auf der Logik des MT4-Indikators **`Super-arrow-indicator.mq4`**, der ein Signal erst dann generiert, wenn mehrere Indikatoren übereinstimmen. Die Zenbot-Strategie verwendet eine Kombination aus **EMA Crossover** (Trend), **RSI Crossover** (Momentum) und **Bollinger Bändern** (Volatilität/Umkehr) als Filter. Sie ist eine **hochgradig gefilterte Trendfolgestrategie**.

### Strategie-Logik

Die Strategie erfordert die gleichzeitige Bestätigung durch alle drei Indikatoren, um ein Signal zu generieren. Dies soll die Anzahl der Fehlsignale reduzieren.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Trend (EMA):** Schneller EMA kreuzt langsamen EMA von unten nach oben. **UND** |
| | 2. **Momentum (RSI):** RSI kreuzt die 50er-Linie von unten nach oben. **UND** |
| | 3. **Umkehrfilter (BB):** Der Preis liegt am oder unter dem unteren Bollinger Band (Überverkauft). |
| **Verkauf (Short)** | 1. **Trend (EMA):** Schneller EMA kreuzt langsamen EMA von oben nach unten. **UND** |
| | 2. **Momentum (RSI):** RSI kreuzt die 50er-Linie von oben nach unten. **UND** |
| | 3. **Umkehrfilter (BB):** Der Preis liegt am oder über dem oberen Bollinger Band (Überkauft). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet für Multi-Indikator-Strategien. |
| `ema_fast` | Perioden für den schnellen EMA | `5` | Entspricht dem `FasterMovingAverage` im Original-Indikator. |
| `ema_slow` | Perioden für den langsamen EMA | `12` | Entspricht dem `SlowerMovingAverage` im Original-Indikator. |
| `rsi_periods` | Perioden für den RSI | `12` | Entspricht dem `RSIPeriod` im Original-Indikator. |
| `bb_periods` | Perioden für Bollinger Bänder | `10` | Entspricht dem `BollingerbandsPeriod` im Original-Indikator. |
| `bb_devs` | Standardabweichungen für Bollinger Bänder | `0.5` | Entspricht dem `BollingerbandsDeviation` im Original-Indikator. |

**Zenbot-Befehl (Beispiel für Triple-Confirmation Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=triple_confirmation --period=1h --ema_fast=5 --ema_slow=12 --rsi_periods=12 --bb_periods=10 --bb_devs=0.5
```
