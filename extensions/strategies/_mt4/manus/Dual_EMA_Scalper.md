## 16. Dual EMA Scalper Strategie

**Zenbot-Dateiname:** `Dual_EMA_Scalper.js`

Diese Strategie basiert auf dem MT4 EA **`EA17-Scalping Grid.mq4`**. Sie ist eine **Hochfrequenz-Scalping-Strategie**, die zwei exponentielle gleitende Durchschnitte (EMA) nutzt, um schnelle Gewinne in Richtung des übergeordneten Trends zu erzielen.

### Strategie-Logik

Die Strategie verwendet einen langsamen EMA (`ema_trend`), um die Haupttrendrichtung zu bestimmen, und einen schnellen EMA (`ema_signal`), um präzise Einstiegspunkte zu finden. Ein Signal wird generiert, wenn der Preis den Signal-EMA in Trendrichtung kreuzt.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der Preis liegt über dem Trend-EMA **UND** der Preis kreuzt den Signal-EMA von unten nach oben. |
| **Verkauf (Short)** | Der Preis liegt unter dem Trend-EMA **UND** der Preis kreuzt den Signal-EMA von oben nach unten. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 5m, 15m) | `5m` | Scalping erfordert niedrige Zeitrahmen für viele Signale. |
| `ema_signal` | Perioden für den Signal-EMA | `15` | Entspricht dem Standardwert im Original-EA. |
| `ema_trend` | Perioden für den Trend-EMA | `200` | Standardwert für die langfristige Trendbestimmung. |

**Zenbot-Befehl (Beispiel für Dual EMA Scalper Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=dual_ema_scalper --period=5m --ema_signal=15 --ema_trend=200
```
