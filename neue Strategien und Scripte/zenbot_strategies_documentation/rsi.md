# RSI Strategie

## Beschreibung
Die RSI (Relative Strength Index) Strategie versucht, niedrig zu kaufen und hoch zu verkaufen, indem sie RSI-Höchstwerte verfolgt. Diese Strategie ist besonders effektiv in Seitwärtsmärkten oder Märkten, die nach Preisrückgängen zur Erholung neigen.

## Funktionsweise
- Kauft, wenn der RSI einen überkauften Zustand erreicht und sich dann zu erholen beginnt
- Verkauft, wenn der RSI einen überkauften Zustand erreicht
- Verwendet RSI-Erholungs- und RSI-Abfall-Parameter, um Fehlsignale zu reduzieren
- Nutzt einen RSI-Divisor, um Verkaufssignale basierend auf Höchstwerten zu generieren

## Beste Voreinstellungen
```
--period=2m
--min_periods=52
--rsi_periods=14
--oversold_rsi=30
--overbought_rsi=82
--rsi_recover=3
--rsi_drop=0
--rsi_divisor=2
```

## Empfohlene Anwendungsfälle
- Besonders effektiv in Seitwärtsmärkten
- Gut geeignet für Märkte, die nach Preisrückgängen zur Erholung neigen
- Kann als Alternative zu trendbasierten Strategien verwendet werden, wenn diese nicht erfolgreich sind

## Vorteile
- Funktioniert gut in Märkten, in denen andere trendbasierte Strategien versagen
- Kauft bei niedrigen Preisen und verkauft bei hohen Preisen
- Kann in volatilen Märkten mit regelmäßigen Preisschwankungen profitabel sein

## Nachteile
- Riskant in Bärenmärkten, da der Algorithmus auf Preiserholung angewiesen ist
- Kann zu frühen Verkäufen führen, wenn der Markt weiter steigt
- Benötigt sorgfältige Kalibrierung der RSI-Parameter für optimale Ergebnisse
