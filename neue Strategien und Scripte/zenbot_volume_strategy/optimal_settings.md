# Optimale Voreinstellungen für die Zenbot Volumenhandelsstrategie

Diese Konfigurationsdatei enthält die optimalen Voreinstellungen für die universelle Volumenhandelsstrategie. Die Parameter wurden sorgfältig ausgewählt, um in verschiedenen Marktbedingungen und für alle Kryptowährungen gute Ergebnisse zu erzielen.

## Allgemeine Einstellungen

```
--strategy volume_universal
--period 30m
--min_periods 52
```

## Volumen-Parameter

```
--volume_threshold 1.5
--volume_persistence 3
--price_volume_threshold 0.3
```

## Technische Indikatoren

```
--rsi_periods 14
--oversold_rsi 30
--overbought_rsi 70
--ema_short 5
--ema_long 20
--vwap_length 20
```

## Gewinnmitnahme

```
--profit_stop_enable true
--profit_stop_percent 1.0
```

## Begründung der Parameterauswahl

### Zeitrahmen und Perioden

- **period = 30m**: Ein 30-Minuten-Zeitrahmen bietet eine gute Balance zwischen Reaktionsfähigkeit und Rauschfilterung. Er ist lang genug, um kurzfristige Preisschwankungen zu glätten, aber kurz genug, um auf signifikante Marktbewegungen zeitnah zu reagieren.

- **min_periods = 52**: Diese Einstellung stellt sicher, dass genügend historische Daten für zuverlässige Berechnungen vorhanden sind. 52 Perioden entsprechen etwa 26 Stunden bei einem 30-Minuten-Zeitrahmen, was ausreichend ist, um Marktzyklen zu erfassen.

### Volumen-Parameter

- **volume_threshold = 1.5**: Ein Volumen, das 1,5-mal höher als der Durchschnitt ist, deutet auf signifikantes Marktinteresse hin, ohne zu restriktiv zu sein. Dieser Wert filtert normale Volumenfluktuationen heraus, erkennt aber dennoch bedeutende Volumenanstiege.

- **volume_persistence = 3**: Die Anforderung, dass erhöhtes Volumen über 3 Perioden (1,5 Stunden) bestehen muss, hilft, kurzfristige Volumenspitzen von nachhaltigen Volumentrends zu unterscheiden. Dies reduziert Fehlsignale durch vorübergehende Marktaktivitäten.

- **price_volume_threshold = 0.3**: Dieser Wert bestimmt, wie stark die Divergenz zwischen Preis und Volumen sein muss, um als signifikant zu gelten. Der Wert 0.3 bietet eine gute Balance zwischen Sensitivität und Spezifität bei der Erkennung von Divergenzen.

### Technische Indikatoren

- **rsi_periods = 14**: Dies ist der Standardwert für RSI-Berechnungen und hat sich in verschiedenen Marktbedingungen bewährt. Er bietet eine ausgewogene Empfindlichkeit für Überkauf- und Überverkaufbedingungen.

- **oversold_rsi = 30** und **overbought_rsi = 70**: Diese klassischen RSI-Schwellenwerte haben sich über Jahrzehnte als effektiv erwiesen. Sie identifizieren zuverlässig extreme Marktbedingungen, ohne zu viele Fehlsignale zu generieren.

- **ema_short = 5** und **ema_long = 20**: Diese Kombination von EMA-Perioden ist reaktionsschnell genug, um Trendänderungen zu erkennen, filtert aber gleichzeitig kurzfristiges Rauschen. Die 5/20-Kombination ist ein bewährter Standard in der technischen Analyse.

- **vwap_length = 20**: Ein 20-Perioden-VWAP (10 Stunden bei 30-Minuten-Zeitrahmen) bietet eine solide Referenzlinie für den Preis. Dieser Zeitrahmen ist lang genug, um zufällige Schwankungen zu glätten, aber kurz genug, um relevant für aktuelle Handelsentscheidungen zu bleiben.

### Gewinnmitnahme

- **profit_stop_enable = true**: Die Aktivierung des Gewinnstopps ist entscheidend für das Risikomanagement. Es hilft, Gewinne zu sichern, wenn der Markt günstig ist, anstatt zu warten, bis sich der Trend umkehrt.

- **profit_stop_percent = 1.0**: Ein 1%-Gewinnziel ist konservativ genug, um regelmäßige Gewinne zu sichern, aber nicht so aggressiv, dass es vorzeitig aus profitablen Trends aussteigt. Dieser Wert kann je nach Risikobereitschaft und Marktvolatilität angepasst werden.

## Anpassungen für verschiedene Marktbedingungen

### Für volatile Märkte (kleinere Altcoins)

```
--oversold_rsi 25
--overbought_rsi 75
--volume_threshold 2.0
--profit_stop_percent 1.5
```

Diese Einstellungen erhöhen die Schwellen für Handelssignale, um in volatileren Märkten weniger, aber qualitativ hochwertigere Signale zu generieren. Der höhere Profit-Stop-Prozentsatz nutzt die größeren Preisbewegungen in diesen Märkten.

### Für stabile Märkte (Bitcoin, große Altcoins)

```
--oversold_rsi 35
--overbought_rsi 65
--volume_threshold 1.3
--profit_stop_percent 0.7
```

Diese Einstellungen sind empfindlicher für Marktsignale, da stabile Märkte oft subtilere Hinweise auf Trendänderungen geben. Der niedrigere Profit-Stop-Prozentsatz berücksichtigt die typischerweise geringeren Preisbewegungen in diesen Märkten.

### Für Bärenmärkte

```
--ema_short 3
--ema_long 15
--volume_persistence 4
--profit_stop_percent 0.8
```

In Bärenmärkten sind schnellere Reaktionen auf Marktveränderungen wichtig, daher die kürzeren EMA-Perioden. Die erhöhte Volumen-Persistenz hilft, falsche Ausbrüche zu vermeiden, die in Bärenmärkten häufiger auftreten.

### Für Bullenmärkte

```
--ema_short 8
--ema_long 25
--volume_threshold 1.2
--profit_stop_percent 1.2
```

In Bullenmärkten können längere EMA-Perioden helfen, im Trend zu bleiben. Die niedrigere Volumenschwelle ermöglicht es, früher in aufstrebende Trends einzusteigen, während der höhere Profit-Stop-Prozentsatz darauf abzielt, von längeren Aufwärtsbewegungen zu profitieren.
