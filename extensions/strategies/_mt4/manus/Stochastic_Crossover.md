## 4. Stochastic Crossover Strategie

**Zenbot-Dateiname:** `Stochastic_Crossover.js`

Diese Strategie basiert auf dem MT4-Indikator **`Stochastic divergence_mtfalerts.mq4`**. Da die Divergenz-Erkennung in Zenbot sehr aufwendig ist, wurde die Strategie auf die Kernlogik des **Stochastik-Oszillators** reduziert: den Crossover der %K- und %D-Linien in den überkauften oder überverkauften Zonen. Sie ist eine **Umkehrstrategie**.

### Strategie-Logik

Die Strategie generiert ein Signal, wenn die schnelle Linie (%K) die langsame Linie (%D) kreuzt, aber nur, wenn sich der Indikator in einer extremen Zone befindet, was eine baldige Umkehr signalisiert.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Crossover:** Die %K-Linie kreuzt die %D-Linie von unten nach oben. **UND** |
| | 2. **Überverkauft:** Die %K-Linie liegt unter dem Kauf-Level (z.B. 20). |
| **Verkauf (Short)** | 1. **Crossover:** Die %K-Linie kreuzt die %D-Linie von oben nach unten. **UND** |
| | 2. **Überkauft:** Die %K-Linie liegt über dem Verkaufs-Level (z.B. 80). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

Die folgenden Werte basieren auf den Standardeinstellungen des Stochastik-Oszillators und den Parametern des ursprünglichen MT4-Codes.

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `30m` | Gut geeignet für Oszillator-Strategien, die auf Umkehrungen abzielen. |
| `stoch_k_periods` | Perioden für %K | `14` | Entspricht dem `StoKPeriod` im Original-EA. |
| `stoch_d_periods` | Perioden für %D | `3` | Entspricht dem `StoDPeriod` im Original-EA. |
| `stoch_slowing` | Glättungsperiode | `3` | Entspricht dem `StoSlowing` im Original-EA. |
| `stoch_buy_level` | Kauf-Level (Überverkauft) | `20` | Standard-Überverkauft-Level. |
| `stoch_sell_level` | Verkaufs-Level (Überkauft) | `80` | Standard-Überkauft-Level. |

**Zenbot-Befehl (Beispiel für Stochastic Crossover):**

```bash
zenbot backtest binance.BTC-USDT --strategy=stochastic_crossover --period=30m --stoch_k_periods=14 --stoch_d_periods=3 --stoch_slowing=3
```
