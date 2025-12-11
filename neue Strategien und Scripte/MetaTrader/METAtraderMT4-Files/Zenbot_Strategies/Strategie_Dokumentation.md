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
