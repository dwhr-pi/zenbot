## 5. Volatility Breakout Strategie

**Zenbot-Dateiname:** `Volatility_Breakout.js`

Diese Strategie basiert auf dem MT4 EA **`forex cash cow - mm.mq4`**. Da die ursprüngliche Logik auf komplexen Limit-Orders und Martingale-Money-Management basiert, die Zenbot nicht nativ unterstützt, wurde sie in eine **Volatilitäts-Breakout-Strategie mit Trendbestätigung** umgewandelt. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie geht davon aus, dass eine Kerze mit ungewöhnlich hoher Volatilität (große Spanne zwischen Hoch und Tief) oft eine Fortsetzung der Bewegung in Richtung des Kerzenschlusses signalisiert, wenn der allgemeine Trend dies bestätigt.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Volatilitäts-Breakout:** Die Spanne der vorherigen Kerze überschreitet einen Schwellenwert (z.B. 0,5% der Mitte). **UND** |
| | 2. **Bullische Explosion:** Die vorherige Kerze schloss höher als sie öffnete. **UND** |
| | 3. **Trendbestätigung:** Der aktuelle Preis liegt über einem kurzfristigen EMA. |
| **Verkauf (Short)** | 1. **Volatilitäts-Breakout:** Die Spanne der vorherigen Kerze überschreitet einen Schwellenwert (z.B. 0,5% der Mitte). **UND** |
| | 2. **Bärische Explosion:** Die vorherige Kerze schloss niedriger als sie öffnete. **UND** |
| | 3. **Trendbestätigung:** Der aktuelle Preis liegt unter einem kurzfristigen EMA. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet, um signifikante Volatilitätsausbrüche zu erfassen. |
| `volatility_threshold` | Mindestvolatilität der Kerze (in %) | `0.5` | Ein guter Startwert, um nur signifikante Ausbrüche zu filtern. Muss je nach Währungspaar/Krypto angepasst werden. |
| `ema_periods` | Perioden für den EMA zur Trendbestätigung | `10` | Ein kurzer EMA, um den unmittelbaren Trend nach dem Ausbruch zu bestätigen. |

**Zenbot-Befehl (Beispiel für Volatility Breakout):**

```bash
zenbot backtest binance.BTC-USDT --strategy=volatility_breakout --period=1h --volatility_threshold=0.5 --ema_periods=10
```
