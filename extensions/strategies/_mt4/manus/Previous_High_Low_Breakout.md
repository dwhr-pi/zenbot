## 9. Previous High/Low Breakout Strategie

**Zenbot-Dateiname:** `Previous_High_Low_Breakout.js`

Diese Strategie basiert auf der Idee der Price Action und des Money Managements aus dem MT4-Skript **`Close all positions at profit target v1.1.mq4`**. Da das MT4-Skript nur das Schließen von Positionen verwaltet, wurde eine einfache **Price Action Einstiegslogik** implementiert, die auf dem Durchbruch des vorherigen Hochs/Tiefs basiert. Die Money-Management-Idee wird durch die nativen Zenbot-Optionen `profit_target` und `stop_loss` abgedeckt. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie geht davon aus, dass ein Durchbruch des höchsten Hochs oder des niedrigsten Tiefs der letzten N Kerzen eine Fortsetzung der Bewegung in diese Richtung signalisiert.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der aktuelle Schlusskurs durchbricht das höchste Hoch der letzten `breakout_periods` Kerzen. |
| **Verkauf (Short)** | Der aktuelle Schlusskurs durchbricht das niedrigste Tief der letzten `breakout_periods` Kerzen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet, um signifikante Ausbrüche zu erfassen. |
| `breakout_periods` | Anzahl der vorherigen Kerzen für die Hoch/Tief-Bestimmung | `1` | Ein Wert von 1 bedeutet, dass der Ausbruch des Hochs/Tiefs der unmittelbar vorherigen Kerze gehandelt wird. |
| `profit_target` | Zenbot-Option für Gewinnmitnahme (in %) | `0.5` | Simuliert das "Profit Target" des MT4-Skripts. |
| `stop_loss` | Zenbot-Option für Stop-Loss (in %) | `0.2` | Empfohlener Startwert für das Risikomanagement. |

**Zenbot-Befehl (Beispiel für Previous High/Low Breakout Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=prev_high_low_breakout --period=1h --breakout_periods=1 --profit_target=0.5 --stop_loss=0.2
```
