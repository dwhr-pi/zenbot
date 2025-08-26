# Bollinger Strategie

## Beschreibung
Die Bollinger-Bänder-Strategie ist eine technische Handelsstrategie, die auf dem Konzept der Preisvolatilität basiert. Sie kauft, wenn der Preis das untere Bollinger-Band erreicht oder unterschreitet, und verkauft, wenn der Preis das obere Bollinger-Band erreicht oder überschreitet.

## Funktionsweise
Die Strategie verwendet Bollinger-Bänder, die aus einem gleitenden Durchschnitt (in der Regel ein einfacher gleitender Durchschnitt) und zwei Standardabweichungen bestehen, die ober- und unterhalb des gleitenden Durchschnitts liegen. Diese Bänder erweitern und verengen sich basierend auf der Marktvolatilität.

Der Grundgedanke ist, dass Preise tendenziell zu ihrem Durchschnitt zurückkehren. Wenn der Preis das untere Band berührt, wird dies als überverkauft angesehen und signalisiert eine Kaufgelegenheit. Wenn der Preis das obere Band berührt, wird dies als überkauft angesehen und signalisiert eine Verkaufsgelegenheit.

## Beste Voreinstellungen
```
--period=1h
--min_periods=52
--bollinger_size=20
--bollinger_time=2
--bollinger_upper_bound_pct=0
--bollinger_lower_bound_pct=0
```

## Empfohlene Anwendungsfälle
Die Bollinger-Bänder-Strategie eignet sich besonders gut für:
- Märkte mit einer gewissen Volatilität, aber ohne starken Trend
- Seitwärtsmärkte, in denen der Preis in einer Spanne schwankt
- Situationen, in denen Sie Umkehrpunkte identifizieren möchten

## Vorteile
- Passt sich automatisch an die Marktvolatilität an
- Bietet klare visuelle Kauf- und Verkaufssignale
- Kann in verschiedenen Marktbedingungen effektiv sein
- Hilft, überkaufte und überverkaufte Zustände zu identifizieren

## Nachteile
- Kann in stark trendigen Märkten zu falschen Signalen führen
- Die Bänder reagieren verzögert auf plötzliche Preisänderungen
- Erfordert zusätzliche Bestätigung durch andere Indikatoren für optimale Ergebnisse
- Die Parameter müssen möglicherweise je nach Markt und Zeitrahmen angepasst werden
