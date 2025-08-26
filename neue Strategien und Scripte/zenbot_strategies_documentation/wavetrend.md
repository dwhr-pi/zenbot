# Wavetrend Strategie

## Beschreibung
Die Wavetrend Strategie ist eine technische Handelsstrategie, die auf dem Wavetrend-Oszillator basiert, einem Momentum-Indikator, der überkaufte und überverkaufte Marktbedingungen identifiziert. Die Strategie kauft, wenn das Signal unter den überverkauften Bereich fällt, und verkauft, wenn das Signal über den überkauften Bereich steigt.

## Funktionsweise
Der Wavetrend-Oszillator berechnet einen Wert, der die aktuelle Marktdynamik widerspiegelt. Die Strategie verwendet zwei Hauptkomponenten: den Wavetrend-Kanal und den Wavetrend-Durchschnitt. Der Oszillator schwankt typischerweise zwischen -60 und +60, wobei Werte über +53/+60 auf überkaufte Bedingungen und Werte unter -53/-60 auf überverkaufte Bedingungen hindeuten.

Die Strategie generiert Kaufsignale, wenn der Oszillator unter den überverkauften Schwellenwert fällt und dann wieder steigt. Verkaufssignale werden generiert, wenn der Oszillator über den überkauften Schwellenwert steigt und dann wieder fällt. Optional kann die Strategie auch auf Trendänderungen statt auf absolute Schwellenwerte reagieren.

## Beste Voreinstellungen
```
--period=1h
--min_periods=21
--wavetrend_channel_length=10
--wavetrend_average_length=21
--wavetrend_overbought_1=60
--wavetrend_overbought_2=53
--wavetrend_oversold_1=-60
--wavetrend_oversold_2=-53
--wavetrend_trends=false
--overbought_rsi_periods=9
--overbought_rsi=80
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren überkauften und überverkauften Zuständen
- Als Gegentrendstrategie in volatilen Märkten
- Für Händler, die Umkehrpunkte identifizieren möchten
- Als Teil einer umfassenderen Handelsstrategie mit zusätzlichen Filtern

## Vorteile
- Effektiv bei der Identifizierung von überkauften und überverkauften Bedingungen
- Kann frühzeitige Signale für Trendumkehrungen liefern
- Anpassungsfähig durch verschiedene Parameter
- Kann mit RSI kombiniert werden für zusätzliche Bestätigung

## Nachteile
- Kann in stark trendigen Märkten zu falschen Signalen führen
- Die Optimierung der zahlreichen Parameter kann komplex sein
- In Seitwärtsmärkten kann die Strategie zu häufigen Ein- und Ausstiegen führen
- Benötigt sorgfältige Kalibrierung der Schwellenwerte für verschiedene Märkte
