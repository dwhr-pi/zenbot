
### Dokumentation der `dema_avg` Strategie

Diese Zenbot-Strategie kombiniert zwei technische Indikatoren, um Kauf- und Verkaufssignale zu generieren: den **Double Exponential Moving Average (DEMA)** und den **Volume-Weighted Average Price (VWAP)**.

#### 1. Verwendete Indikatoren

*   **Double Exponential Moving Average (DEMA):** Dies ist ein Trendfolgeindikator, der darauf ausgelegt ist, den Lag (die Verzögerung) zu reduzieren, der bei traditionellen gleitenden Durchschnitten auftritt. Er reagiert schneller auf Preisänderungen, indem er zwei exponentielle gleitende Durchschnitte (EMAs) verwendet. Ein steigender DEMA über dem Preis signalisiert einen Aufwärtstrend, während ein fallender DEMA unter dem Preis auf einen Abwärtstrend hindeutet.
*   **Volume-Weighted Average Price (VWAP):** Der VWAP ist der durchschnittliche Preis eines Vermögenswerts über einen bestimmten Zeitraum, gewichtet nach dem Handelsvolumen. Er dient oft als Benchmark für Intraday-Händler und institutionelle Anleger. Preise, die über dem VWAP gehandelt werden, deuten auf eine bullische Stimmung hin, während Preise unter dem VWAP eine bärische Stimmung signalisieren.

#### 2. Strategie-Logik

Die `dema_avg` Strategie generiert Handelssignale basierend auf dem Zusammenspiel dieser beiden Indikatoren und dem aktuellen Preis.

**Kaufsignal (Long-Position):**
Ein Kaufsignal wird ausgelöst, wenn **alle** der folgenden Bedingungen erfüllt sind:
1.  Der aktuelle Schlusskurs des Vermögenswerts ist **höher** als der VWAP.
2.  Der DEMA-Wert ist **höher** als der VWAP.
3.  Der Trend des DEMA ist **positiv** (d.h., der DEMA-Wert steigt).

Dies deutet auf einen starken Aufwärtstrend hin, bei dem sowohl der Preis als auch der schnell reagierende Trendindikator (DEMA) über dem volumengewichteten Durchschnittspreis (VWAP) liegen und der Trend an Stärke gewinnt.

**Verkaufssignal (Short-Position oder Schließen der Long-Position):**
Ein Verkaufssignal wird ausgelöst, wenn **alle** der folgenden Bedingungen erfüllt sind:
1.  Der aktuelle Schlusskurs des Vermögenswerts ist **niedriger** als der VWAP.
2.  Der DEMA-Wert ist **niedriger** als der VWAP.
3.  Der Trend des DEMA ist **negativ** (d.h., der DEMA-Wert fällt).

Dies deutet auf einen starken Abwärtstrend hin, bei dem sowohl der Preis als auch der DEMA unter den VWAP gefallen sind und der Abwärtstrend sich fortsetzt.

### Empfehlungen für Voreinstellungen (Parameter)

Die Strategie verwendet mehrere konfigurierbare Parameter. Die optimalen Werte hängen stark vom gehandelten Währungspaar, dem Zeitrahmen (Periode) und den Marktbedingungen ab. Es ist entscheidend, Simulationen (`sims`) durchzuführen, um die besten Einstellungen für Ihr spezifisches Szenario zu finden.

Hier sind die wichtigsten Parameter und allgemeine Empfehlungen als Ausgangspunkt:

| Parameter | Beschreibung | Empfehlung als Startpunkt | Begründung |
| :--- | :--- | :--- | :--- |
| `period_length` | Die Zeitspanne für jede Kerze (z.B. `1h` für eine Stunde, `15m` für 15 Minuten). | `15m` - `2h` | Kürzere Perioden führen zu mehr Handelssignalen, können aber auch mehr "Rauschen" und Fehlsignale erzeugen. Längere Perioden glätten die Trends, reagieren aber langsamer. |
| `min_periods` | Die minimale Anzahl von Perioden, die für die Berechnung der Indikatoren benötigt werden. | `52` | Dies ist ein üblicher Wert, der genügend Daten für eine stabile Berechnung der gleitenden Durchschnitte bereitstellt. |
| `dema_opt.period` | Die Anzahl der Perioden, die zur Berechnung des DEMA verwendet wird. | `10` - `21` | Ein kürzerer Zeitraum (z.B. 10) macht den DEMA reaktionsschneller, was zu früheren, aber möglicherweise riskanteren Signalen führt. Ein längerer Zeitraum (z.B. 21) glättet den Indikator und reduziert Fehlsignale, reagiert aber langsamer. |
| `vwap_opt.period` | Die Anzahl der Perioden, die zur Berechnung des VWAP verwendet wird. | `10` - `21` | Ähnlich wie beim DEMA. Es ist oft sinnvoll, die Perioden für DEMA und VWAP ähnlich zu halten, um ihre Interaktion konsistent zu gestalten. |
| `profit_stop_enable_pct` | Prozentsatz des Gewinns, bei dem ein Trailing-Stop-Loss aktiviert wird. | `1` - `5` | Beginnen Sie mit einem niedrigeren Wert, um Gewinne frühzeitig zu sichern. Passen Sie ihn basierend auf der Volatilität des Marktes an. |
| `profit_stop_pct` | Prozentsatz, den der Preis vom Höchststand fallen darf, bevor ein Verkauf ausgelöst wird. | `1` - `3` | Ein engerer Stop (z.B. 1%) sichert mehr Gewinn, kann aber bei kleineren Korrekturen zu einem vorzeitigen Verkauf führen. |
| `sell_stop_pct` | Ein sofortiger Stop-Loss, der ausgelöst wird, wenn der Preis nach dem Kauf um diesen Prozentsatz fällt. | `0` (deaktiviert) oder `1` - `2` | Seien Sie vorsichtig mit diesem Parameter. Ein zu enger Stop kann bei normaler Marktvolatilität zu Verlusten führen. Es kann besser sein, sich auf die Verkaufssignale der Strategie zu verlassen. |
| `buy_stop_pct` | Legt eine Limit-Order fest, die um diesen Prozentsatz über dem aktuellen Preis liegt, um Slippage zu vermeiden. | `0` (deaktiviert) | In den meisten Fällen ist es besser, diesen Parameter deaktiviert zu lassen, um sicherzustellen, dass Kaufaufträge zum Marktpreis ausgeführt werden, wenn ein Signal auftritt. |

**Wichtiger Hinweis:** Wie der Autor der Strategie betont, ist das ausgiebige Testen durch Simulationen unerlässlich. Die hier genannten Werte sind lediglich Ausgangspunkte. Die "perfekte" Konfiguration gibt es nicht; sie muss an das jeweilige Handelspaar und die Marktbedingungen angepasst werden.

