## 10. Fractal Breakout Scalper Strategie

**Zenbot-Dateiname:** `Fractal_Breakout_Scalper.js`

Diese Strategie basiert auf dem MT5 EA **`RoyalPrince_Scalper.mq5`**. Sie ist eine **Scalping-Strategie**, die lokale Hochs und Tiefs (Fraktale) identifiziert und einen Trade eingeht, sobald der Preis aus diesen Niveaus ausbricht. Sie ist für kurze Zeitrahmen und schnelle Marktbewegungen konzipiert.

### Strategie-Logik

Die Strategie sucht nach "Fraktalen" – Kerzen, deren Hoch oder Tief das Extremum in einem definierten Umfeld von Kerzen darstellt. Ein Ausbruch über ein solches Fraktal-Hoch oder unter ein Fraktal-Tief generiert ein Handelssignal.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der aktuelle Preis bricht über das letzte identifizierte Fraktal-Hoch aus. |
| **Verkauf (Short)** | Der aktuelle Preis bricht unter das letzte identifizierte Fraktal-Tief aus. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 15m, 5m) | `15m` | Scalping-Strategien funktionieren am besten auf niedrigen Zeitrahmen. |
| `fractal_periods` | Anzahl der Kerzen zur Fraktal-Bestimmung | `5` | Entspricht dem `BarsN` im Original-EA. Ein kleinerer Wert macht die Strategie sensibler. |

**Zenbot-Befehl (Beispiel für Fractal Breakout Scalper Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=fractal_breakout_scalper --period=15m --fractal_periods=5
```
