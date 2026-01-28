
## 3. RSI/CCI/MA Combo Strategie

**Zenbot-Dateiname:** `RSI_CCI_MA_Combo.js`

Diese Strategie basiert auf dem MT4 EA `RSI&CCI DIVERGENCE V1.mq4`. Da die Divergenz-Erkennung in Zenbot sehr komplex ist, wurde die Strategie auf eine robuste Kombination aus **RSI** (Relative Strength Index), **CCI** (Commodity Channel Index) und einem **MA Crossover** (Moving Average Crossover) vereinfacht. Sie kombiniert **Umkehr- und Trendfolge-Elemente**.

### Strategie-Logik

Die Strategie sucht nach einer **Überkauf-/Überverkauft-Situation** (RSI/CCI) und bestätigt diese mit der **Trendrichtung** (MA Crossover).

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Überverkauft:** RSI ist unter dem Kauf-Level (z.B. 30) **UND** CCI ist unter dem Kauf-Level (z.B. -100). **UND** |
| | 2. **Aufwärtstrend:** Der schnelle MA liegt über dem langsamen MA. |
| **Verkauf (Short)** | 1. **Überkauft:** RSI ist über dem Verkaufs-Level (z.B. 70) **UND** CCI ist über dem Verkaufs-Level (z.B. 100). **UND** |
| | 2. **Abwärtstrend:** Der schnelle MA liegt unter dem langsamen MA. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

Die folgenden Werte basieren auf den Parametern des ursprünglichen MT4-Codes und stellen einen soliden Ausgangspunkt dar.

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Standard-Zeitrahmen für Multi-Indikator-Strategien. |
| `rsi_periods` | Perioden für den RSI | `14` | Standardwert aus dem Original-EA. |
| `cci_periods` | Perioden für den CCI | `14` | Standardwert aus dem Original-EA. |
| `rsi_buy_level` | RSI-Level für Kauf (Überverkauft) | `30` | Standard-Überverkauft-Level. |
| `rsi_sell_level` | RSI-Level für Verkauf (Überkauft) | `70` | Standard-Überkauft-Level. |
| `cci_buy_level` | CCI-Level für Kauf (Überverkauft) | `-100` | Standard-Überverkauft-Level. |
| `cci_sell_level` | CCI-Level für Verkauf (Überkauft) | `100` | Standard-Überkauft-Level. |
| `ma_fast_periods` | Perioden für den schnellen MA | `6` | Entspricht dem `FastMA` im Original-EA. |
| `ma_slow_periods` | Perioden für den langsamen MA | `85` | Entspricht dem `SlowMA` im Original-EA. |

**Zenbot-Befehl (Beispiel für RSI/CCI/MA Combo):**

```bash
zenbot backtest binance.BTC-USDT --strategy=rsi_cci_ma_combo --period=1h --rsi_periods=14 --cci_periods=14 --ma_fast_periods=6 --ma_slow_periods=85
```

---
