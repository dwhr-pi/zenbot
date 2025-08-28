# Zenbot Retrend Price Strategie Dokumentation

Diese Dokumentation beschreibt die Funktionsweise und die Konfigurationsmöglichkeiten der Zenbot `retrend_price` Strategie.

## 1. Übersicht

Die `retrend_price` Strategie basiert auf der Analyse von RSI (Relative Strength Index) und EMA (Exponential Moving Average) um Kauf- und Verkaufssignale zu generieren. Sie zielt darauf ab, bei fallendem Trend zu kaufen (min. Preis) und bei steigendem Trend zu verkaufen (max. Preis). Optional kann ein Kauf bei niedrigem RSI erfolgen.

## 2. Verwendete Indikatoren

*   **RSI (Relative Strength Index):** Ein Momentum-Oszillator, der die Geschwindigkeit und Veränderung von Kursbewegungen misst. Er wird verwendet, um überkaufte oder überverkaufte Bedingungen eines Assets zu identifizieren.
*   **EMA (Exponential Moving Average):** Ein gleitender Durchschnitt, der den jüngsten Datenpunkten mehr Gewicht verleiht. Er wird verwendet, um den Trend zu glätten und Trendumkehrungen zu identifizieren.

## 3. Konfigurierbare Optionen

Die folgenden Optionen können in der `retrend_price` Strategie konfiguriert werden:

*   `period` / `period_length`: Die Zeitperiode für die Strategie (Standard: `15m`).
*   `min_periods`: Die minimale Anzahl der Historie-Perioden, die für die Berechnungen benötigt werden (Standard: `52`).
*   `trend_ema`: Die Anzahl der Perioden für den Trend-EMA (Standard: `9`).
*   `trade_pct`: Der Handelsschwellenwert (Standard: `0`). Ein positiver Wert bedeutet, dass der Trend-EMA-Anstieg diesen Prozentsatz überschreiten muss, um ein Kaufsignal auszulösen. Ein negativer Wert bedeutet, dass der Trend-EMA-Rückgang diesen Prozentsatz unterschreiten muss, um ein Verkaufssignal auszulösen.
*   `rsi_safety`: Ein Sicherheitscheck für den RSI (Standard: `0`). Der Kommentar im Code deutet an, dass ein Wert von `-49` diesen Check deaktiviert.
*   `rsi_periods`: Die Anzahl der Perioden für die RSI-Berechnung (Standard: `14`).
*   `oversold_rsi`: Der RSI-Wert, bei dem ein Kaufsignal ausgelöst wird, wenn der RSI diesen Wert erreicht oder unterschreitet (Standard: `9`). Ein Wert von `0` deaktiviert diese Bedingung.
*   `overbought_rsi`: Der RSI-Wert, bei dem ein Verkaufssignal ausgelöst wird, wenn der RSI diesen Wert erreicht oder überschreitet (Standard: `99`). Ein Wert von `0` deaktiviert diese Bedingung.
*   `multi_trade`: Wenn auf `off` gesetzt, werden Kauf-/Verkaufssignale nur ausgelöst, wenn der letzte Signaltyp unterschiedlich war (Standard: `off`).

## 4. Funktionsweise

Die Strategie berechnet in jeder Periode den RSI und den Trend-EMA.

### 4.1. RSI-basierte Signale

Wenn der `oversold_rsi` Wert ungleich `0` ist und der aktuelle RSI unter diesen Wert fällt, wird ein Kaufsignal (`buy`) generiert.
Wenn der `overbought_rsi` Wert ungleich `0` ist und der aktuelle RSI über diesen Wert steigt, wird ein Verkaufssignal (`sell`) generiert.

### 4.2. EMA-basierte Signale

Die Strategie berechnet die Änderungsrate des Trend-EMA im Vergleich zur vorherigen Periode.

*   Wenn die Änderungsrate des Trend-EMA größer ist als `trade_pct`, wird ein Kaufsignal (`buy`) generiert.
*   Wenn die Änderungsrate des Trend-EMA kleiner ist als `-trade_pct`, wird ein Verkaufssignal (`sell`) generiert.

### 4.3. Multi-Trade Logik

Wenn `multi_trade` auf `off` gesetzt ist, verhindert die Strategie, dass aufeinanderfolgende Signale des gleichen Typs (z.B. zwei Kaufsignale hintereinander) ausgelöst werden. Ein neues Signal wird nur generiert, wenn es dem vorherigen Signal entgegengesetzt ist.

## 5. Berichterstattung

Die Strategie gibt im Bericht die aktuellen RSI-Werte (mit den konfigurierten Überkauft-/Überverkauft-Grenzen) und die Trend-EMA-Werte (mit der prozentualen Änderungsrate) aus.





## 6. Empfehlungen für Voreinstellungen

Die optimale Konfiguration der `retrend_price` Strategie hängt stark von der gehandelten Kryptowährung, dem Zeitrahmen und den Marktbedingungen ab. Die hier gegebenen Empfehlungen dienen als Ausgangspunkt und sollten durch Backtesting und iterative Anpassung verfeinert werden.

### 6.1. Allgemeine Überlegungen

*   **Zeitrahmen (`period` / `period_length`):** Kürzere Zeitrahmen (z.B. `1m`, `5m`) eignen sich für Scalping und schnelle Reaktionen auf Marktveränderungen, sind aber anfälliger für Rauschen. Längere Zeitrahmen (z.B. `1h`, `4h`, `1d`) sind besser für Swing-Trading und erfassen größere Trends, reagieren aber langsamer auf plötzliche Bewegungen.
*   **Volatilität:** In volatilen Märkten können engere RSI-Grenzen (z.B. `oversold_rsi` höher, `overbought_rsi` niedriger) zu häufigeren Signalen führen, aber auch zu mehr Fehlsignalen. In weniger volatilen Märkten können weitere Grenzen sinnvoller sein.
*   **Gebühren:** Handelsgebühren können die Rentabilität stark beeinflussen. Eine Strategie, die viele kleine Trades generiert, kann durch hohe Gebühren unrentabel werden. `trade_pct` kann hier helfen, die Anzahl der Trades zu reduzieren.

### 6.2. Empfohlene Startwerte

Die folgenden Werte können als Basis für Experimente dienen:

*   `period_length`: `15m` oder `30m` (guter Kompromiss zwischen Reaktivität und Rauschfilterung für viele Kryptowährungen).
*   `min_periods`: `52` (Standardwert ist in der Regel ausreichend).
*   `trend_ema`: `9` oder `12` (Ein kürzerer EMA reagiert schneller auf Trendänderungen, ein längerer ist glatter).
*   `trade_pct`: `0.1` bis `0.5` (Beginnen Sie mit einem kleinen Wert und erhöhen Sie ihn, um die Anzahl der Trades zu reduzieren und nur auf stärkere Trendbewegungen zu reagieren).
*   `rsi_safety`: `0` (Deaktiviert, da der Nutzen unklar ist und der Standardwert im Code auf `-49` gesetzt werden sollte, um ihn zu entfernen).
*   `rsi_periods`: `14` (Standardwert, der in der technischen Analyse weit verbreitet ist).
*   `oversold_rsi`: `30` (Ein gängiger Wert für überverkaufte Bedingungen).
*   `overbought_rsi`: `70` (Ein gängiger Wert für überkaufte Bedingungen).
*   `multi_trade`: `off` (Empfohlen, um unnötige aufeinanderfolgende Trades zu vermeiden und die Strategie robuster zu machen).

### 6.3. Beispielkonfiguration (für BTC/USDT auf 15m)

```javascript
module.exports = {
  // ... andere Optionen
  period_length: '15m',
  min_periods: 52,
  trend_ema: 9,
  trade_pct: 0.2,
  rsi_safety: 0, // oder -49, um es zu entfernen
  rsi_periods: 14,
  oversold_rsi: 30,
  overbought_rsi: 70,
  multi_trade: 'off'
};
```

## 7. Wichtige Hinweise

*   **Backtesting:** Führen Sie immer umfangreiche Backtests mit historischen Daten durch, bevor Sie die Strategie im Live-Handel einsetzen. Zenbot bietet hierfür Funktionen.
*   **Papertrading:** Beginnen Sie mit Papertrading (Handel mit virtuellem Geld), um die Strategie unter realen Marktbedingungen zu testen, ohne echtes Kapital zu riskieren.
*   **Risikomanagement:** Setzen Sie immer Stop-Loss-Orders und betreiben Sie ein angemessenes Risikomanagement, unabhängig von der verwendeten Strategie.
*   **Marktbedingungen:** Keine Strategie funktioniert unter allen Marktbedingungen. Seien Sie bereit, Ihre Einstellungen anzupassen oder die Strategie zu wechseln, wenn sich die Marktbedingungen ändern.
