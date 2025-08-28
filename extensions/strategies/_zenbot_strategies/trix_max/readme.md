
### Dokumentation der "trix_max" Zenbot-Strategie

Diese Strategie nutzt eine Kombination aus dem **TRIX-Indikator** und dem **Stochastischen RSI**, um Kauf- und Verkaufssignale zu generieren. Das Ziel ist es, von Trendbewegungen zu profitieren und gleichzeitig überkaufte oder überverkaufte Marktbedingungen zu berücksichtigen.

#### Kernindikatoren:

1.  **TRIX (Triple Exponential Average)**:
    *   Dies ist ein Momentum-Oszillator, der den prozentualen Veränderungsgrad eines dreifach exponentiell geglätteten gleitenden Durchschnitts anzeigt.
    *   Er wird verwendet, um Markttrends zu identifizieren und unbedeutende Preisbewegungen herauszufiltern.
    *   Ein positiver TRIX-Wert (über Null) deutet auf einen Aufwärtstrend hin, während ein negativer Wert (unter Null) auf einen Abwärtstrend hindeutet.
    *   Das Kreuzen der Nulllinie wird oft als Kauf- (von unten nach oben) oder Verkaufssignal (von oben nach unten) interpretiert.

2.  **Stochastischer RSI (StochRSI)**:
    *   Dieser Indikator ist ein Oszillator, der den RSI-Wert in die Stochastik-Formel einsetzt. Er misst also die Geschwindigkeit und das Momentum des RSI selbst.
    *   Er bewegt sich zwischen 0 und 100 und wird verwendet, um überkaufte (typischerweise über 80) und überverkaufte (typischerweise unter 20) Bedingungen zu identifizieren.

#### Strategielogik:

Die Strategie kombiniert die Signale dieser beiden Indikatoren, um Handelsentscheidungen zu treffen:

**Kaufsignal (Long-Position):**

Ein Kaufsignal wird unter den folgenden Bedingungen generiert:

1.  Der **TRIX-Indikator kreuzt die Nulllinie von unten nach oben**. Dies signalisiert den Beginn eines potenziellen Aufwärtstrends.
2.  Gleichzeitig befindet sich der **Stochastische RSI in einem überverkauften Bereich** (gemäß den Einstellungen, typischerweise unter 20 oder 30). Dies deutet darauf hin, dass der Kurs kurzfristig "überverkauft" war und eine Aufwärtskorrektur oder ein neuer Aufwärtstrend wahrscheinlich ist.
3.  Der TRIX-Wert muss zudem unter einem in den Optionen definierten maximalen Schwellenwert (`buy_level`) liegen, um zu verhindern, dass in einen bereits zu weit fortgeschrittenen Trend eingestiegen wird.

**Verkaufssignal (Schließen der Long-Position):**

Ein Verkaufssignal wird unter einer der folgenden Bedingungen generiert:

1.  Der **TRIX-Indikator kreuzt die Nulllinie von oben nach unten**. Dies signalisiert das Ende des Aufwärtstrends.
2.  Der **Stochastische RSI erreicht einen überkauften Bereich** (typischerweise über 70 oder 80). Dies deutet darauf hin, dass der Aufwärtstrend an Momentum verliert und eine Korrektur bevorstehen könnte.
3.  Der TRIX-Wert überschreitet einen bestimmten Schwellenwert (`sell_level`), was auf eine überhitzte Marktlage hindeutet.

### Empfehlungen für Voreinstellungen (Params)

Die optimalen Einstellungen hängen stark vom gehandelten Währungspaar, dem Zeitrahmen (Periode) und der allgemeinen Marktvolatilität ab. Die im Code hinterlegten Standardwerte sind ein guter Ausgangspunkt. Hier sind einige Empfehlungen und Erklärungen zu den wichtigsten Parametern:

| Parameter | Standardwert | Empfehlung & Erklärung |
| :--- | :--- | :--- |
| `period` | `1h` | **Empfehlung:** Beginnen Sie mit `1h` oder `4h`. Kürzere Zeiträume (`15m`, `30m`) führen zu mehr Signalen, aber auch zu mehr Fehlsignalen (Rauschen). Längere Zeiträume sind tendenziell zuverlässiger, generieren aber weniger Trades. |
| `trix_len` | `9` | **Empfehlung:** `9` bis `18`. Dies ist die Periode für den TRIX-Indikator. Ein kürzerer Wert (`9`) macht den Indikator empfindlicher für Preisänderungen. Ein längerer Wert (`18`) glättet die Kurve stärker und reduziert Fehlsignale, reagiert aber langsamer. |
| `stoch_k` | `14` | **Empfehlung:** `14` ist ein Standardwert und sollte für den Anfang beibehalten werden. Dieser Wert definiert die Periode für die Stochastik-Berechnung. |
| `stoch_d` | `3` | **Empfehlung:** `3` ist ein Standardwert. Dies ist die Glättungsperiode für die %D-Linie des Stochastik-Indikators. |
| `stoch_k_sell` | `70` | **Empfehlung:** `70` bis `80`. Dies ist der Schwellenwert für den überkauften Bereich des StochRSI. Ein Verkaufssignal wird ausgelöst, wenn dieser Wert überschritten wird. Ein höherer Wert (z.B. `80`) führt zu späteren Verkäufen, kann aber mehr Gewinn mitnehmen. |
| `buy_level` | `0.1` | **Empfehlung:** `-0.05` bis `0.1`. Dieser Wert verhindert einen Kauf, wenn der TRIX bereits stark positiv ist. Ein Wert nahe Null stellt sicher, dass nur bei beginnenden Trends gekauft wird. |
| `sell_level` | `0.5` | **Empfehlung:** `0.4` bis `0.8`. Dies ist ein zusätzlicher Verkaufsschwellenwert für den TRIX. Wenn der TRIX diesen Wert überschreitet, wird verkauft, da von einer extremen Überhitzung ausgegangen wird. |

**Wichtiger Hinweis:** Führen Sie immer Backtests (Simulationen) mit historischen Daten durch, bevor Sie eine Strategie mit realem Geld einsetzen. Passen Sie die Parameter schrittweise an und analysieren Sie die Ergebnisse, um die besten Einstellungen für Ihr spezifisches Szenario zu finden.


