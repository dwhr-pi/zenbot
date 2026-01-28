## 18. Night Scalper Strategie

**Zenbot-Dateiname:** `Night_Scalper.js`

Diese Strategie basiert auf dem MT4 EA **`Pirate.mq4`**. Sie ist eine **Mean-Reversion-Strategie**, die speziell für Marktphasen mit geringer Volatilität (wie die asiatische Handelssitzung oder die Nachtstunden) entwickelt wurde.

### Strategie-Logik

Die Strategie nutzt Bollinger Bänder, um überkaufte und überverkaufte Zustände in einem Seitwärtsmarkt zu identifizieren. Sie handelt nur innerhalb eines definierten Zeitfensters, in dem die Volatilität typischerweise gering ist.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der Preis berührt oder unterschreitet das untere Bollinger Band **UND** die aktuelle Zeit liegt innerhalb des Zeitfensters (`start_hour` bis `end_hour`). |
| **Verkauf (Short)** | Der Preis berührt oder überschreitet das obere Bollinger Band **UND** die aktuelle Zeit liegt innerhalb des Zeitfensters (`start_hour` bis `end_hour`). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 15m, 30m) | `15m` | Ideal für kurzfristiges Scalping. |
| `bollinger_size` | Perioden für Bollinger Bänder | `20` | Standardwert für die Volatilitätsmessung. |
| `start_hour` | Beginn des Handelsfensters (UTC) | `0` | Entspricht dem Standardwert im Original-EA. |
| `end_hour` | Ende des Handelsfensters (UTC) | `2` | Deckt die ruhigste Phase der asiatischen Session ab. |

**Zenbot-Befehl (Beispiel für Night Scalper Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=night_scalper --period=15m --start_hour=0 --end_hour=2
```
