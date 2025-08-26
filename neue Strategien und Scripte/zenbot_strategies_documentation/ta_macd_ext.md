# TA_MACD_EXT Strategie

## Beschreibung
Die TA_MACD_EXT Strategie ist eine erweiterte Version der klassischen MACD-Strategie, die zusätzliche Kontrolle über die verwendeten Moving-Average-Typen bietet. Sie kauft, wenn der MACD über die Signallinie steigt (MACD - Signal > 0), und verkauft, wenn der MACD unter die Signallinie fällt (MACD - Signal < 0).

## Funktionsweise
Wie die Standard-MACD-Strategie nutzt auch TA_MACD_EXT die Beziehung zwischen zwei gleitenden Durchschnitten des Preises. Der entscheidende Unterschied besteht darin, dass diese erweiterte Version die Flexibilität bietet, verschiedene Typen von gleitenden Durchschnitten für die Berechnung des MACD zu verwenden.

Die Strategie ermöglicht die Auswahl aus verschiedenen MA-Typen der technischen Analysebibliothek (talib): SMA (Simple Moving Average), EMA (Exponential Moving Average), WMA (Weighted Moving Average), DEMA (Double Exponential Moving Average), TEMA (Triple Exponential Moving Average), TRIMA (Triangular Moving Average), KAMA (Kaufman Adaptive Moving Average), MAMA (MESA Adaptive Moving Average) und T3 (Triple Exponential Moving Average).

## Beste Voreinstellungen
```
--period=1h
--min_periods=52
--ema_short_period=12
--ema_long_period=26
--signal_period=9
--fast_ma_type=EMA
--slow_ma_type=EMA
--signal_ma_type=EMA
--default_ma_type=SMA
--up_trend_threshold=0
--down_trend_threshold=0
--overbought_rsi_periods=25
--overbought_rsi=70
```

## Empfohlene Anwendungsfälle
- Märkte mit klaren Trends
- Situationen, in denen spezifische MA-Typen besser funktionieren als Standard-EMAs
- Für fortgeschrittene Händler, die ihre MACD-Strategie optimieren möchten
- Als Teil einer umfassenderen Handelsstrategie mit zusätzlichen Filtern

## Vorteile
- Höhere Flexibilität durch Auswahl verschiedener MA-Typen
- Ermöglicht Feinabstimmung der MACD-Berechnung für verschiedene Marktbedingungen
- Kann mit RSI kombiniert werden, um überkaufte Bedingungen zu erkennen
- Bietet erweiterte Anpassungsmöglichkeiten für erfahrene Händler

## Nachteile
- Komplexer als die Standard-MACD-Strategie
- Erfordert Verständnis der verschiedenen MA-Typen und ihrer Eigenschaften
- Die Optimierung der zahlreichen Parameter kann zeitaufwändig sein
- Benötigt klare Trends für optimale Ergebnisse
