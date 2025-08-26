# Trust Distrust Strategie

## Beschreibung
Die Trust Distrust Strategie ist eine technische Handelsstrategie, die auf dem Konzept von Preishöchst- und -tiefstpunkten basiert. Sie verkauft, wenn der Preis einen bestimmten Prozentsatz über dem Einstiegspreis liegt und dann um einen definierten Schwellenwert fällt. Sie kauft, wenn der niedrigste Preispunkt um einen bestimmten Schwellenwert überschritten wird.

## Funktionsweise
Die Strategie verfolgt kontinuierlich den Preisverlauf und identifiziert Höchst- und Tiefstpunkte. Sie verwendet mehrere Parameter, um Kauf- und Verkaufsentscheidungen zu treffen:

Beim Verkauf wartet die Strategie, bis der Preis mindestens um den `sell_min`-Prozentsatz über dem ursprünglichen Preis liegt. Sobald diese Bedingung erfüllt ist, verkauft sie, wenn der Preis vom Höchstpunkt um mindestens den `sell_threshold`-Prozentsatz fällt. Ein optionaler `sell_threshold_max`-Parameter ermöglicht Panikverkäufe bei größeren Preisrückgängen.

Beim Kauf wartet die Strategie, bis der Preis vom Tiefstpunkt um mindestens den `buy_threshold`-Prozentsatz steigt. Ein optionaler `buy_threshold_max`-Parameter kann verwendet werden, um mehrere Kaufsignale abzuwarten und Whipsaw-Effekte zu reduzieren.

## Beste Voreinstellungen
```
--period=30m
--min_periods=52
--sell_threshold=2
--sell_threshold_max=0
--sell_min=1
--buy_threshold=2
--buy_threshold_max=0
--greed=0
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Höchst- und Tiefstpunkten
- Situationen, in denen Gewinnmitnahme wichtig ist
- Als Teil einer umfassenderen Risikomanagementstrategie
- Für Händler, die Preisumkehrungen nutzen möchten

## Vorteile
- Klare Regeln für Gewinnmitnahme und Verlustbegrenzung
- Anpassungsfähig an verschiedene Marktbedingungen durch Parameter
- Kann sowohl in volatilen als auch in trendigen Märkten effektiv sein
- Bietet Schutz vor größeren Preisrückgängen

## Nachteile
- Kann zu frühen Ausstiegen aus starken Trends führen
- Die Optimierung der zahlreichen Parameter kann komplex sein
- In stark trendigen Märkten kann die Strategie zu häufigen Ein- und Ausstiegen führen
- Erfordert sorgfältige Kalibrierung der Schwellenwerte für verschiedene Märkte
