# Ichimoku Score Strategie

## Beschreibung
Die Ichimoku Score Strategie basiert auf dem Ichimoku Kinko Hyo (auch bekannt als Ichimoku Cloud), einem umfassenden technischen Analysesystem, das in den 1930er Jahren von Goichi Hosoda in Japan entwickelt wurde. Diese Strategie bewertet verschiedene Ichimoku-Signale und kombiniert sie zu einem Gesamtscore, der Handelsentscheidungen leitet.

## Funktionsweise
Die Strategie berechnet einen Gesamtscore basierend auf sieben verschiedenen Ichimoku-Signalen:

1. TK Cross: Kreuzen der Tenkan-sen (Conversion Line) und Kijun-sen (Base Line)
2. PK Cross: Kreuzen des Preises und der Kijun-sen (Base Line)
3. Kumo Breakout: Durchbruch des Preises durch die Kumo (Cloud)
4. Senkou Cross: Kreuzen der Senkou Span A und Senkou Span B (die beiden Cloud-Linien)
5. Chikou Cross: Kreuzen der Chikou Span (Lagging Span) und des Preises
6. Chikou Placement: Position der Chikou Span relativ zur Cloud
7. Price Placement: Position des Preises relativ zur Cloud

Jedes Signal wird als stark, neutral oder schwach klassifiziert und entsprechend gewichtet. Der Gesamtscore wird normalisiert und als Prozentwert zwischen -100 und 100 dargestellt, wobei positive Werte bullische und negative Werte bärische Bedingungen anzeigen.

## Beste Voreinstellungen
```
--period=1h
--min_periods=50
--tenkenSenPeriods=9
--kijunSenPeriods=26
--senkouSpanPeriods=52
--displacement=26
--tkCrossWeight=1.0
--pkCrossWeight=1.0
--kumoBreakoutWeight=1.0
--senkouCrossWeight=1.0
--chikouCrossWeight=1.0
--chikouPlacementWeight=1.0
--pricePlacementWeight=1.0
--weakPoints=0.5
--neutralPoints=1.0
--strongPoints=2.0
--buyThreshold=80.0
--sellThreshold=50.0
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Mittel- bis langfristige Handelsstrategien
- Als umfassendes Analysesystem für verschiedene Marktphasen
- Für Händler, die eine ganzheitliche Sicht auf den Markt bevorzugen

## Vorteile
- Berücksichtigt mehrere Aspekte des Marktes für eine umfassende Analyse
- Gewichtungssystem ermöglicht Anpassung an verschiedene Handelsstile
- Visualisiert Marktstärke durch einen normalisierten Score
- Kombiniert Trend- und Momentumindikatoren

## Nachteile
- Komplexer als viele andere Strategien
- Erfordert Verständnis des Ichimoku-Systems
- Kann in nicht-trendigen Märkten widersprüchliche Signale liefern
- Die Vielzahl der Parameter erfordert sorgfältige Kalibrierung
