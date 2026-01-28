## 14. Impulse Trend Follower Strategie

**Zenbot-Dateiname:** `Impulse_Trend_Follower.js`

Diese Strategie basiert auf dem MT4 EA **`NAS KILLER_PRO_EA 3.0.mq4`**. Sie ist darauf spezialisiert, starke Marktimpulse zu erfassen, indem sie nach einer Reihe von aufeinanderfolgenden Kerzen in die gleiche Richtung sucht, die eine definierte Mindestgröße aufweisen.

### Strategie-Logik

Die Strategie prüft die letzten `row_size` Kerzen. Wenn alle diese Kerzen in die gleiche Richtung schließen (bullisch für Kauf, bärisch für Verkauf) und ihr Körper (Differenz zwischen Open und Close) eine Mindestgröße überschreitet, wird ein Signal generiert.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Die letzten `row_size` Kerzen sind alle bullisch und haben eine Mindestkörpergröße von `min_body_size`. |
| **Verkauf (Short)** | Die letzten `row_size` Kerzen sind alle bärisch und haben eine Mindestkörpergröße von `min_body_size`. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 15m, 1h) | `15m` | Gut geeignet für Intraday-Impulse. |
| `row_size` | Anzahl aufeinanderfolgender Kerzen | `2` | Entspricht dem Standardwert im Original-EA. |
| `min_body_size` | Mindestkörpergröße in Prozent | `0.05` | Filtert kleine, unbedeutende Bewegungen heraus. |

**Zenbot-Befehl (Beispiel für Impulse Trend Follower Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=impulse_trend_follower --period=15m --row_size=2 --min_body_size=0.05
```
