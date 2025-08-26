# TA_MACD Strategie

## Beschreibung
Die TA_MACD Strategie ist eine technische Handelsstrategie, die auf dem Moving Average Convergence Divergence (MACD) Indikator basiert. Sie kauft, wenn der MACD über die Signallinie steigt (MACD - Signal > 0), und verkauft, wenn der MACD unter die Signallinie fällt (MACD - Signal < 0).

## Funktionsweise
Der MACD ist ein trendfolgendes Momentum-Indikator-System, das die Beziehung zwischen zwei gleitenden Durchschnitten des Preises nutzt. Die Strategie berechnet den MACD als Differenz zwischen einem kurzen und einem langen exponentiellen gleitenden Durchschnitt (EMA) und erzeugt eine Signallinie durch Berechnung eines EMA des MACD.

Wenn der MACD über die Signallinie steigt, wird dies als bullisches Signal interpretiert und ein Kauf ausgelöst. Wenn der MACD unter die Signallinie fällt, wird dies als bärisches Signal interpretiert und ein Verkauf ausgelöst. Die Strategie kann auch RSI-Überkauft-Bedingungen verwenden, um zusätzliche Verkaufssignale zu generieren.

## Beste Voreinstellungen
```
--period=1h
--min_periods=52
--ema_short_period=12
--ema_long_period=26
--signal_period=9
--up_trend_threshold=0
--down_trend_threshold=0
--overbought_rsi_periods=25
--overbought_rsi=70
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Mittel- bis langfristige Handelsstrategien
- Als Teil einer umfassenderen Handelsstrategie mit zusätzlichen Filtern
- Für Händler, die trendfolgende Strategien bevorzugen

## Vorteile
- Gut etablierter und bewährter technischer Indikator
- Effektiv bei der Identifizierung von Trendrichtungen und -stärke
- Kann mit RSI kombiniert werden, um überkaufte Bedingungen zu erkennen
- Erzeugt klare Kauf- und Verkaufssignale

## Nachteile
- Als nachlaufender Indikator reagiert er möglicherweise zu spät auf Trendwechsel
- Kann in Seitwärtsmärkten zu falschen Signalen führen
- Die Optimierung der EMA-Perioden ist entscheidend für die Performance
- Benötigt klare Trends für optimale Ergebnisse
