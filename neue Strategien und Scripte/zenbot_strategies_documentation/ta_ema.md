# TA_EMA Strategie

## Beschreibung
Die TA_EMA Strategie ist eine technische Handelsstrategie, die auf dem exponentiellen gleitenden Durchschnitt (EMA) basiert. Sie kauft, wenn der EMA im Vergleich zum vorherigen EMA-Wert steigt, und verkauft, wenn der EMA im Vergleich zum vorherigen EMA-Wert fällt. Optional kann die Strategie auch bei niedrigem RSI (Relative Strength Index) kaufen.

## Funktionsweise
Die Strategie berechnet einen Trend-EMA über eine bestimmte Anzahl von Perioden und vergleicht den aktuellen Wert mit dem vorherigen Wert. Ein steigender EMA deutet auf einen Aufwärtstrend hin und generiert ein Kaufsignal, während ein fallender EMA auf einen Abwärtstrend hindeutet und ein Verkaufssignal erzeugt.

Zusätzlich kann die Strategie den RSI verwenden, um überverkaufte Bedingungen zu identifizieren und zusätzliche Kaufsignale zu generieren. Der Parameter `neutral_rate` hilft dabei, kleine Schwankungen zu filtern und nur signifikante Trendbewegungen zu berücksichtigen.

## Beste Voreinstellungen
```
--period=10m
--min_periods=52
--trend_ema=20
--neutral_rate=0.06
--oversold_rsi_periods=20
--oversold_rsi=30
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Mittelfristige Handelsstrategien
- Als Basis für komplexere Strategien
- Für Händler, die einfache, aber effektive Trendfolgestrategien bevorzugen

## Vorteile
- Einfach zu verstehen und zu implementieren
- Effektiv bei der Identifizierung von Trendrichtungen
- Kann mit RSI kombiniert werden, um überverkaufte Bedingungen zu erkennen
- Der neutrale Ratenfilter reduziert falsche Signale

## Nachteile
- Kann in Seitwärtsmärkten zu falschen Signalen führen
- Als nachlaufender Indikator reagiert er möglicherweise zu spät auf Trendwechsel
- Die Optimierung der EMA-Periode ist entscheidend für die Performance
- Benötigt klare Trends für optimale Ergebnisse
