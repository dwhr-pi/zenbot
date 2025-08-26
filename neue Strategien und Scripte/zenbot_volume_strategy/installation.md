# Installation der Zenbot Volumenhandelsstrategie

Diese Anleitung führt Sie durch die Installation und Konfiguration der universellen Volumenhandelsstrategie für Zenbot.

## Voraussetzungen

- Zenbot muss bereits installiert und funktionsfähig sein
- Node.js und MongoDB müssen korrekt konfiguriert sein

## Installationsschritte

1. Erstellen Sie einen neuen Ordner für die Strategie im Zenbot-Verzeichnis:

```bash
mkdir -p /pfad/zu/zenbot/extensions/strategies/volume_universal
```

2. Kopieren Sie die Datei `volume_strategy.js` in diesen Ordner und benennen Sie sie in `index.js` um:

```bash
cp volume_strategy.js /pfad/zu/zenbot/extensions/strategies/volume_universal/index.js
```

3. Stellen Sie sicher, dass die Strategie korrekt installiert ist, indem Sie die verfügbaren Strategien auflisten:

```bash
cd /pfad/zu/zenbot
./zenbot.sh list-strategies
```

Sie sollten `volume_universal` in der Liste der verfügbaren Strategien sehen.

## Verwendung der Strategie

Um die Strategie mit den empfohlenen Einstellungen zu verwenden, führen Sie folgenden Befehl aus:

```bash
./zenbot.sh trade --strategy volume_universal --period 30m --min_periods 52 --rsi_periods 14 --oversold_rsi 30 --overbought_rsi 70 --ema_short 5 --ema_long 20 --signal_length 9 --volume_threshold 1.5 --volume_persistence 3 --price_volume_threshold 0.3 --vwap_length 20 --profit_stop_enable true --profit_stop_percent 1.0
```

## Backtesting

Um die Strategie mit historischen Daten zu testen, verwenden Sie den Backtesting-Befehl:

```bash
./zenbot.sh backtest --strategy volume_universal --period 30m --min_periods 52 --days 30 [weitere Parameter wie oben]
```

## Anpassung der Parameter

Sie können die Parameter der Strategie anpassen, um sie an verschiedene Marktbedingungen anzupassen. Sehen Sie sich die Datei `optimal_settings.md` für empfohlene Konfigurationen für verschiedene Marktszenarien an.

## Fehlerbehebung

Falls die Strategie nicht korrekt funktioniert, überprüfen Sie Folgendes:

1. Stellen Sie sicher, dass die Datei `index.js` im richtigen Verzeichnis liegt
2. Überprüfen Sie, ob alle erforderlichen Module in Zenbot installiert sind
3. Prüfen Sie die Zenbot-Logs auf Fehlermeldungen

Bei weiteren Problemen konsultieren Sie die Zenbot-Dokumentation oder die Community-Foren.
