
### 1. Dokumentation der `retrend_price` Strategie

Diese Strategie scheint eine Trendfolgestrategie zu sein, die versucht, von etablierten Markttrends zu profitieren. Sie kombiniert mehrere Indikatoren, um Kauf- und Verkaufssignale zu generieren.

**Kernlogik:**

Die Strategie basiert auf der Identifizierung eines Trends und dem anschließenden Warten auf einen günstigen Einstiegspunkt (einen kleinen Rücksetzer im Preis), bevor eine Position eröffnet wird.

*   **Kaufsignal (Long):**
    *   Ein Aufwärtstrend wird durch einen primären Trendindikator (wie z.B. EMA oder MACD) identifiziert.
    *   Die Strategie wartet dann auf einen leichten Preisrückgang oder eine Konsolidierung innerhalb dieses Aufwärtstrends.
    *   Ein untergeordneter Indikator (wie RSI oder Stochastik) signalisiert einen "überverkauften" Zustand innerhalb dieses kurzfristigen Rückgangs.
    *   Wenn beide Bedingungen erfüllt sind, wird ein Kaufsignal ausgelöst.

*   **Verkaufssignal (Short/Close):**
    *   Ein Abwärtstrend wird durch den primären Trendindikator signalisiert.
    *   Alternativ kann ein Verkaufssignal auch durch vordefinierte Stop-Loss- oder Take-Profit-Niveaus ausgelöst werden.
    *   Ein weiterer Verkaufsmechanismus ist oft das Erreichen eines "überkauften" Zustands auf einem Indikator wie dem RSI, was auf eine bevorstehende Trendumkehr oder Korrektur hindeutet.

**Verwendete Indikatoren (basierend auf typischen Zenbot-Strategien dieser Art):**

*   **EMA (Exponential Moving Average):** Wahrscheinlich zur Bestimmung der allgemeinen Trendrichtung. Ein Kurs über dem EMA deutet auf einen Aufwärtstrend hin, ein Kurs darunter auf einen Abwärtstrend.
*   **RSI (Relative Strength Index):** Wird verwendet, um überkaufte (>70) und überverkaufte (<30) Bedingungen zu identifizieren, die als Einstiegs- oder Ausstiegssignale innerhalb eines Trends dienen können.
*   **MACD (Moving Average Convergence Divergence):** Kann ebenfalls zur Trendbestimmung und zur Generierung von Kauf-/Verkaufssignalen durch das Kreuzen der MACD-Linie und der Signallinie verwendet werden.

### 2. Voreinstellungs-Empfehlungen

Die optimalen Einstellungen hängen stark vom gehandelten Währungspaar, dem Zeitrahmen (Periode) und den aktuellen Marktbedingungen ab. Es ist unerlässlich, Simulationen (`sim`) mit historischen Daten durchzuführen, bevor die Strategie im Live-Handel (`trade`) eingesetzt wird.

**Allgemeine Empfehlungen:**

*   **`period_length` (Periodenlänge):**
    *   **Empfehlung:** Starten Sie mit `1h` oder `2h`.
    *   **Begründung:** Kürzere Zeiträume (z.B. unter 30m) neigen zu mehr "Rauschen" und Fehlsignalen (Whipsaws). Längere Zeiträume glätten die Preisbewegungen und helfen, den übergeordneten Trend zuverlässiger zu erkennen, was für eine Trendfolgestrategie entscheidend ist.

*   **`min_periods` (Minimale Perioden):**
    *   **Empfehlung:** `52`
    *   **Begründung:** Dies stellt sicher, dass die Indikatoren genügend historische Daten haben, um aussagekräftige Werte zu berechnen. Ein Wert um 50 ist ein gängiger Ausgangspunkt.

*   **`rsi_periods` (RSI Perioden):**
    *   **Empfehlung:** `14`
    *   **Begründung:** `14` ist der Standardwert für den RSI in der technischen Analyse und bietet eine gute Balance zwischen Reaktionsfähigkeit und Glättung.

**Parameter für Kauf-/Verkaufsschwellen:**

*   **`oversold_rsi` (Überverkauft-RSI):**
    *   **Empfehlung:** `30`
    *   **Begründung:** Dies ist der klassische Wert, um einen überverkauften Zustand zu signalisieren. Ein niedrigerer Wert (z.B. 25) macht das Kaufsignal seltener, aber potenziell zuverlässiger.

*   **`overbought_rsi` (Überkauft-RSI):**
    *   **Empfehlung:** `70`
    *   **Begründung:** Der Standardwert für überkaufte Bedingungen. Ein höherer Wert (z.B. 75) reduziert die Anzahl der Verkaufssignale.

**Risikomanagement:**

*   **`sell_stop_pct` (Verkaufs-Stop in %):**
    *   **Empfehlung:** `0` (deaktiviert)
    *   **Begründung:** Diese Funktion kann bei hoher Volatilität zu unerwünschten Verkäufen führen. Es ist oft besser, sich auf die strategiebasierten Verkaufssignale zu verlassen.

*   **`stop_loss_pct` (Stop-Loss in %):**
    *   **Empfehlung:** `3` - `5`
    *   **Begründung:** Ein Stop-Loss ist entscheidend, um größere Verluste zu begrenzen, falls sich der Markt unerwartet gegen Ihre Position bewegt. Der genaue Wert sollte an die Volatilität des gehandelten Paares angepasst werden.

### 3. Wichtige Hinweise

*   **Simulation ist Pflicht:** Führen Sie immer Backtests (Simulationen) für verschiedene Zeiträume und mit verschiedenen Parametern durch. Zenbot ermöglicht dies mit dem `sim`-Befehl. Analysieren Sie die Ergebnisse, insbesondere den "Buy/Hold"-Vergleich und die Anzahl der Trades.
*   **Keine Garantie:** Zenbot und jede Handelsstrategie sind Experimente und keine Garantie für Gewinne. Seien Sie sich des Risikos bewusst und investieren Sie nur Kapital, dessen Verlust Sie sich leisten können.
*   **Marktabhängigkeit:** Die Leistung einer Strategie kann sich mit den Marktbedingungen (bullisch, bärisch, seitwärts) drastisch ändern. Eine Strategie, die in einem Bullenmarkt gut funktioniert, kann in einem Bärenmarkt zu Verlusten führen.

Ich hoffe, diese Analyse und die Empfehlungen sind hilfreich für Sie. Denken Sie daran, mit kleinen Beträgen oder im Paper-Trading-Modus zu beginnen, um die Strategie in der Praxis zu testen.

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
