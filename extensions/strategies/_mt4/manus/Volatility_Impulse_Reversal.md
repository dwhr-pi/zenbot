## 15. Volatility Impulse Reversal Strategie

**Zenbot-Dateiname:** `Volatility_Impulse_Reversal.js`

Diese Strategie basiert auf dem MT4 EA **`SkyUp EA.mq4`**. Sie ist eine **Mean-Reversion-Strategie**, die darauf setzt, dass extreme Preisbewegungen innerhalb einer einzelnen Kerze oft übertrieben sind und eine baldige Korrektur (Umkehr) folgt.

### Strategie-Logik

Die Strategie berechnet die durchschnittliche Größe (High bis Low) der letzten `avg_bars` Kerzen. Ein Signal wird generiert, wenn die aktuelle Kerze (Open bis Close) eine Größe erreicht, die den Durchschnitt um den Faktor `exp_factor` übersteigt.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Die aktuelle Kerze ist bärisch (Open > Close) und ihr Körper ist größer als `Durchschnittsgröße * exp_factor`. |
| **Verkauf (Short)** | Die aktuelle Kerze ist bullisch (Close > Open) und ihr Körper ist größer als `Durchschnittsgröße * exp_factor`. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Impulse sind auf mittleren Zeitrahmen oft deutlicher. |
| `avg_bars` | Fenster für Durchschnittsberechnung | `100` | Bietet eine stabile Basis für die Volatilitätsmessung. |
| `exp_factor` | Multiplikator für den Impuls | `4.1` | Entspricht dem Standardwert im Original-EA. |

**Zenbot-Befehl (Beispiel für Volatility Impulse Reversal Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=volatility_impulse_reversal --period=1h --avg_bars=100 --exp_factor=4.1
```
