# Trend EMA Strategie

## Beschreibung
Die Trend EMA Strategie ist die Standardstrategie von Zenbot und basiert auf dem exponentiellen gleitenden Durchschnitt (EMA). Sie kauft zu Beginn eines Aufwärtstrends und verkauft zu Beginn eines Abwärtstrends. Die Strategie berechnet den 26-Perioden-EMA des aktuellen Preises und ermittelt die prozentuale Veränderung vom EMA der letzten Periode, um die `trend_ema_rate` zu bestimmen.

## Funktionsweise
- Betrachtet `trend_ema_rate >= 0` als Aufwärtstrend und `trend_ema_rate < 0` als Abwärtstrend
- Filtert niedrige Werte (Whipsaws) durch `neutral_rate` heraus
- Wenn `neutral_rate` auf `auto` gesetzt ist, wird die Standardabweichung der `trend_ema_rate` als variabler Rauschfilter verwendet
- Kauft zu Beginn eines Aufwärtstrends, verkauft zu Beginn eines Abwärtstrends
- Wenn `oversold_rsi` gesetzt ist, versucht die Strategie zu kaufen, wenn der RSI unter diesen Wert fällt und sich dann zu erholen beginnt

## Beste Voreinstellungen
```
--period=2m
--min_periods=52
--trend_ema=26
--neutral_rate=auto
--oversold_rsi_periods=14
--oversold_rsi=10
```

## Optimale Einstellungen für höhere Rendite
```
--profit_stop_enable_pct=10
--profit_stop_pct=4
--trend_ema=36
--sell_rate=-0.006
```

## Empfohlene Anwendungsfälle
- Gut geeignet für Märkte mit klaren Trends
- Funktioniert am besten in Märkten mit mittlerer Volatilität
- Weniger effektiv in Seitwärtsmärkten oder bei starken Preisschwankungen

## Vorteile
- Einfach zu verstehen und zu implementieren
- Gute Balance zwischen Reaktionsfähigkeit und Stabilität
- Vermeidet übermäßiges Handeln durch Rauschfilterung

## Nachteile
- Kann in stark volatilen Märkten zu spät reagieren
- In Seitwärtsmärkten können häufige Fehlsignale auftreten
- Benötigt klare Trends für optimale Performance
