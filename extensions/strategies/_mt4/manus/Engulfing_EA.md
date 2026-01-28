
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
