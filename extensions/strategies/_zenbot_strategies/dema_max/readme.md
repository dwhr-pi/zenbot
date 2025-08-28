
### Dokumentation der `dema_max` Strategie

Die Strategie `dema_max` ist eine Trendfolge-Strategie, die den technischen Indikator "Double Exponential Moving Average" (DEMA) verwendet, um Kauf- und Verkaufssignale zu generieren. DEMA wurde entwickelt, um die Verzögerung zu reduzieren, die bei traditionellen gleitenden Durchschnitten auftritt, indem den jüngsten Preisen mehr Gewicht beigemessen wird. Dies macht den Indikator reaktionsschneller auf Preisänderungen.

**Kernlogik der Strategie:**

1.  **Indikatoren:** Die Strategie verwendet primär einen DEMA-Indikator.
2.  **Kaufsignal (Long):** Ein Kaufsignal wird ausgelöst, wenn der Schlusskurs des Assets über den berechneten DEMA-Wert steigt. Dies deutet auf den Beginn eines Aufwärtstrends hin.
3.  **Verkaufssignal (Short):** Ein Verkaufssignal wird ausgelöst, wenn der Schlusskurs des Assets unter den DEMA-Wert fällt. Dies deutet auf den Beginn eines Abwärtstrends hin.

Die Strategie ist relativ einfach und zielt darauf ab, von neuen Trends zu profitieren, sobald diese durch das Kreuzen des Preises mit dem DEMA-Indikator identifiziert werden.

### Parameter der Strategie

Die Strategie enthält mehrere konfigurierbare Parameter, die Sie an Ihre Bedürfnisse anpassen können:

*   `period`: Dies ist die Hauptperiode für die Berechnung des DEMA. Eine kürzere Periode (z.B. 10) reagiert schneller auf Preisänderungen und erzeugt mehr Signale, was für kurzfristiges Handeln nützlich sein kann. Eine längere Periode (z.B. 50) ist glatter, reagiert langsamer und eignet sich besser zur Identifizierung langfristiger Trends.
*   `min_periods`: Die minimale Anzahl von Datenpunkten (Kerzen), die erforderlich sind, bevor die Strategie mit der Berechnung beginnt. Dieser Wert sollte in der Regel mindestens so hoch wie die `period` sein.
*   `oversold_rsi_periods`, `oversold_rsi`: Diese Parameter können optional einen RSI (Relative Strength Index) hinzufügen, um zu vermeiden, bei überkauften Bedingungen zu kaufen. Wenn der RSI über dem `oversold_rsi`-Wert liegt, werden Kaufsignale möglicherweise ignoriert.
*   `ema_short_period`, `ema_long_period`: Diese Parameter deuten darauf hin, dass die Strategie optional auch einen kurz- und langfristigen EMA zur Trendbestätigung verwenden kann.
*   `up_trend_threshold`, `down_trend_threshold`: Schwellenwerte, die definieren, wie stark der Trend sein muss, bevor ein Signal als gültig betrachtet wird.
*   `overbought_rsi_periods`, `overbought_rsi`: Ähnlich wie die "oversold"-Parameter, aber für Verkaufsentscheidungen. Sie können helfen, Verkäufe in überverkauften Märkten zu vermeiden.

### Empfehlungen für Voreinstellungen

Die optimalen Einstellungen hängen stark vom gehandelten Asset, dem Zeitrahmen (z.B. 1h, 4h, 1d) und den aktuellen Marktbedingungen ab. Es ist entscheidend, Simulationen (Backtests) durchzuführen, um die besten Parameter für Ihr spezifisches Szenario zu finden.

**Allgemeine Empfehlungen:**

*   **Für Swing-Trading (mittelfristig, z.B. 4h- oder 1d-Charts):**
    *   `period`: Beginnen Sie mit Werten zwischen `20` und `50`. Eine gängige Kombination ist die Verwendung eines 20er- und 50er-DEMA.
    *   `oversold_rsi`: Setzen Sie diesen Wert auf etwa `70`, um Käufe in überkauften Märkten zu filtern.
    *   `overbought_rsi`: Setzen Sie diesen Wert auf etwa `30`.

*   **Für Day-Trading (kurzfristig, z.B. 15m- oder 1h-Charts):**
    *   `period`: Probieren Sie kürzere Perioden wie `9`, `12` oder `21`. Kürzere Perioden reagieren schneller, was im Day-Trading entscheidend sein kann.
    *   Passen Sie die RSI-Schwellenwerte möglicherweise enger an oder deaktivieren Sie sie, da kurzfristige Märkte anfälliger für "Rauschen" sind.

**Wichtiger Hinweis:** Wie bei jeder Handelsstrategie gibt es keine Garantie für Gewinne. Die `dema_max`-Strategie ist, wie viele trendfolgende Systeme, anfällig für Verluste in seitwärts tendierenden oder stark schwankenden Märkten. Führen Sie immer eigene Tests durch und setzen Sie Risikomanagement-Techniken wie Stop-Loss-Orders ein.

