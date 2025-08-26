# Zusammenfassung aller Zenbot-Strategien

Dieses Dokument bietet einen Überblick über alle verfügbaren Strategien in Zenbot mit ihren optimalen Voreinstellungen. Jede Strategie wird in einer separaten Markdown-Datei ausführlich erklärt.

## Verfügbare Strategien

1. **Trend EMA** - Die Standardstrategie von Zenbot, basierend auf exponentiellen gleitenden Durchschnitten
2. **MACD** - Moving Average Convergence Divergence Strategie
3. **RSI** - Relative Strength Index Strategie
4. **Bollinger** - Bollinger-Bänder-Strategie
5. **SAR** - Parabolic Stop and Reverse Strategie
6. **CCI SRSI** - Kombination aus Commodity Channel Index und Stochastischem RSI
7. **DEMA** - Double Exponential Moving Average Strategie
8. **Neural** - Neuronales Netzwerk zur Preisvorhersage
9. **Ichimoku Score** - Bewertungssystem basierend auf Ichimoku Kinko Hyo
10. **TA_EMA** - Technische Analyse mit exponentiellen gleitenden Durchschnitten
11. **TA_MACD** - Technische Analyse mit MACD
12. **TA_MACD_EXT** - Erweiterte MACD-Strategie mit anpassbaren MA-Typen
13. **TA_PPO** - Percentage Price Oscillator Strategie
14. **Trust Distrust** - Strategie basierend auf Preishöchst- und -tiefstpunkten
15. **Wavetrend** - Momentum-Oszillator für überkaufte und überverkaufte Bedingungen

## Empfehlungen für Anfänger

Wenn Sie neu bei Zenbot sind, empfehlen wir, mit einer der folgenden Strategien zu beginnen:

1. **Trend EMA** - Die Standardstrategie ist gut dokumentiert und einfach zu verstehen
2. **MACD** - Eine klassische und bewährte Handelsstrategie
3. **Bollinger** - Effektiv in Märkten mit klaren Handelsspannen

## Empfehlungen für fortgeschrittene Benutzer

Für erfahrene Händler bieten diese Strategien mehr Anpassungsmöglichkeiten:

1. **Ichimoku Score** - Ein umfassendes System mit mehreren Signalkomponenten
2. **Neural** - Maschinelles Lernen für Preisvorhersagen
3. **TA_MACD_EXT** - Erweiterte Kontrolle über MACD-Parameter

## Optimierung von Strategien

Alle Strategien können mit dem Befehl `zenbot sim` getestet und optimiert werden. Beispiel:

```
zenbot sim exchange.pair --strategy=trend_ema --days=60
```

Für fortgeschrittene Optimierung können Sie den genetischen Algorithmus von Zenbot verwenden:

```
cd scripts/genetic_algo
./darwin.js --population=20 --days=60 --selector=binance.BTC-USDT --strategy=trend_ema
```

Weitere Informationen finden Sie in den einzelnen Strategiedokumentationen.
