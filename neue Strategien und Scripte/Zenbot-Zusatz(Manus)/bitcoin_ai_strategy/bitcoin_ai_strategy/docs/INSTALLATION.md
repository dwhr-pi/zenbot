# Installation Guide

Diese Anleitung beschreibt, wie Sie die Bitcoin AI Strategie für Zenbot installieren und verwenden können.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes installiert haben:

- Zenbot (installiert und konfiguriert)
- Node.js (Version 10 oder höher)
- MongoDB (Version 4 oder höher)

## Installationsschritte

1. Entpacken Sie die ZIP-Datei in ein temporäres Verzeichnis
2. Kopieren Sie den Ordner `bitcoin_ai_strategy` in das Verzeichnis `extensions/strategies/` Ihrer Zenbot-Installation:

```bash
cp -r bitcoin_ai_strategy /pfad/zu/zenbot/extensions/strategies/
```

3. Starten Sie Zenbot neu, falls es bereits läuft:

```bash
cd /pfad/zu/zenbot
./zenbot.sh
```

4. Überprüfen Sie, ob die Strategie korrekt installiert wurde:

```bash
./zenbot.sh list-strategies
```

Sie sollten `bitcoin_ai_strategy` in der Liste der verfügbaren Strategien sehen.

## Erste Schritte

### Backtesting

Um die Strategie mit historischen Daten zu testen:

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30
```

### Paper Trading

Um die Strategie im Paper-Trading-Modus zu testen:

```bash
./zenbot.sh trade --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --paper
```

### Live Trading

Für den Live-Handel (mit echtem Geld):

```bash
./zenbot.sh trade --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT"
```

**WICHTIG**: Stellen Sie sicher, dass Sie die Strategie gründlich getestet haben, bevor Sie mit echtem Geld handeln.

## Anpassung der Parameter

Sie können die Strategie-Parameter anpassen, indem Sie sie als Befehlszeilenargumente übergeben:

```bash
./zenbot.sh trade --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --conf.rsi_periods=21 --conf.stop_loss_pct=1.5
```

Weitere Informationen zu den verfügbaren Parametern finden Sie in der README.md-Datei.
