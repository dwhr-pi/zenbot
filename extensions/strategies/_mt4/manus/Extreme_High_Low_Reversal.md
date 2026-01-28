## 17. Extreme High/Low Reversal Strategie

**Zenbot-Dateiname:** `Extreme_High_Low_Reversal.js`

Diese Strategie basiert auf dem MT4 Indikator **`super_signal.mq4`**. Sie ist eine **Umkehrstrategie**, die darauf setzt, dass der Preis nach Erreichen eines neuen Extremwerts (Hoch oder Tief) innerhalb eines bestimmten Zeitfensters erschöpft ist und eine Gegenbewegung einleitet.

### Strategie-Logik

Die Strategie überwacht ein gleitendes Zeitfenster von `window_size` Kerzen. Wenn die aktuelle Kerze das absolute Hoch oder Tief dieses Fensters markiert, wird ein entsprechendes Umkehrsignal generiert.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Das Tief der aktuellen Kerze ist das niedrigste Tief der letzten `window_size` Kerzen. |
| **Verkauf (Short)** | Das Hoch der aktuellen Kerze ist das höchste Hoch der letzten `window_size` Kerzen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Extrema sind auf höheren Zeitrahmen aussagekräftiger. |
| `window_size` | Größe des Lookback-Fensters | `24` | Entspricht dem Standardwert im Original-Indikator. |

**Zenbot-Befehl (Beispiel für Extreme High/Low Reversal Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=extreme_high_low_reversal --period=1h --window_size=24
```
