
### **Dokumentation der "3trend"-Strategie**

Die Strategie `3trend` aus dem von Ihnen verlinkten Repository ist eine Kombination aus drei verschiedenen Indikatoren, um Kauf- und Verkaufssignale zu generieren. Das Ziel ist es, die Zuverlässigkeit der Signale durch die Bestätigung eines Trends über mehrere Indikatoren hinweg zu erhöhen.

#### **1. Verwendete Indikatoren**

Die Strategie stützt sich auf die folgenden drei technischen Indikatoren:

*   **EMA (Exponential Moving Average):** Ein gleitender Durchschnitt, der neueren Kursdaten mehr Gewicht verleiht. Er wird verwendet, um die allgemeine Trendrichtung zu bestimmen.
*   **MACD (Moving Average Convergence Divergence):** Ein Trendfolge-Momentum-Indikator, der die Beziehung zwischen zwei exponentiellen gleitenden Durchschnitten eines Wertpapierkurses anzeigt. Er hilft, die Stärke und Richtung eines Trends zu identifizieren.
*   **RSI (Relative Strength Index):** Ein Momentum-Oszillator, der die Geschwindigkeit und Veränderung von Kursbewegungen misst. Er wird verwendet, um überkaufte oder überverkaufte Bedingungen im Markt zu erkennen.

#### **2. Funktionsweise und Logik**

Die Kernidee der Strategie ist, nur dann zu handeln, wenn alle drei Indikatoren ein übereinstimmendes Signal geben.

*   **Kaufsignal (Long Signal):** Ein Kaufsignal wird generiert, wenn die folgenden Bedingungen gleichzeitig erfüllt sind:
    *   Der Kurs liegt über dem EMA, was auf einen **Aufwärtstrend** hindeutet.
    *   Der MACD ist positiv (die MACD-Linie liegt über der Signallinie), was das **bullische Momentum** bestätigt.
    *   Der RSI liegt in einem bestimmten Bereich (typischerweise nicht im überkauften Bereich), was anzeigt, dass noch **Potenzial für eine Aufwärtsbewegung** besteht.

*   **Verkaufssignal (Short Signal):** Ein Verkaufssignal wird generiert, wenn die folgenden Bedingungen gleichzeitig erfüllt sind:
    *   Der Kurs liegt unter dem EMA, was auf einen **Abwärtstrend** hindeutet.
    *   Der MACD ist negativ (die MACD-Linie liegt unter der Signallinie), was das **bärische Momentum** bestätigt.
    *   Der RSI liegt in einem bestimmten Bereich (typischerweise nicht im überverkauften Bereich), was anzeigt, dass noch **Potenzial für eine Abwärtsbewegung** besteht.

### **Voreinstellungs-Empfehlungen**

Die optimalen Einstellungen für eine Zenbot-Strategie hängen stark vom gehandelten Währungspaar, der Börse und den aktuellen Marktbedingungen (Volatilität, Trendstärke) ab. Es ist unerlässlich, eigene Tests (Backtesting und Paper-Trading) durchzuführen, bevor echtes Kapital eingesetzt wird.

Hier sind einige allgemeine Empfehlungen und Ausgangspunkte für die Parameter der `3trend`-Strategie, die Sie für Ihre Simulationen verwenden können:

| Parameter | Empfehlung | Beschreibung |
| :--- | :--- | :--- |
| **`period_length`** | `5m` - `2h` | Die Länge der Kerzen (Candles). Kürzere Perioden (`5m`, `15m`) führen zu mehr Trades und eignen sich für Day-Trading. Längere Perioden (`1h`, `2h`) führen zu weniger, aber potenziell signifikanteren Trades und eignen sich für Swing-Trading. |
| **`ema_short_period`** | `10` - `21` | Die Periode für den kürzeren EMA. Ein kleinerer Wert reagiert schneller auf Kursänderungen. |
| **`ema_long_period`** | `21` - `55` | Die Periode für den längeren EMA. Dieser dient als Basis-Trendindikator. |
| **`macd_short_period`** | `12` | Standardeinstellung für die schnellere EMA-Linie im MACD. |
| **`macd_long_period`** | `26` | Standardeinstellung für die langsamere EMA-Linie im MACD. |
| **`macd_signal_period`** | `9` | Standardeinstellung für die Signallinie des MACD. |
| **`rsi_periods`** | `14` | Die Standardperiode für den RSI. |
| **`oversold_rsi`** | `20` - `30` | Der RSI-Wert, unter dem der Markt als "überverkauft" gilt. Ein Kaufsignal könnte hier stärker gewichtet werden. |
| **`overbought_rsi`** | `70` - `80` | Der RSI-Wert, über dem der Markt als "überkauft" gilt. Ein Verkaufssignal könnte hier stärker gewichtet werden. |
| **`sell_stop_pct`** | `2` - `5` | Ein prozentualer Wert, der einen Stop-Loss-Verkauf auslöst, um Verluste zu begrenzen. |
| **`profit_stop_enable_pct`** | `5` - `10` | Aktiviert einen Trailing-Stop, nachdem ein bestimmter prozentualer Gewinn erreicht wurde. |
| **`profit_stop_pct`** | `1` - `3` | Der prozentuale Rückgang vom Höchststand, der einen Verkauf auslöst, nachdem der Trailing-Stop aktiviert wurde. |

**Wichtiger Hinweis:** Die Strategie im verlinkten Repository (`dwhr-pi/zenbot`) ist als "unstable" (instabil) gekennzeichnet und wurde seit mehreren Jahren nicht mehr aktualisiert. Das bedeutet, sie ist möglicherweise nicht mit den neuesten Versionen von Zenbot kompatibel und sollte mit äußerster Vorsicht verwendet werden.

### **Zusammenfassende Bewertung**

*   **Stärken:** Die Kombination von drei Indikatoren kann die Anzahl von Fehlsignalen ("Whipsaws") reduzieren, die bei der Verwendung eines einzelnen Indikators auftreten können. Dies führt potenziell zu qualitativ hochwertigeren Trades.
*   **Schwächen:** In seitwärts tendierenden oder wenig volatilen Märkten ("Choppy Markets") könnte die Strategie Schwierigkeiten haben, klare Signale zu generieren, da die Indikatoren widersprüchliche Informationen liefern können. Dies kann zu verpassten Gelegenheiten oder späten Ein- und Ausstiegen führen.
*   **Risiko:** Wie bei jeder automatisierten Handelsstrategie besteht ein erhebliches finanzielles Risiko. Falsche Parameter oder unvorhergesehene Marktbedingungen können zu erheblichen Verlusten führen. Der Entwickler des Repositories betont selbst, dass Simulationen unerlässlich sind.

**Empfehlung:** Beginnen Sie mit Paper-Trading auf einer Börse mit hoher Liquidität (z.B. Binance) und einem liquiden Handelspaar (z.B. BTC/USDT). Führen Sie umfangreiche Backtests mit verschiedenen Parametern und Zeiträumen durch, um ein Gefühl für die Leistung der Strategie zu bekommen.
