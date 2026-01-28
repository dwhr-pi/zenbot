# Zenbot Strategie-Dokumentation (Abgeleitet von MT4 Expert Advisors)

Dieses Dokument beschreibt zwei Zenbot-kompatible Handelsstrategien, die aus den bereitgestellten MT4 Expert Advisors (EAs) abgeleitet wurden. Zenbot ist ein Open-Source-Handelsbot, der in Node.js geschrieben ist und hauptsächlich für den Kryptowährungshandel verwendet wird. Die Logik der ursprünglichen MQL4-Programme wurde in die Zenbot-Strategie-Struktur (JavaScript) übertragen.

---

## 1. ADX-EMA Crossover Strategie

**Zenbot-Dateiname:** `Robot_ADX+2MA.js`

Diese Strategie basiert auf dem MT4 EA `Robot_ADX+2MA.mq4` und kombiniert zwei Exponentielle Gleitende Durchschnitte (EMA) mit dem Average Directional Index (ADX) zur Trendbestätigung. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie zielt darauf ab, in Richtung eines etablierten Trends zu handeln, der durch den Crossover der EMAs und die Stärke des ADX bestätigt wird.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. Der kurze EMA liegt über dem langen EMA (Aufwärtstrend). **UND** |
| | 2. Der ADX-Wert liegt über einem bestimmten Schwellenwert (z.B. 25), was einen starken Trend anzeigt. **UND** |
| | 3. Der positive Richtungsindikator (+DI) liegt deutlich über dem negativen Richtungsindikator (-DI), was die Aufwärtsrichtung bestätigt. |
| **Verkauf (Short)** | 1. Der kurze EMA liegt unter dem langen EMA (Abwärtstrend). **UND** |
| | 2. Der ADX-Wert liegt über einem bestimmten Schwellenwert (z.B. 25), was einen starken Trend anzeigt. **UND** |
| | 3. Der negative Richtungsindikator (-DI) liegt deutlich über dem positiven Richtungsindikator (+DI), was die Abwärtsrichtung bestätigt. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

Die folgenden Werte sind optimierte Startpunkte, die auf der Logik des ursprünglichen MT4-Codes basieren. Für eine optimale Performance auf einem spezifischen Markt (z.B. BTC/USD) und Zeitrahmen ist ein **Backtesting** mit Zenbot erforderlich.

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Bietet ein gutes Gleichgewicht zwischen schnellen Signalen und der Filterung von Markt-Rauschen. |
| `ema_short_periods` | Perioden für den kurzen EMA | `5` | Entspricht der schnellen Linie im Original-EA. |
| `ema_long_periods` | Perioden für den langen EMA | `12` | Entspricht der langsamen Linie im Original-EA. |
| `adx_periods` | Perioden für die ADX-Berechnung | `6` | Entspricht der Sensitivität im Original-EA. |
| `adx_threshold` | Mindestwert für ADX zur Trendbestätigung | `25` | Ein höherer Wert (über 20) signalisiert einen starken, handelbaren Trend. |
| `di_threshold` | Mindestdifferenz zwischen +DI und -DI | `5` | Stellt sicher, dass die Richtung klar dominiert. |

---

## 2. Engulfing Candlestick Strategie

**Zenbot-Dateiname:** `Engulfing_EA.js`

Diese Strategie basiert auf dem MT4 EA `engulfing EA.mq4` und identifiziert das **Engulfing Candlestick Pattern** (Umkehrkerzenmuster). Sie ist eine **Umkehrstrategie**.

### Strategie-Logik

Die Strategie sucht nach einem Muster, bei dem die aktuelle Kerze die gesamte vorherige Kerze (einschließlich Dochte) umschließt, was auf eine starke Umkehr der Marktstimmung hindeutet.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | **Bullish Engulfing:** Die aktuelle Kerze ist bullisch (Schluss > Eröffnung) und umschließt die gesamte vorherige bärische Kerze (Hoch der aktuellen Kerze > Hoch der vorherigen Kerze UND Tief der aktuellen Kerze < Tief der vorherigen Kerze). |
| **Verkauf (Short)** | **Bearish Engulfing:** Die aktuelle Kerze ist bärisch (Schluss < Eröffnung) und umschließt die gesamte vorherige bullische Kerze (Hoch der aktuellen Kerze > Hoch der vorherigen Kerze UND Tief der aktuellen Kerze < Tief der vorherigen Kerze). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

Diese Strategie ist primär ein Mustererkennungs-Algorithmus und hat nur wenige optimierbare Parameter in der Zenbot-Implementierung.

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `30m` | Candlestick-Muster sind oft auf niedrigeren bis mittleren Zeitrahmen effektiver. |
| `min_periods` | Mindestanzahl der benötigten Perioden | `2` | Das Muster benötigt mindestens zwei Kerzen. |

---

## Wichtiger Hinweis zur Zenbot-Nutzung

Um diese Strategien in Zenbot zu verwenden, müssen Sie die `.js`-Dateien in das `strategies/`-Verzeichnis Ihrer Zenbot-Installation kopieren.

**Backtesting:** Bevor Sie die Strategien im Live-Handel einsetzen, ist es unerlässlich, sie mit dem `zenbot backfill` und `zenbot backtest` Befehl auf historischen Daten zu testen und die Parameter zu optimieren. Die hier vorgeschlagenen Einstellungen sind lediglich Startpunkte.

**Zenbot-Befehl (Beispiel für ADX-EMA Crossover):**

```bash
zenbot backtest binance.BTC-USDT --strategy=adx_ema_crossover --period=1h --ema_short_periods=5 --ema_long_periods=12 --adx_periods=6 --adx_threshold=25
```

---

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

---

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

---

## 6. Dual-EMA Channel Breakout Strategie

**Zenbot-Dateiname:** `Dual_EMA_Channel_Breakout.js`

Diese Strategie basiert auf dem MT4-Indikator **`ProFx02.mq4`**, der einen dynamischen Kanal aus mehreren gleitenden Durchschnitten bildet. Die Zenbot-Strategie vereinfacht dies zu einem **Dual-EMA-System**, das Signale generiert, wenn der Preis den durch die EMAs definierten Kanal durchbricht. Sie ist eine **Trendfolgestrategie**.

### Strategie-Logik

Die Strategie verwendet zwei EMAs (einen schnellen und einen langsamen), um den Trend zu bestimmen und einen dynamischen Kanal zu definieren. Ein Handel wird eingegangen, wenn der Preis den Kanal in Trendrichtung durchbricht.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Aufwärtstrend:** Der schnelle EMA liegt über dem langsamen EMA. **UND** |
| | 2. **Breakout:** Der aktuelle Schlusskurs liegt über der oberen Kanallinie (langsamer EMA + Breite). |
| **Verkauf (Short)** | 1. **Abwärtstrend:** Der schnelle EMA liegt unter dem langsamen EMA. **UND** |
| | 2. **Breakout:** Der aktuelle Schlusskurs liegt unter der unteren Kanallinie (langsamer EMA - Breite). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet für Trendfolge-Strategien. |
| `ema_short_periods` | Perioden für den schnellen EMA | `15` | Basierend auf dem `g_period_80` des Original-Indikators. |
| `ema_long_periods` | Perioden für den langsamen EMA | `30` | Dient als Basis für den Kanal und zur Trendfilterung. |
| `channel_width_factor` | Faktor zur Bestimmung der Kanalbreite (z.B. 0.001 = 0.1%) | `0.001` | Ein Startwert, der die Kanalbreite als Prozentsatz des Preises definiert. Muss optimiert werden. |

**Zenbot-Befehl (Beispiel für Dual-EMA Channel Breakout):**

```bash
zenbot backtest binance.BTC-USDT --strategy=dual_ema_channel_breakout --period=1h --ema_short_periods=15 --ema_long_periods=30 --channel_width_factor=0.001
```

---

## 7. RSI-Trend Strategie

**Zenbot-Dateiname:** `RSI_Trend_Strategy.js`

Diese Strategie basiert auf der Idee der relativen Stärke, die im MT4-Indikator **`CM_Strength_TF_M_V1.0.mq4`** verwendet wird. Da die Währungsstärke in Zenbot nicht direkt implementierbar ist, wurde die Strategie auf eine Kombination aus **RSI** (Relative Strength Index) und einem **EMA** (Exponential Moving Average) als Trendfilter reduziert. Sie ist eine **Momentum- und Trendfolgestrategie**.

### Strategie-Logik

Die Strategie nutzt den RSI, um Momentum-Signale zu generieren (Crossover der 50er-Linie) und filtert diese Signale mit einem längeren EMA, um sicherzustellen, dass nur in Richtung des übergeordneten Trends gehandelt wird.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Momentum-Signal:** Der RSI kreuzt die Mittellinie (z.B. 50) von unten nach oben. **UND** |
| | 2. **Aufwärtstrend:** Der aktuelle Preis liegt über dem EMA. |
| **Verkauf (Short)** | 1. **Momentum-Signal:** Der RSI kreuzt die Mittellinie (z.B. 50) von oben nach unten. **UND** |
| | 2. **Abwärtstrend:** Der aktuelle Preis liegt unter dem EMA. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Standard-Zeitrahmen für Trendfolgestrategien. |
| `rsi_periods` | Perioden für den RSI | `14` | Standardwert für den RSI. |
| `ema_periods` | Perioden für den EMA zur Trendfilterung | `50` | Ein mittlerer bis langer EMA zur Bestimmung des übergeordneten Trends. |
| `rsi_center_line` | RSI-Level für das Crossover-Signal | `50` | Die Mittellinie des RSI, die oft als Trendwechselpunkt interpretiert wird. |

**Zenbot-Befehl (Beispiel für RSI-Trend Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=rsi_trend_strategy --period=1h --rsi_periods=14 --ema_periods=50 --rsi_center_line=50
```

---

## 8. Triple-Confirmation Strategie

**Zenbot-Dateiname:** `Triple_Confirmation.js`

Diese Strategie basiert auf der Logik des MT4-Indikators **`Super-arrow-indicator.mq4`**, der ein Signal erst dann generiert, wenn mehrere Indikatoren übereinstimmen. Die Zenbot-Strategie verwendet eine Kombination aus **EMA Crossover** (Trend), **RSI Crossover** (Momentum) und **Bollinger Bändern** (Volatilität/Umkehr) als Filter. Sie ist eine **hochgradig gefilterte Trendfolgestrategie**.

### Strategie-Logik

Die Strategie erfordert die gleichzeitige Bestätigung durch alle drei Indikatoren, um ein Signal zu generieren. Dies soll die Anzahl der Fehlsignale reduzieren.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Trend (EMA):** Schneller EMA kreuzt langsamen EMA von unten nach oben. **UND** |
| | 2. **Momentum (RSI):** RSI kreuzt die 50er-Linie von unten nach oben. **UND** |
| | 3. **Umkehrfilter (BB):** Der Preis liegt am oder unter dem unteren Bollinger Band (Überverkauft). |
| **Verkauf (Short)** | 1. **Trend (EMA):** Schneller EMA kreuzt langsamen EMA von oben nach unten. **UND** |
| | 2. **Momentum (RSI):** RSI kreuzt die 50er-Linie von oben nach unten. **UND** |
| | 3. **Umkehrfilter (BB):** Der Preis liegt am oder über dem oberen Bollinger Band (Überkauft). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 30m) | `1h` | Gut geeignet für Multi-Indikator-Strategien. |
| `ema_fast` | Perioden für den schnellen EMA | `5` | Entspricht dem `FasterMovingAverage` im Original-Indikator. |
| `ema_slow` | Perioden für den langsamen EMA | `12` | Entspricht dem `SlowerMovingAverage` im Original-Indikator. |
| `rsi_periods` | Perioden für den RSI | `12` | Entspricht dem `RSIPeriod` im Original-Indikator. |
| `bb_periods` | Perioden für Bollinger Bänder | `10` | Entspricht dem `BollingerbandsPeriod` im Original-Indikator. |
| `bb_devs` | Standardabweichungen für Bollinger Bänder | `0.5` | Entspricht dem `BollingerbandsDeviation` im Original-Indikator. |

**Zenbot-Befehl (Beispiel für Triple-Confirmation Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=triple_confirmation --period=1h --ema_fast=5 --ema_slow=12 --rsi_periods=12 --bb_periods=10 --bb_devs=0.5
```

---

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

---

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

---

## 11. Super Signal Reversal Strategie

**Zenbot-Dateiname:** `Super_Signal_Reversal.js`

Diese Strategie basiert auf dem MT4-Indikator **`Super Signal v3.mq4`**. Sie ist eine **Umkehrstrategie**, die darauf spezialisiert ist, Preis-Extrema (Hochs und Tiefs) über zwei verschiedene Zeitfenster zu identifizieren. Wenn der Preis ein neues Extremum erreicht, signalisiert dies eine mögliche Erschöpfung des aktuellen Trends und eine bevorstehende Umkehr.

### Strategie-Logik

Die Strategie überwacht zwei Zeitfenster (`dist1` und `dist2`). Ein Signal wird generiert, wenn der aktuelle Preis das höchste Hoch oder das niedrigste Tief des längeren Zeitfensters erreicht oder durchbricht.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der aktuelle Tiefstpreis der Kerze ist kleiner oder gleich dem niedrigsten Tief der letzten `dist2` Kerzen. |
| **Verkauf (Short)** | Der aktuelle Höchstpreis der Kerze ist größer oder gleich dem höchsten Hoch der letzten `dist2` Kerzen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Umkehrsignale sind auf höheren Zeitrahmen oft zuverlässiger. |
| `dist1` | Kurzes Fenster für Extremwert-Erkennung | `14` | Entspricht dem Standardwert im Original-Indikator. |
| `dist2` | Langes Fenster für Extremwert-Erkennung | `21` | Entspricht dem Standardwert im Original-Indikator für stärkere Signale. |

**Zenbot-Befehl (Beispiel für Super Signal Reversal Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=super_signal_reversal --period=1h --dist1=14 --dist2=21
```

---

## 12. Fibonacci Trend Retracement Strategie

**Zenbot-Dateiname:** `Fibonacci_Trend_Retracement.js`

Diese Strategie basiert auf dem MT4 EA **`EA RoboFibo v.11.2.mq4`**. Sie nutzt **Fibonacci-Retracements**, um Einstiegspunkte während Korrekturen in einem bestehenden Trend zu identifizieren. Zur Trendbestimmung wird ein EMA (Exponential Moving Average) und zur Momentum-Filterung der RSI (Relative Strength Index) verwendet.

### Strategie-Logik

Die Strategie berechnet die Fibonacci-Levels (0%, 23.6%, 38.2%, 50%, 61.8%, 76.4%, 100%) basierend auf der Preisspanne der letzten `bars_back` Kerzen. Ein Signal wird generiert, wenn der Preis in einem Aufwärtstrend auf ein Fibonacci-Level zurückfällt oder in einem Abwärtstrend auf ein Level ansteigt.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | 1. **Aufwärtstrend:** Preis liegt über dem EMA. **UND** |
| | 2. **Retracement:** Preis fällt auf oder unter das 38.2% Fibonacci-Level zurück. **UND** |
| | 3. **Momentum:** RSI ist nicht überkauft (RSI < 60). |
| **Verkauf (Short)** | 1. **Abwärtstrend:** Preis liegt unter dem EMA. **UND** |
| | 2. **Retracement:** Preis steigt auf oder über das 61.8% Fibonacci-Level an. **UND** |
| | 3. **Momentum:** RSI ist nicht überverkauft (RSI > 40). |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Fibonacci-Levels sind auf höheren Zeitrahmen oft aussagekräftiger. |
| `bars_back` | Anzahl der Kerzen für Fibo-Berechnung | `20` | Entspricht dem Standardwert im Original-EA. |
| `ema_period` | Perioden für den Trend-EMA | `60` | Entspricht dem `maperiod` im Original-EA. |
| `rsi_period` | Perioden für den RSI-Filter | `14` | Standardwert für den RSI. |

**Zenbot-Befehl (Beispiel für Fibonacci Trend Retracement Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=fibo_trend_retracement --period=1h --bars_back=20 --ema_period=60 --rsi_period=14
```

---

## 13. RSI Zone Breakout Strategie

**Zenbot-Dateiname:** `RSI_Zone_Breakout.js`

Diese Strategie basiert auf der Einstiegslogik des MT4 EA **`OGT Zone Recovery EA v1.5.1.mq4`**. Sie nutzt den **RSI (Relative Strength Index)**, um überkaufte und überverkaufte Zonen zu identifizieren, und generiert Signale, wenn der Preis aus diesen Zonen ausbricht (Mean Reversion). Zur Bewertung der Marktsituation wird zusätzlich der **ATR (Average True Range)** herangezogen.

### Strategie-Logik

Die Strategie wartet darauf, dass der RSI in eine extreme Zone (über 70 oder unter 30) eintritt und diese dann wieder verlässt. Dies signalisiert eine mögliche Erschöpfung des Trends und den Beginn einer Korrektur oder Umkehr.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der RSI war in der vorherigen Periode unter oder gleich 30 (überverkauft) und ist in der aktuellen Periode über 30 gestiegen. |
| **Verkauf (Short)** | Der RSI war in der vorherigen Periode über oder gleich 70 (überkauft) und ist in der aktuellen Periode unter 70 gefallen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 15m, 30m) | `15m` | Entspricht den bevorzugten Zeitrahmen im Original-EA. |
| `rsi_periods` | Perioden für den RSI | `14` | Standardwert für den RSI. |
| `overbought` | RSI-Level für überkauft | `70` | Standardwert für Trendumkehrungen. |
| `oversold` | RSI-Level für überverkauft | `30` | Standardwert für Trendumkehrungen. |

**Zenbot-Befehl (Beispiel für RSI Zone Breakout Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=rsi_zone_breakout --period=15m --rsi_periods=14 --overbought=70 --oversold=30
```

---

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

---

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

---

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

---

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

---

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

