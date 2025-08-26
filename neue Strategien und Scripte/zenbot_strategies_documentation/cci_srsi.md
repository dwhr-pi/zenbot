# CCI SRSI Strategie

## Beschreibung
Die CCI SRSI Strategie ist eine technische Handelsstrategie, die den Commodity Channel Index (CCI) und den Stochastischen Relative Strength Index (SRSI) kombiniert, um Handelssignale zu generieren. Diese Kombination ermöglicht es, sowohl Trendstärke als auch überkaufte/überverkaufte Bedingungen zu identifizieren.

## Funktionsweise
Die Strategie nutzt zwei leistungsstarke Indikatoren, die sich gegenseitig ergänzen:

Der CCI misst die Abweichung des aktuellen Preises vom durchschnittlichen Preis über einen bestimmten Zeitraum. Er hilft dabei, Trendstärke und -richtung zu bestimmen. Werte über +100 deuten auf einen starken Aufwärtstrend hin, während Werte unter -100 auf einen starken Abwärtstrend hindeuten.

Der Stochastische RSI kombiniert die Stärken des Stochastischen Oszillators und des RSI. Er zeigt an, wo sich der aktuelle RSI-Wert im Verhältnis zu seinem Höchst- und Tiefstwert über einen bestimmten Zeitraum befindet. Dies hilft, überkaufte und überverkaufte Bedingungen zu identifizieren.

## Beste Voreinstellungen
```
--period=20m
--min_periods=30
--ema_acc=0.03
--cci_periods=14
--rsi_periods=14
--srsi_periods=9
--srsi_k=5
--srsi_d=3
--oversold_rsi=18
--overbought_rsi=85
--oversold_cci=-90
--overbought_cci=140
--constant=0.015
```

## Empfohlene Anwendungsfälle
- Märkte mit mittlerer bis hoher Volatilität
- Situationen, in denen sowohl Trendstärke als auch überkaufte/überverkaufte Bedingungen wichtig sind
- Handel in verschiedenen Marktphasen (Trend- und Seitwärtsphasen)
- Mittel- bis langfristige Handelsstrategien

## Vorteile
- Kombiniert die Stärken von zwei leistungsstarken technischen Indikatoren
- Reduziert falsche Signale durch Bestätigung über mehrere Indikatoren
- Anpassungsfähig an verschiedene Marktbedingungen
- Bietet sowohl Trend- als auch Umkehrsignale

## Nachteile
- Komplexer als Einzelindikator-Strategien
- Erfordert sorgfältige Kalibrierung der Parameter
- Kann in bestimmten Marktphasen widersprüchliche Signale liefern
- Die Vielzahl der Parameter kann die Optimierung erschweren
