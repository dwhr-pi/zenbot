

### Dokumentation der `trend_ema_max` Strategie

Diese Strategie scheint darauf abzuzielen, Trends mithilfe von Exponential Moving Averages (EMA) zu identifizieren und Handelssignale zu generieren. Der Name `trend_ema_max` deutet darauf hin, dass sie möglicherweise versucht, den maximalen Punkt eines Trends zu nutzen.

**Kernlogik (basierend auf typischen EMA-Trendstrategien):**

1.  **Trendbestimmung:** Die Strategie verwendet wahrscheinlich zwei EMAs mit unterschiedlichen Periodenlängen: einen schnellen EMA (kürzere Periode) und einen langsamen EMA (längere Periode).
    *   Ein **Aufwärtstrend** wird signalisiert, wenn der schnelle EMA den langsamen EMA von unten nach oben kreuzt.
    *   Ein **Abwärtstrend** wird signalisiert, wenn der schnelle EMA den langsamen EMA von oben nach unten kreuzt.

2.  **Kaufsignale (Long):** Ein Kaufsignal wird wahrscheinlich generiert, wenn ein klarer Aufwärtstrend etabliert ist. Zusätzliche Bedingungen könnten sein:
    *   Der aktuelle Kurs liegt über beiden EMAs.
    *   Ein Oszillator (wie RSI oder MACD, falls integriert) zeigt an, dass der Markt nicht überkauft ist.

3.  **Verkaufssignale (Short/Take-Profit):** Ein Verkaufssignal wird generiert, wenn:
    *   Der Trend sich umkehrt (schneller EMA kreuzt den langsamen EMA nach unten).
    *   Ein vordefinierter `take_profit` Prozentsatz erreicht wird.
    *   Ein `stop_loss` ausgelöst wird, um Verluste zu begrenzen.

### Analyse der Parameter und Voreinstellungs-Empfehlungen

Ich werde nun die spezifischen Parameter im Code analysieren, um Empfehlungen für die Voreinstellungen geben zu können. Typische Parameter für eine solche Strategie sind:

*   `period`: Die Zeitspanne der Kerzen (z.B. 1h, 4h, 1d).
*   `min_periods`: Die minimale Anzahl von Perioden, die für die Berechnung erforderlich sind.
*   `ema_short_period`: Die Periodenlänge für den schnellen EMA.
*   `ema_long_period`: Die Periodenlänge für den langsamen EMA.
*   `oversold_rsi`: RSI-Schwelle, unter der ein Kauf in Betracht gezogen wird.
*   `overbought_rsi`: RSI-Schwelle, über der ein Verkauf in Betracht gezogen wird.
*   `markup_pct`: Prozentsatz für den Take-Profit.
*   `markdown_pct`: Prozentsatz für den Stop-Loss.

**Allgemeine Empfehlungen für Voreinstellungen:**

*   **Zeithorizont:**
    *   **Kurzfristig (Scalping/Day-Trading):** Kürzere Perioden (`15m`, `1h`) mit engeren EMA-Einstellungen (z.B. `ema_short_period: 10`, `ema_long_period: 21`). Dies führt zu mehr, aber auch riskanteren Trades.
    *   **Langfristig (Swing-Trading):** Längere Perioden (`4h`, `1d`) mit weiteren EMA-Einstellungen (z.B. `ema_short_period: 50`, `ema_long_period: 200`). Dies führt zu weniger, aber tendenziell zuverlässigeren Signalen.

*   **Risikomanagement:**
    *   **Konservativ:** Setzen Sie einen niedrigeren `markup_pct` (z.B. 2-3%) und einen engeren `markdown_pct` (z.B. 1-2%), um Gewinne schnell mitzunehmen und Verluste zu begrenzen.
    *   **Aggressiv:** Ein höherer `markup_pct` (z.B. 5-10%) kann größere Gewinne ermöglichen, erhöht aber das Risiko, dass das Ziel nicht erreicht wird.

**Wichtiger Hinweis des Entwicklers:** Der Entwickler betont ausdrücklich, dass man ausgiebig Simulationen (`sims`) durchführen sollte, bevor man die Strategie mit echtem Geld einsetzt. Die optimale Konfiguration hängt stark vom jeweiligen Markt (z.B. Kryptowährungspaar) und den aktuellen Marktbedingungen ab.

