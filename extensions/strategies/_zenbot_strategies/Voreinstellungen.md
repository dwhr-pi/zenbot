
**Wichtiger Hinweis:** Diese Strategien stammen aus einem "unstable" Branch, was bedeutet, dass sie experimentell sein können und möglicherweise nicht so ausführlich getestet wurden wie die Standardstrategien. Führen Sie immer gründliche Simulationen (Backtests) durch, bevor Sie eine dieser Strategien mit echtem Kapital einsetzen.

---

### Analyse der Zenbot-Strategien aus dem `_zenbot_strategies` Verzeichnis

#### 1. **cci_srsi**

*   **Beschreibung:** Diese Strategie kombiniert zwei beliebte Oszillatoren: den Commodity Channel Index (CCI) und den Stochastischen Relative Strength Index (StochRSI). Ziel ist es, überkaufte und überverkaufte Marktbedingungen zu identifizieren, um Kauf- und Verkaufspunkte zu finden.
*   **Funktionsweise:**
    *   Ein **Kaufsignal** wird generiert, wenn sowohl der CCI als auch der StochRSI in den überverkauften Bereich fallen (niedrige Werte).
    *   Ein **Verkaufssignal** wird generiert, wenn beide Indikatoren in den überkauften Bereich steigen (hohe Werte).
    *   Die Kombination beider Indikatoren soll die Genauigkeit der Signale erhöhen und Fehlsignale reduzieren.
*   **Empfohlene Voreinstellungen:**
    *   `period`: Beginnen Sie mit kürzeren Zeiträumen wie `5m` oder `15m`, da Oszillatoren oft für kurzfristigere Analysen verwendet werden.
    *   `cci_periods`: Ein gängiger Wert für den CCI ist `20`.
    *   `srsi_periods`: Für den StochRSI ist ein Standardwert `14`.
    *   `oversold_cci`: Typischerweise `-100`.
    *   `overbought_cci`: Typischerweise `+100`.
    *   `oversold_srsi`: Typischerweise `20`.
    *   `overbought_srsi`: Typischerweise `80`.
    *   **Empfehlung:** Passen Sie die `oversold`/`overbought`-Schwellenwerte an die Volatilität des jeweiligen Marktes an. In weniger volatilen Märkten könnten engere Schwellenwerte (z.B. -90/+90 für CCI) besser funktionieren.

#### 2. **momentum**

*   **Beschreibung:** Diese Strategie basiert auf dem Momentum-Indikator, der die Geschwindigkeit der Preisänderung misst. Sie zielt darauf ab, in einen bereits etablierten Trend einzusteigen, in der Annahme, dass sich die aktuelle Preisbewegung fortsetzen wird.
*   **Funktionsweise:**
    *   Die Strategie berechnet die prozentuale Preisänderung über eine bestimmte Periode (`momentum_period`).
    *   Ein **Kaufsignal** wird ausgelöst, wenn das Momentum einen bestimmten positiven Schwellenwert (`momentum_buy_thresh`) überschreitet, was auf einen starken Aufwärtstrend hindeutet.
    *   Ein **Verkaufssignal** wird ausgelöst, wenn das Momentum unter einen negativen Schwellenwert (`momentum_sell_thresh`) fällt, was auf einen starken Abwärtstrend hindeutet.
*   **Empfohlene Voreinstellungen:**
    *   `period`: Da Momentum-Strategien auf schnellen Preisbewegungen basieren, sind kürzere Perioden wie `1m` bis `5m` oft ein guter Ausgangspunkt.
    *   `momentum_period`: Ein Wert zwischen `1` und `5` ist üblich, um sehr kurzfristige Preisimpulse zu erfassen.
    *   `momentum_buy_thresh`: Beginnen Sie mit einem Wert um `0.1` und passen Sie ihn basierend auf der Volatilität des Paares an. Höhere Volatilität erfordert möglicherweise einen höheren Schwellenwert.
    *   `momentum_sell_thresh`: Beginnen Sie mit einem Wert um `-0.1`.
    *   **Empfehlung:** Diese Strategie kann in stark trendenden Märkten gut funktionieren, ist aber in Seitwärtsmärkten anfällig für viele Fehlsignale ("Whipsaws"). Verwenden Sie Stop-Loss-Einstellungen (`sell_stop_pct`, `buy_stop_pct`), um Verluste zu begrenzen.

#### 3. **srsi_adx**

*   **Beschreibung:** Diese Strategie kombiniert den Stochastischen RSI (StochRSI) mit dem Average Directional Index (ADX). Der StochRSI identifiziert überkaufte/überverkaufte Niveaus, während der ADX die Stärke eines Trends misst (unabhängig von seiner Richtung).
*   **Funktionsweise:**
    *   Ein **Kaufsignal** wird nur dann in Betracht gezogen, wenn der StochRSI überverkauft ist. Der Handel wird jedoch nur ausgeführt, wenn der ADX über einem bestimmten Schwellenwert (`adx_buy_thresh`) liegt, was anzeigt, dass ein starker Trend vorhanden ist.
    *   Ein **Verkaufssignal** wird bei einem überkauften StochRSI in Betracht gezogen, aber nur ausgeführt, wenn der ADX ebenfalls einen starken Trend signalisiert.
    *   Der ADX dient hier als Filter, um zu vermeiden, dass in schwachen oder richtungslosen Märkten gehandelt wird, wo Oszillatoren wie der StochRSI oft Fehlsignale liefern.
*   **Empfohlene Voreinstellungen:**
    *   `period`: `15m` bis `1h` ist ein guter Startpunkt, um ein Gleichgewicht zwischen Signalhäufigkeit und Zuverlässigkeit zu finden.
    *   `srsi_periods`: Standardwert ist `14`.
    *   `oversold_srsi`: `20`.
    *   `overbought_srsi`: `80`.
    *   `adx_periods`: Standardwert ist `14`.
    *   `adx_buy_thresh`: Ein gängiger Schwellenwert für den ADX, um einen starken Trend zu signalisieren, ist `25`. Beginnen Sie mit diesem Wert.
    *   **Empfehlung:** Diese Strategie ist theoretisch robuster als eine reine Oszillator-Strategie. Testen Sie, ob eine Erhöhung des `adx_buy_thresh` (z.B. auf 30) die Qualität der Signale verbessert, auch wenn dadurch weniger Trades ausgeführt werden.

#### 4. **stddev**

*   **Beschreibung:** Diese Strategie verwendet die Standardabweichung (Standard Deviation) als Maß für die Volatilität. Die Idee ist, zu kaufen, wenn die Volatilität nach einer ruhigen Phase plötzlich ansteigt (was den Beginn einer neuen Bewegung andeuten könnte), und zu verkaufen, wenn die Volatilität extrem hoch ist.
*   **Funktionsweise:**
    *   Die Strategie berechnet die Standardabweichung der Schlusskurse über eine bestimmte Periode.
    *   Ein **Kaufsignal** könnte generiert werden, wenn die Standardabweichung einen bestimmten Schwellenwert überschreitet, was auf einen "Volatilitätsausbruch" hindeutet.
    *   Ein **Verkaufssignal** könnte ausgelöst werden, wenn die Volatilität ein Extrem erreicht und eine Rückkehr zum Mittelwert (Mean Reversion) wahrscheinlich wird.
*   **Empfohlene Voreinstellungen:**
    *   `period`: `5m` oder `15m`.
    *   `stddev_periods`: Ein üblicher Wert ist `20`, ähnlich wie bei den Bollinger Bändern.
    *   `stddev_buy_thresh`: Dieser Wert ist stark markt- und paarspezifisch. Sie müssen ihn durch Simulationen ermitteln. Beginnen Sie mit einem Wert, der leicht über der durchschnittlichen Standardabweichung in einer Seitwärtsphase liegt.
    *   `stddev_sell_thresh`: Dieser Wert sollte deutlich höher sein und ein Volatilitätsextrem darstellen.
    *   **Empfehlung:** Dies ist eine eher unkonventionelle Strategie. Sie könnte in Kombination mit einem Trendindikator nützlich sein, um sicherzustellen, dass der Volatilitätsausbruch in die "richtige" Richtung erfolgt. Führen Sie umfangreiche Backtests durch, da die Schwellenwerte schwer zu kalibrieren sind.

---

### Zusammenfassende Empfehlungen

1.  **Starten Sie mit `cci_srsi` oder `srsi_adx`:** Diese beiden Strategien basieren auf bewährten Konzepten (Kombination von Indikatoren zur Signalfilterung) und sind theoretisch am robustesten. Sie sind ein guter Ausgangspunkt für Ihre ersten Simulationen.
2.  **Simulation ist unerlässlich:** Da diese Strategien aus einem "unstable" Branch stammen, gibt es weniger Erfahrungswerte aus der Community. Der einzige Weg, ihre Wirksamkeit zu überprüfen, sind Backtests (`zenbot sim`) mit den Handelspaaren und Zeiträumen, die Sie interessieren.
3.  **Dokumentieren Sie Ihre Tests:** Führen Sie eine Tabelle, in der Sie die Strategie, das Handelspaar, den Zeitraum und die getesteten Parameter sowie die Ergebnisse (Gewinn, Anzahl der Trades, etc.) festhalten. Dies hilft Ihnen, systematisch die besten Einstellungen zu finden.
4.  **Risikomanagement nicht vergessen:** Unabhängig von der Strategie, verwenden Sie immer die Risikomanagement-Parameter von Zenbot, wie `max_sell_loss_pct` (Stop-Loss), um Ihr Kapital zu schützen.

Ich hoffe, diese detaillierte Analyse der spezifischen Strategien aus dem GitHub-Verzeichnis ist hilfreich für Sie!

---
Sollen wir als Nächstes eine Beispiel-Simulationskonfiguration für eine dieser Strategien, zum Beispiel `srsi_adx`, erstellen? Oder möchten Sie, dass ich nach Diskussionen oder Erfahrungsberichten zu diesen speziellen Strategien suche?
