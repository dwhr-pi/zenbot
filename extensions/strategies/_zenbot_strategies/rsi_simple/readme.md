
Leider führt der von Ihnen angegebene Link zu einem GitHub-Repository (`dwhr-pi/zenbot`), das anscheinend nicht mehr existiert oder privat ist. Daher kann ich den spezifischen Code dieser Strategie nicht direkt analysieren.

Allerdings konnte ich eine Standard-Implementierung einer `rsi_simple`-Strategie in einem anderen öffentlichen Zenbot-Repository finden. Basierend auf diesem und dem allgemeinen Verständnis von RSI-Strategien kann ich Ihnen eine allgemeine Dokumentation und Empfehlungen geben.

### Dokumentation der "rsi_simple" Strategie

Die `rsi_simple` Strategie ist eine grundlegende Handelsstrategie, die auf dem **Relative Strength Index (RSI)** Indikator basiert. Der RSI ist ein Momentum-Oszillator, der die Geschwindigkeit und Veränderung von Preisbewegungen misst. Er oszilliert zwischen 0 und 100.

**Grundprinzip:**
*   **Kaufsignal (Buy):** Die Strategie generiert ein Kaufsignal, wenn der RSI einen bestimmten "überverkauften" Schwellenwert unterschreitet. Dies deutet darauf hin, dass der Vermögenswert möglicherweise unterbewertet ist und eine Preiserholung bevorstehen könnte.
*   **Verkaufssignal (Sell):** Ein Verkaufssignal wird ausgelöst, wenn der RSI einen "überkauften" Schwellenwert überschreitet. Dies signalisiert, dass der Vermögenswert möglicherweise überbewertet ist und eine Preiskorrektur wahrscheinlich ist.

---

### Konfigurierbare Parameter und Voreinstellungs-Empfehlungen

Hier sind die typischen Parameter, die Sie in einer solchen Strategie konfigurieren können, zusammen mit Empfehlungen.

| Parameter | Beschreibung | Standardwert | Empfehlung | Begründung |
| :--- | :--- | :--- | :--- | :--- |
| `period` | Die Anzahl der Kerzen (Zeitperioden), die zur Berechnung des RSI verwendet werden. | `14` | `14` - `21` | `14` ist der am weitesten verbreitete Standardwert für den RSI. Kürzere Perioden machen den Indikator empfindlicher, was zu mehr Signalen (und Fehlsignalen) führt. Längere Perioden glätten den Indikator und führen zu weniger, aber potenziell zuverlässigeren Signalen. |
| `min_periods` | Die minimale Anzahl von Perioden, die benötigt werden, bevor die Strategie zu handeln beginnt. | `52` | `20` - `50` | Dieser Wert sollte mindestens so groß wie die `period` sein, oft aber größer, um dem Indikator Zeit zu geben, sich zu "stabilisieren" und aussagekräftige Werte zu liefern. |
| `rsi_oversold` | Der RSI-Schwellenwert, unter dem ein Kaufsignal ausgelöst wird. | `30` | `20` - `35` | Ein Wert von `30` ist ein gängiger Standard. Ein niedrigerer Wert (z.B. `20`) ist konservativer und signalisiert einen stärker überverkauften Zustand, was zu weniger, aber potenziell sichereren Käufen führt. |
| `rsi_overbought` | Der RSI-Schwellenwert, über dem ein Verkaufssignal ausgelöst wird. | `70` | `65` - `80` | `70` ist hier ebenfalls der Standard. Ein höherer Wert (z.B. `80`) ist konservativer und wartet auf einen stärker überkauften Zustand, bevor verkauft wird, was das Risiko eines zu frühen Verkaufs verringert. |

**Wichtiger Hinweis:** Die optimalen Einstellungen hängen stark von mehreren Faktoren ab:
*   **Handelspaar:** Volatile Paare (z.B. "Shitcoins") verhalten sich anders als stabile Paare (z.B. BTC/EUR).
*   **Marktbedingungen:** In einem starken Bullenmarkt können "überkaufte" Zustände lange anhalten. In einem Bärenmarkt können "überverkaufte" Zustände die Norm sein.
*   **Zeitrahmen (Periodenlänge):** Die Strategie verhält sich auf einem 5-Minuten-Chart anders als auf einem 4-Stunden-Chart.

Der Entwickler eines ähnlichen Repositories betont wiederholt: **"Run sims, run sims, run sims."** Führen Sie ausgiebige Simulationen (Backtests) mit historischen Daten durch, um die besten Einstellungen für Ihr spezifisches Szenario zu finden, bevor Sie echtes Geld riskieren.

---
Als Nächstes könnten wir Folgendes tun:

1.  **Suche nach alternativen Implementierungen:** Ich kann versuchen, andere öffentliche Versionen der `rsi_simple`-Strategie zu finden, um deren Code zu vergleichen.
2.  **Kombination mit anderen Indikatoren:** Wir können diskutieren, wie man diese einfache RSI-Strategie mit anderen Indikatoren (z.B. MACD, Moving Averages) kombinieren kann, um die Signalqualität zu verbessern.
3.  **Analyse einer anderen Strategie:** Falls Sie eine andere Zenbot-Strategie im Sinn haben, kann ich diese für Sie analysieren.
