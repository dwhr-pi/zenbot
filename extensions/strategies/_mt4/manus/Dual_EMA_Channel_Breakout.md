## 6. Dual-EMA Channel Breakout Strategie

**Zenbot-Dateiname:** `Dual_EMA_Channel_Breakout.js`

Diese Strategie basiert auf dem MT4-Indikator **`ProFx02.mq4`**, der einen dynamischen Kanal aus mehreren gleitenden Durchschnitten bildet. Die Zenbot-Strategie vereinfacht dies zu einem **Dual-EMA-System**, das Signale generiert, wenn der Preis den durch die EMAs definierten Kanal durchbricht. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie verwendet zwei EMAs (einen schnellen und einen langsamen), um den Trend zu bestimmen und einen dynamischen Kanal zu definieren. Ein Handel wird eingegangen, wenn der Preis den Kanal in Trendrichtung durchbricht.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Aufwärtstrend:** Der schnelle EMA liegt über dem langsamen EMA. **UND** |
| | 2. **Breakout:** Der aktuelle Schlusskurs liegt über der oberen Kanallinie (langsamer EMA + Breite). |
| **Verkauf (Short)** | 1. **Abwärtstrend:** Der schnelle EMA liegt unter dem langsamen EMA. **UND** |
| | 2. **Breakout:** Der aktuelle Schlusskurs liegt unter der unteren Kanallinie (langsamer EMA - Breite). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet für Trendfolge-Strategien. |
| `ema_short_periods` | Perioden für den schnellen EMA | `15` | Basierend auf dem `g_period_80` des Original-Indikators. |
| `ema_long_periods` | Perioden für den langsamen EMA | `30` | Dient als Basis für den Kanal und zur Trendfilterung. |
| `channel_width_factor` | Faktor zur Bestimmung der Kanalbreite (z.B. 0.001 = 0.1%) | `0.001` | Ein Startwert, der die Kanalbreite als Prozentsatz des Preises definiert. Muss optimiert werden. |

**Zenbot-Befehl (Beispiel für Dual-EMA Channel Breakout):**

```bash
zenbot backtest binance.BTC-USDT --strategy=dual_ema_channel_breakout --period=1h --ema_short_periods=15 --ema_long_periods=30 --channel_width_factor=0.001
```
