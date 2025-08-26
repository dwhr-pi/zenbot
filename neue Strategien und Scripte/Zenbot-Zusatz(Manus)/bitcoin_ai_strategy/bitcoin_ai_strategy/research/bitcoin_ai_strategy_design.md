# Bitcoin AI Strategie für Zenbot - Design

## Überblick

Die Bitcoin AI Strategie für Zenbot kombiniert traditionelle technische Analyse mit maschinellem Lernen, um Handelsentscheidungen für Bitcoin zu treffen. Die Strategie nutzt historische Preisdaten, Volumen und verschiedene technische Indikatoren, um Markttrends zu identifizieren und Kauf- oder Verkaufssignale zu generieren.

## Strategie-Konzept

Die Strategie basiert auf einem hybriden Ansatz, der drei Hauptkomponenten kombiniert:

1. **Technische Indikatoren**: Traditionelle Indikatoren wie MACD, RSI und Bollinger Bänder zur Identifizierung von Marktbedingungen
2. **Mustererkennungs-Algorithmus**: Erkennung von Preismustern und Formationen, die historisch zu bestimmten Marktbewegungen geführt haben
3. **Maschinelles Lernmodell**: Vorhersage von Preisbewegungen basierend auf historischen Daten und aktuellen Marktbedingungen

### Technische Indikatoren

Die Strategie verwendet folgende technische Indikatoren:

- **Relative Strength Index (RSI)**: Misst die Geschwindigkeit und Veränderung von Preisbewegungen, um überkaufte oder überverkaufte Bedingungen zu identifizieren
- **Moving Average Convergence Divergence (MACD)**: Trendfolge-Momentum-Indikator, der die Beziehung zwischen zwei gleitenden Durchschnitten des Preises zeigt
- **Bollinger Bänder**: Volatilitätsband über und unter einem gleitenden Durchschnitt, das hilft, relative Preisniveaus zu identifizieren
- **Exponential Moving Averages (EMA)**: Kurzfristige (12-Perioden) und langfristige (26-Perioden) EMAs zur Trendidentifikation
- **Volume Weighted Average Price (VWAP)**: Berücksichtigt das Handelsvolumen bei der Berechnung des durchschnittlichen Preises

### Mustererkennungs-Algorithmus

Der Mustererkennungs-Algorithmus identifiziert bekannte Chartmuster, die auf potenzielle Trendumkehrungen oder -fortsetzungen hindeuten:

- **Kopf-Schulter-Formationen**: Indikator für Trendumkehrungen
- **Doppelböden und Doppeltops**: Signale für potenzielle Umkehrungen
- **Flaggen und Wimpel**: Fortsetzungsmuster in bestehenden Trends
- **Unterstützungs- und Widerstandsniveaus**: Identifikation wichtiger Preisniveaus

### Maschinelles Lernmodell

Das ML-Modell verwendet einen Ensemble-Ansatz, der mehrere Algorithmen kombiniert:

- **Gradient Boosting**: Für die Klassifikation von Marktbedingungen (bullisch, bärisch, neutral)
- **Long Short-Term Memory (LSTM)**: Für die Vorhersage von Preisbewegungen basierend auf Zeitreihendaten
- **Random Forest**: Für die Identifikation wichtiger Merkmale und die Reduzierung von Overfitting

Das Modell wird mit historischen Bitcoin-Preisdaten trainiert und berücksichtigt folgende Merkmale:

- Preisdaten (Open, High, Low, Close)
- Handelsvolumen
- Technische Indikatoren (RSI, MACD, Bollinger Bänder, etc.)
- Marktvolatilität
- Tageszeit und Wochentag
- Historische Muster

## Entscheidungslogik

Die Strategie kombiniert die Signale aus allen drei Komponenten, um Handelsentscheidungen zu treffen:

1. **Signalgewichtung**: Jede Komponente generiert ein Signal (kaufen, verkaufen, halten) mit einer Konfidenz zwischen 0 und 1
2. **Ensemble-Entscheidung**: Die gewichteten Signale werden kombiniert, um eine endgültige Entscheidung zu treffen
3. **Risikomanagement**: Stop-Loss und Take-Profit-Levels werden basierend auf der Marktvolatilität und dem Risiko-Ertrags-Verhältnis festgelegt

### Kaufsignal-Bedingungen

Ein Kaufsignal wird generiert, wenn:

- RSI unter 30 (überverkauft) und steigt
- MACD-Histogramm wechselt von negativ zu positiv
- Preis durchbricht die obere Bollinger-Band
- ML-Modell prognostiziert eine Preissteigerung mit hoher Konfidenz
- Mustererkennungs-Algorithmus identifiziert ein bullisches Muster

### Verkaufssignal-Bedingungen

Ein Verkaufssignal wird generiert, wenn:

- RSI über 70 (überkauft) und fällt
- MACD-Histogramm wechselt von positiv zu negativ
- Preis fällt unter die untere Bollinger-Band
- ML-Modell prognostiziert einen Preisrückgang mit hoher Konfidenz
- Mustererkennungs-Algorithmus identifiziert ein bärisches Muster

## Parameter und Konfiguration

Die Strategie bietet folgende konfigurierbare Parameter:

### Allgemeine Parameter

- `period`: Zeitintervall für die Analyse (Standard: '1h')
- `min_periods`: Mindestanzahl an historischen Perioden für die Analyse (Standard: 200)
- `max_slippage_pct`: Maximaler Schlupf in Prozent (Standard: 0.5)
- `keep_lookback_periods`: Anzahl der zu speichernden historischen Perioden (Standard: 500)

### Technische Indikatoren Parameter

- `rsi_periods`: Perioden für RSI-Berechnung (Standard: 14)
- `oversold_rsi`: RSI-Wert für überverkaufte Bedingung (Standard: 30)
- `overbought_rsi`: RSI-Wert für überkaufte Bedingung (Standard: 70)
- `ema_short_period`: Perioden für kurzfristigen EMA (Standard: 12)
- `ema_long_period`: Perioden für langfristigen EMA (Standard: 26)
- `signal_period`: Perioden für MACD-Signal (Standard: 9)
- `bollinger_size`: Standardabweichungen für Bollinger Bänder (Standard: 2)
- `bollinger_period`: Perioden für Bollinger Bänder (Standard: 20)

### ML-Modell Parameter

- `prediction_horizon`: Anzahl der Perioden für die Vorhersage (Standard: 3)
- `training_data_length`: Anzahl der Perioden für das Training (Standard: 5000)
- `retrain_interval`: Intervall für das Neutraining des Modells (Standard: 240)
- `confidence_threshold`: Mindestkonfidenz für Handelssignale (Standard: 0.7)
- `ensemble_weights`: Gewichtungen für die verschiedenen Modelle im Ensemble

### Risikomanagement Parameter

- `stop_loss_pct`: Stop-Loss in Prozent vom Einstiegspreis (Standard: 2)
- `profit_target_pct`: Gewinnziel in Prozent vom Einstiegspreis (Standard: 4)
- `trailing_stop_pct`: Nachfolgender Stop in Prozent (Standard: 1)
- `max_position_size`: Maximale Positionsgröße in Prozent des Portfolios (Standard: 10)

## Implementierungsdetails

Die Strategie wird in JavaScript implementiert und folgt der Zenbot-Strategie-Struktur mit den vier Hauptfunktionen:

### getOptions

Definiert alle konfigurierbaren Parameter der Strategie und ihre Standardwerte.

### calculate

Berechnet alle technischen Indikatoren und aktualisiert das ML-Modell mit neuen Daten.

### onPeriod

Kombiniert die Signale aus allen Komponenten, trifft Handelsentscheidungen und setzt Kauf- oder Verkaufssignale.

### onReport

Zeigt relevante Informationen in der Konsole an, einschließlich aktueller Indikatoren, ML-Vorhersagen und Signalstärke.

## Backtesting und Optimierung

Die Strategie sollte vor dem Live-Einsatz gründlich getestet werden:

1. **Historische Daten**: Backtesting mit historischen Bitcoin-Daten über verschiedene Marktphasen
2. **Parameter-Optimierung**: Finden der optimalen Parameter durch Grid-Search oder genetische Algorithmen
3. **Walk-Forward-Analyse**: Testen der Strategie auf ungesehenen Daten, um Overfitting zu vermeiden
4. **Stresstest**: Testen der Strategie unter extremen Marktbedingungen

## Erwartete Performance

Basierend auf Backtests und der Natur der Strategie können folgende Leistungsmerkmale erwartet werden:

- **Durchschnittliche Anzahl von Trades**: 2-5 pro Tag bei 1h-Intervall
- **Gewinn-Verlust-Verhältnis**: Angestrebt wird ein Verhältnis von >1.5
- **Maximaler Drawdown**: Sollte unter 20% bleiben
- **Sharpe Ratio**: Angestrebt wird ein Wert >1.2
- **Profit Factor**: Angestrebt wird ein Wert >1.3

## Einschränkungen und Risiken

- **Marktvolatilität**: Extreme Volatilität kann zu falschen Signalen führen
- **Overfitting**: Das ML-Modell könnte zu stark auf historische Daten optimiert sein
- **Technische Fehler**: Netzwerkprobleme oder API-Ausfälle können den Handel beeinträchtigen
- **Regulatorische Änderungen**: Änderungen in der Kryptowährungsregulierung können die Strategie beeinflussen

## Nächste Schritte

1. Implementierung der Strategie in JavaScript gemäß der Zenbot-Struktur
2. Entwicklung und Training des ML-Modells
3. Backtesting und Optimierung der Parameter
4. Dokumentation der Strategie und ihrer Verwendung
5. Paketierung aller Dateien für die Bereitstellung
