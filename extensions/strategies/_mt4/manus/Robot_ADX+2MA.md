## 1. ADX-EMA Crossover Strategie

**Zenbot-Dateiname:** `Robot_ADX+2MA.js`

Diese Strategie basiert auf dem MT4 EA `Robot_ADX+2MA.mq4` und kombiniert zwei Exponentielle Gleitende Durchschnitte (EMA) mit dem Average Directional Index (ADX) zur Trendbestätigung. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie zielt darauf ab, in Richtung eines etablierten Trends zu handeln, der durch den Crossover der EMAs und die Stärke des ADX bestätigt wird.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. Der kurze EMA liegt über dem langen EMA (Aufwärtstrend). **UND** |
| | 2. Der ADX-Wert liegt über einem bestimmten Schwellenwert (z.B. 25), was einen starken Trend anzeigt. **UND** |
| | 3. Der positive Richtungsindikator (+DI) liegt deutlich über dem negativen Richtungsindikator (-DI), was die Aufwärtsrichtung bestätigt. |
| **Verkauf (Short)** | 1. Der kurze EMA liegt unter dem langen EMA (Abwärtstrend). **UND** |
| | 2. Der ADX-Wert liegt über einem bestimmten Schwellenwert (z.B. 25), was einen starken Trend anzeigt. **UND** |
| | 3. Der negative Richtungsindikator (-DI) liegt deutlich über dem positiven Richtungsindikator (+DI), was die Abwärtsrichtung bestätigt. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

Die folgenden Werte sind optimierte Startpunkte, die auf der Logik des ursprünglichen MT4-Codes basieren. Für eine optimale Performance auf einem spezifischen Markt (z.B. BTC/USD) und Zeitrahmen ist ein **Backtesting** mit Zenbot erforderlich.

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Bietet ein gutes Gleichgewicht zwischen schnellen Signalen und der Filterung von Markt-Rauschen. |
| `ema_short_periods` | Perioden für den kurzen EMA | `5` | Entspricht der schnellen Linie im Original-EA. |
| `ema_long_periods` | Perioden für den langen EMA | `12` | Entspricht der langsamen Linie im Original-EA. |
| `adx_periods` | Perioden für die ADX-Berechnung | `6` | Entspricht der Sensitivität im Original-EA. |
| `adx_threshold` | Mindestwert für ADX zur Trendbestätigung | `25` | Ein höherer Wert (über 20) signalisiert einen starken, handelbaren Trend. |
| `di_threshold` | Mindestdifferenz zwischen +DI und -DI | `5` | Stellt sicher, dass die Richtung klar dominiert. |
