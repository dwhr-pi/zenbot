# SAR Strategie

## Beschreibung
Die Parabolic SAR (Stop and Reverse) Strategie ist ein trendfolgendes System, das von J. Welles Wilder entwickelt wurde. Diese Strategie verwendet den Parabolic SAR-Indikator, um Trendumkehrungen zu identifizieren und entsprechende Handelssignale zu generieren.

## Funktionsweise
Der Parabolic SAR-Indikator erscheint als eine Reihe von Punkten über oder unter dem Preischart. Wenn die Punkte unter dem Preis liegen, wird ein Aufwärtstrend signalisiert, während Punkte über dem Preis einen Abwärtstrend anzeigen. Die Strategie handelt, wenn der SAR-Trend umkehrt.

Die Punkte beschleunigen in Richtung des Preises und verlangsamen sich, wenn der Preis sich vom Trend entfernt. Diese Beschleunigung macht den Indikator besonders empfindlich für Trendumkehrungen und ermöglicht es, frühere Signale als EMA-basierte Strategien zu generieren.

## Beste Voreinstellungen
```
--period=2m
--min_periods=52
--sar_af=0.025
--sar_max_af=0.2
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Situationen, in denen frühe Signale für Hochs und Tiefs wichtig sind
- Schutz vor schnellen Preisrückgängen
- Am effektivsten mit kurzen Perioden (Standard ist 2m)

## Vorteile
- Generiert frühere Signale als EMA-basierte Strategien
- Bessere Erfassung von Hochs und Tiefs
- Bietet besseren Schutz gegen schnelle Preisrückgänge
- Klare und objektive Handelssignale

## Nachteile
- Funktioniert nicht gut in Seitwärtsmärkten (nicht-trendigen Märkten)
- Erzeugt mehr Whipsaws (falsche Signale) als EMA-basierte Strategien
- Generiert viele Trades pro Tag (50-100), was nur auf Börsen mit niedrigen oder keinen Gebühren praktikabel ist
- Kann zu frühen Ausstiegen aus profitablen Positionen führen
