# MACD Strategie

## Beschreibung
Die MACD (Moving Average Convergence Divergence) Strategie ist ein trendfolgendes Momentum-Indikator-System, das die Beziehung zwischen zwei gleitenden Durchschnitten des Preises nutzt. Die Strategie kauft, wenn (MACD - Signal > 0) und verkauft, wenn (MACD - Signal < 0).

## Funktionsweise
- Berechnet den MACD als Differenz zwischen einem kurzen und einem langen exponentiellen gleitenden Durchschnitt (EMA)
- Erzeugt eine Signallinie durch Berechnung eines EMA des MACD
- Kauft, wenn der MACD über die Signallinie steigt
- Verkauft, wenn der MACD unter die Signallinie fällt
- Verwendet optional RSI-Überkauft-Bedingungen für zusätzliche Verkaufssignale

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
- Besonders effektiv für Handelsperioden von 1h oder länger
- Gut geeignet für trendfolgende Strategien in klaren Marktphasen
- Weniger geeignet für kurze Zeiträume (unter 15m), da die Signale zu unbeständig werden können

## Vorteile
- Erzeugt nur ein Kauf- oder Verkaufssignal pro Trend, was zu einer besseren Handelsqualität führt
- Vermeidet Käufe, wenn es nicht der Beginn eines Trends ist
- Gut etablierter und bewährter technischer Indikator

## Nachteile
- Als nachlaufender Indikator kann er zu spät auf Trendwechsel reagieren
- Kann in Seitwärtsmärkten zu falschen Signalen führen
- Weniger effektiv bei sehr kurzen Zeiträumen
