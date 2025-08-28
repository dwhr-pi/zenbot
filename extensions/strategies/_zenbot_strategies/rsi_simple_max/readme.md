
### Dokumentation der `rsi_simple_max` Strategie

Diese Zenbot-Strategie ist eine einfache, auf dem Relative Strength Index (RSI) basierende Handelslogik. Der RSI ist ein Momentum-Oszillator, der die Geschwindigkeit und Veränderung von Preisbewegungen misst und dabei hilft, überkaufte und überverkaufte Marktbedingungen zu identifizieren.

#### Funktionsweise der Strategie

Die Strategie generiert Kauf- und Verkaufssignale basierend auf den folgenden Regeln:

*   **Kaufsignal (Long Signal):** Ein Kaufsignal wird ausgelöst, wenn der RSI-Wert die definierte "überverkaufte" Schwelle (`rsi_oversold`) unterschreitet. Dies deutet darauf hin, dass der Markt möglicherweise überverkauft ist und eine Preiserholung bevorstehen könnte.
*   **Verkaufssignal (Short Signal):** Ein Verkaufssignal wird ausgelöst, wenn der RSI-Wert die definierte "überkaufte" Schwelle (`rsi_overbought`) überschreitet. Dies deutet darauf hin, dass der Markt überkauft sein könnte und eine Preiskorrektur wahrscheinlich ist.

Die Strategie ist als "Trend-Gegenbewegung" (Mean Reversion) konzipiert, da sie darauf wettet, dass der Preis nach dem Erreichen von Extremwerten wieder zum Mittelwert zurückkehrt.

---

### Parameter und Voreinstellungs-Empfehlungen

Die Strategie verwendet mehrere konfigurierbare Parameter. Hier sind die wichtigsten und meine Empfehlungen dazu:

| Parameter | Beschreibung | Standardwert | Empfehlung & Begründung |
| :--- | :--- | :--- | :--- |
| **`period`** | Die Anzahl der Kerzen (Zeitperioden), die zur Berechnung des RSI verwendet werden. | `14d` | **`9` bis `14`**: Der Standardwert `14` ist ein guter Ausgangspunkt für die meisten Märkte. Für kurzfristigere Zeitrahmen (z.B. 5-Minuten-Charts) kann ein kürzerer Zeitraum wie `9` oder `10` reaktionsschnellere Signale liefern. Längere Zeiträume (z.B. `21`) glätten den Indikator und reduzieren die Anzahl der Signale. |
| **`rsi_oversold`** | Die untere RSI-Schwelle. Fällt der RSI darunter, wird ein Kaufsignal in Betracht gezogen. | `30` | **`20` bis `40`**: Der Standardwert `30` ist weit verbreitet. In starken Aufwärtstrends kann eine Anhebung auf `40` sinnvoll sein, um frühere Einstiege zu finden. In sehr volatilen Märkten kann eine Absenkung auf `20` helfen, Fehlsignale zu vermeiden. |
| **`rsi_overbought`** | Die obere RSI-Schwelle. Steigt der RSI darüber, wird ein Verkaufssignal in Betracht gezogen. | `70` | **`60` bis `80`**: Ähnlich wie bei `rsi_oversold` ist `70` der Standard. In starken Abwärtstrends kann eine Absenkung auf `60` bessere Ausstiege ermöglichen. Eine Anhebung auf `80` kann in stark trendenden Märkten nützlich sein, um nicht zu früh zu verkaufen. |

#### Wichtige Hinweise für die Praxis

*   **Backtesting ist entscheidend:** Wie der Entwickler anderer Zenbot-Strategien betont, gibt es keine universell "gewinnende Strategie". Die optimalen Einstellungen hängen stark vom gehandelten Währungspaar, dem Zeitrahmen und der Börse ab. Führen Sie daher immer Simulationen (Backtests) mit historischen Daten durch, bevor Sie echtes Geld einsetzen.
*   **Marktbedingungen beachten:** Reine RSI-Strategien funktionieren am besten in Seitwärtsmärkten (ranging markets). In starken Trendphasen können sie zu vielen verfrühten Verkaufssignalen (in einem Aufwärtstrend) oder Kaufsignalen (in einem Abwärtstrend) führen.
*   **Kombination mit anderen Indikatoren:** Für robustere Signale kann es sinnvoll sein, den RSI mit anderen Indikatoren zu kombinieren, wie zum Beispiel einem gleitenden Durchschnitt (Moving Average), um den übergeordneten Trend zu bestätigen.

Ich hoffe, diese Analyse hilft Ihnen weiter!
