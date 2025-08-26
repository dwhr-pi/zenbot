# Backtesting-Anleitung

Diese Anleitung beschreibt, wie Sie die Bitcoin AI Strategie mit historischen Daten testen können, um ihre Leistung zu bewerten.

## Grundlegendes Backtesting

Um einen einfachen Backtest durchzuführen:

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30
```

Dies testet die Strategie mit den Standardparametern über die letzten 30 Tage.

## Erweiterte Backtesting-Optionen

### Zeitraum anpassen

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=60
```

Sie können auch einen bestimmten Zeitraum angeben:

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --start="2023-01-01" --end="2023-03-31"
```

### Parameter anpassen

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30 --conf.rsi_periods=21 --conf.oversold_rsi=25 --conf.overbought_rsi=75
```

### Handelsgebühren berücksichtigen

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30 --conf.fee_pct=0.1
```

### Backtesting mit verschiedenen Zeitintervallen

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30 --conf.period=15m
```

## Interpretation der Ergebnisse

Nach Abschluss des Backtests zeigt Zenbot eine Zusammenfassung der Ergebnisse an. Hier sind die wichtigsten Metriken:

### Wichtige Metriken

- **Total Profit**: Gesamtgewinn/-verlust in der Basiswährung und als Prozentsatz
- **Number of Trades**: Gesamtzahl der ausgeführten Trades
- **Win/Loss Ratio**: Verhältnis von gewinnbringenden zu verlustbringenden Trades
- **Average Trade**: Durchschnittlicher Gewinn/Verlust pro Trade
- **Maximum Drawdown**: Größter Rückgang vom Höchststand
- **Buy & Hold Profit**: Vergleich mit einer einfachen Kaufen-und-Halten-Strategie
- **Sharpe Ratio**: Risikobereinigte Rendite (höher ist besser)
- **Profit Factor**: Verhältnis von Bruttogewinn zu Bruttoverlust (>1 ist profitabel)

### Bewertung der Strategie

Eine gute Strategie sollte folgende Eigenschaften aufweisen:

- **Positive Gesamtrendite**: Höher als Buy & Hold für aktive Strategien
- **Win/Loss Ratio**: Idealerweise über 50%
- **Sharpe Ratio**: Über 1 ist gut, über 2 ist ausgezeichnet
- **Profit Factor**: Über 1.3 ist gut, über 1.5 ist ausgezeichnet
- **Maximum Drawdown**: Unter 20% ist akzeptabel

## Optimierung durch Backtesting

Sie können verschiedene Parameter systematisch testen, um die optimale Konfiguration zu finden:

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=60 --conf.rsi_periods=14 --conf.oversold_rsi=30 --conf.overbought_rsi=70
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=60 --conf.rsi_periods=21 --conf.oversold_rsi=30 --conf.overbought_rsi=70
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=60 --conf.rsi_periods=14 --conf.oversold_rsi=25 --conf.overbought_rsi=75
```

## Automatisierte Optimierung

Zenbot bietet eine genetische Optimierungsfunktion:

```bash
./zenbot.sh genetic --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --population=20 --generations=10
```

Dies testet verschiedene Parameterkombinationen und findet die optimale Konfiguration.

## Tipps für effektives Backtesting

1. **Testen Sie über verschiedene Marktphasen**: Bullische, bärische und seitwärts gerichtete Märkte
2. **Vermeiden Sie Overfitting**: Optimieren Sie nicht zu stark auf einen bestimmten Zeitraum
3. **Walk-Forward-Analyse**: Testen Sie auf Daten, die nicht für die Optimierung verwendet wurden
4. **Berücksichtigen Sie Handelsgebühren**: Fügen Sie realistische Gebühren hinzu
5. **Stresstest**: Testen Sie die Strategie in extremen Marktbedingungen

## Beispiel für einen umfassenden Backtest

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=365 --conf.period=1h --conf.min_periods=200 --conf.rsi_periods=14 --conf.oversold_rsi=30 --conf.overbought_rsi=70 --conf.ema_short_period=12 --conf.ema_long_period=26 --conf.signal_period=9 --conf.bollinger_size=2 --conf.bollinger_period=20 --conf.confidence_threshold=0.7 --conf.stop_loss_pct=2 --conf.profit_target_pct=4 --conf.trailing_stop_pct=1 --conf.max_position_size=10 --conf.fee_pct=0.1
```
