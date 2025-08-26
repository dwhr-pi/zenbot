# DEMA Strategie

## Beschreibung
Die DEMA (Double Exponential Moving Average) Strategie ist eine technische Handelsstrategie, die auf dem Vergleich von zwei exponentiellen gleitenden Durchschnitten (EMAs) mit unterschiedlichen Perioden basiert. Diese Strategie kauft, wenn der kurze EMA über den langen EMA steigt, und verkauft, wenn der kurze EMA unter den langen EMA fällt.

## Funktionsweise
Der DEMA ist ein verbesserter gleitender Durchschnitt, der entwickelt wurde, um die Verzögerung zu reduzieren, die bei herkömmlichen gleitenden Durchschnitten auftritt. Die Strategie verwendet zwei EMAs mit unterschiedlichen Zeiträumen:

Ein kurzer EMA, der schneller auf Preisänderungen reagiert und aktuelle Marktbewegungen widerspiegelt.
Ein langer EMA, der langsamer reagiert und den längerfristigen Trend anzeigt.

Wenn der kurze EMA den langen EMA von unten nach oben kreuzt, wird dies als Kaufsignal interpretiert, da es auf einen beginnenden Aufwärtstrend hindeutet. Wenn der kurze EMA den langen EMA von oben nach unten kreuzt, wird dies als Verkaufssignal interpretiert, da es auf einen beginnenden Abwärtstrend hindeutet.

## Beste Voreinstellungen
```
--period=1h
--min_periods=21
--ema_short_period=10
--ema_long_period=21
--up_trend_threshold=0
--down_trend_threshold=0
--overbought_rsi_periods=9
--overbought_rsi=80
--noise_level_pct=0
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Mittel- bis langfristige Handelsstrategien
- Märkte mit moderater Volatilität
- Als Teil einer umfassenderen Handelsstrategie mit zusätzlichen Filtern

## Vorteile
- Reagiert schneller auf Trendwechsel als einfache gleitende Durchschnitte
- Reduziert Verzögerungen bei der Signalerstellung
- Einfach zu verstehen und zu implementieren
- Kann mit RSI-Filtern kombiniert werden, um überkaufte Bedingungen zu erkennen

## Nachteile
- Kann in Seitwärtsmärkten zu vielen falschen Signalen führen
- Die Optimierung der EMA-Perioden ist entscheidend für die Performance
- Reagiert möglicherweise zu spät auf schnelle Marktbewegungen
- Der Noise-Level-Parameter muss sorgfältig kalibriert werden, um Whipsaws zu reduzieren
