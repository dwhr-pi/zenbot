# Zenbot Strategie: grid_waka (Waka Waka EA Portierung)

Diese Dokumentation beschreibt die Zenbot-Strategie "grid_waka", die auf der Grid-Trading-Logik des Waka Waka Expert Advisors (MQL4) basiert und für den Handel mit Kryptowährungen optimiert wurde.

## 1. Strategie-Kernlogik

Die Strategie ist ein **konservativer Grid-Trader**, der auf Mean-Reversion (Rückkehr zum Mittelwert) basiert.

| Komponente | Beschreibung |
| :--- | :--- |
| **Einstiegssignal** | Kombination aus **Bollinger Bändern (BB)** und **Relative Strength Index (RSI)**. Ein Grid wird nur gestartet, wenn der Preis die BB durchbricht und der RSI einen extrem überkauften (SELL) oder überverkauften (BUY) Zustand signalisiert. |
| **Grid-Management (DCA)** | Wenn sich der Markt gegen die anfängliche Position bewegt, werden weitere Orders in die gleiche Richtung hinzugefügt. Die Positionsgröße wird mit einem **Lot-Multiplikator** erhöht, um den durchschnittlichen Einstiegspreis schnell zu verbessern. |
| **Gewinnmitnahme (TP)** | Das gesamte Grid wird geschlossen, sobald der Gesamtgewinn aller offenen Positionen den definierten **Take-Profit-Prozentsatz** erreicht. |
| **Risikomanagement (SL)** | Ein Notfall-Stop-Loss schließt das gesamte Grid, wenn der nicht realisierte Verlust (Drawdown) einen kritischen Schwellenwert überschreitet. |

## 2. Optimierte Parameter (Lauf 5)

Die Strategie wurde über einen 6-monatigen Backtest auf BTC/USDT (15m) optimiert, um das Risiko (Max. Drawdown) zu minimieren, während die Profitabilität erhalten bleibt.

| Parameter | Wert | Beschreibung |
| :--- | :--- | :--- |
| `period` | `15m` | Handelszeitrahmen. |
| `bb_period` | `35` | Periode für die Bollinger Bänder. |
| `rsi_period` | `20` | Periode für den RSI. |
| `rsi_buy_trigger` | `15` | RSI-Level für Kaufsignal (überverkauft). |
| `rsi_sell_trigger` | `85` | RSI-Level für Verkaufssignal (überkauft). |
| **`grid_distance`** | **`1.0`** | Abstand (%) zum Hinzufügen der nächsten Grid-Order. |
| **`lot_multiplier`** | **`1.2`** | Multiplikator für die Größe der nächsten Order (Konservativ). |
| `max_grid_orders` | `5` | Maximale Anzahl von Orders im Grid. |
| **`take_profit`** | **`1.2`** | Zielgewinn (%) für das gesamte Grid. |
| **`stop_loss`** | **`25`** | Maximaler Drawdown (%) für das gesamte Grid (Notbremse). |

## 3. Backtesting-Ergebnisse (6 Monate, BTC/USDT)

Die finale, konservative Konfiguration (Lauf 5) zeigte folgende Performance im Vergleich zur aggressiven Version (Lauf 4):

| Kennzahl | Aggressiv (Lot: 1.6, SL: 30%) | Konservativ (Lot: 1.2, SL: 25%) |
| :--- | :--- | :--- |
| **Gesamtgewinn** | +14.83% | **+11.56%** |
| **Max. Drawdown** | -28.55% | **-19.85%** |
| **Stop-Loss-Ereignisse** | 1 | **0** |

**Fazit:** Die konservative Konfiguration reduziert den maximalen Drawdown um fast 30% und vermeidet kritische Stop-Loss-Ereignisse, was sie zur deutlich robusteren und sichereren Wahl für den Live-Handel macht.

## 4. Installation

1.  Kopieren Sie die Datei `grid_waka.js` in das `extensions/strategies/` Verzeichnis Ihrer Zenbot-Installation.
2.  Führen Sie den Backtest oder Live-Handel mit den oben genannten Parametern aus.
3.  **Wichtig:** Passen Sie den Parameter `order_size_pct` an Ihr Risikoprofil an. Er bestimmt die Größe der ersten Order als Prozentsatz Ihres gesamten Handelskapitals.
