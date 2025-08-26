# TA_PPO Strategie

## Beschreibung
Die TA_PPO (Percentage Price Oscillator) Strategie ist eine technische Handelsstrategie, die auf dem Percentage Price Oscillator basiert, einer Variante des MACD-Indikators. Der Hauptunterschied zum MACD besteht darin, dass der PPO die prozentuale Differenz zwischen zwei gleitenden Durchschnitten anzeigt, was einen besseren Vergleich über verschiedene Preisbereiche hinweg ermöglicht.

## Funktionsweise
Der PPO berechnet die prozentuale Differenz zwischen einem kurzen und einem langen gleitenden Durchschnitt, anstatt die absolute Differenz wie beim MACD zu verwenden. Diese prozentuale Darstellung macht den Indikator besser vergleichbar über verschiedene Zeiträume und Preisbereiche hinweg.

Die Strategie generiert Kaufsignale, wenn der PPO über seine Signallinie steigt, und Verkaufssignale, wenn der PPO unter seine Signallinie fällt. Zusätzlich kann die Strategie den RSI (Relative Strength Index) verwenden, um überkaufte Bedingungen zu identifizieren und zusätzliche Verkaufssignale zu generieren.

## Beste Voreinstellungen
```
--period=10m
--ema_short_period=12
--ema_long_period=26
--signal_period=9
--overbought_rsi_periods=25
--ma_type=SMA
--overbought_rsi=70
```

## Empfohlene Anwendungsfälle
- Märkte mit unterschiedlichen Preisbereichen
- Vergleich von Momentum über verschiedene Vermögenswerte hinweg
- Mittel- bis langfristige Handelsstrategien
- Als Alternative zum MACD für eine prozentuale Perspektive

## Vorteile
- Prozentuale Darstellung ermöglicht besseren Vergleich über verschiedene Preisbereiche
- Effektiv bei der Identifizierung von Trendrichtungen und -stärke
- Kann mit RSI kombiniert werden, um überkaufte Bedingungen zu erkennen
- Flexibilität durch Auswahl verschiedener MA-Typen

## Nachteile
- Als nachlaufender Indikator reagiert er möglicherweise zu spät auf Trendwechsel
- Kann in Seitwärtsmärkten zu falschen Signalen führen
- Die Optimierung der Parameter ist entscheidend für die Performance
- Benötigt klare Trends für optimale Ergebnisse
