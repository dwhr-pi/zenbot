# Bitcoin AI Strategie für Zenbot

Diese Dokumentation beschreibt die Bitcoin AI Strategie für Zenbot, eine fortschrittliche Handelsstrategie, die technische Analyse mit maschinellem Lernen kombiniert, um optimale Handelsentscheidungen für Bitcoin zu treffen.

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Installation](#installation)
3. [Funktionsweise](#funktionsweise)
4. [Parameter](#parameter)
5. [Backtesting](#backtesting)
6. [Optimierung](#optimierung)
7. [Risikomanagement](#risikomanagement)
8. [Fehlerbehebung](#fehlerbehebung)
9. [Häufig gestellte Fragen](#häufig-gestellte-fragen)

## Überblick

Die Bitcoin AI Strategie kombiniert traditionelle technische Indikatoren mit Mustererkennungs-Algorithmen und maschinellem Lernen, um Handelsentscheidungen zu treffen. Die Strategie ist speziell für den Bitcoin-Markt optimiert und berücksichtigt dessen einzigartige Eigenschaften wie hohe Volatilität und 24/7-Handel.

### Hauptmerkmale

- **Hybride Entscheidungsfindung**: Kombiniert technische Indikatoren, Chartmuster-Erkennung und ML-Vorhersagen
- **Anpassbare Parameter**: Umfangreiche Konfigurationsmöglichkeiten für verschiedene Marktbedingungen
- **Integriertes Risikomanagement**: Stop-Loss, Take-Profit und Trailing-Stop-Mechanismen
- **Detaillierte Berichterstattung**: Umfassende Konsolenanzeige für Echtzeit-Überwachung
- **Optimierbare Genetik**: Unterstützung für Zenbot's genetische Optimierungsfunktionen

## Installation

### Voraussetzungen

- Zenbot (installiert und konfiguriert)
- Node.js (Version 10 oder höher)
- MongoDB (Version 4 oder höher)

### Installationsschritte

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

## Funktionsweise

Die Bitcoin AI Strategie arbeitet in mehreren Schritten:

### 1. Berechnung technischer Indikatoren

Die Strategie berechnet folgende technische Indikatoren:
- Relative Strength Index (RSI)
- Moving Average Convergence Divergence (MACD)
- Bollinger Bänder
- Exponential Moving Averages (EMA)
- Volume Weighted Average Price (VWAP)

### 2. Mustererkennung

Ein Mustererkennungs-Algorithmus analysiert die Preisbewegungen, um bekannte Chartmuster zu identifizieren:
- Doppelböden und Doppeltops
- Ausbrüche mit Volumenbestätigung
- Unterstützungs- und Widerstandsniveaus

### 3. ML-Vorhersage

Das integrierte ML-Modell verwendet die berechneten Indikatoren und historischen Daten, um Preisbewegungen vorherzusagen. Es gibt ein Signal (kaufen, verkaufen, halten) mit einem Konfidenzwert zurück.

### 4. Ensemble-Entscheidungsfindung

Die Signale aus allen drei Komponenten werden gewichtet und kombiniert, um eine endgültige Handelsentscheidung zu treffen. Die Gewichtungen können über die Parameter angepasst werden.

### 5. Risikomanagement

Die Strategie wendet Risikomanagement-Regeln an, einschließlich:
- Stop-Loss-Orders
- Take-Profit-Orders
- Trailing-Stops
- Positionsgrößenbegrenzung

## Parameter

Die Bitcoin AI Strategie bietet umfangreiche Konfigurationsmöglichkeiten. Hier sind die wichtigsten Parameter:

### Allgemeine Parameter

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| `period` | Zeitintervall für die Analyse | `1h` |
| `min_periods` | Mindestanzahl an historischen Perioden | `200` |
| `max_slippage_pct` | Maximaler Schlupf in Prozent | `0.5` |
| `keep_lookback_periods` | Anzahl der zu speichernden historischen Perioden | `500` |

### Technische Indikatoren Parameter

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| `rsi_periods` | Perioden für RSI-Berechnung | `14` |
| `oversold_rsi` | RSI-Wert für überverkaufte Bedingung | `30` |
| `overbought_rsi` | RSI-Wert für überkaufte Bedingung | `70` |
| `ema_short_period` | Perioden für kurzfristigen EMA | `12` |
| `ema_long_period` | Perioden für langfristigen EMA | `26` |
| `signal_period` | Perioden für MACD-Signal | `9` |
| `bollinger_size` | Standardabweichungen für Bollinger Bänder | `2` |
| `bollinger_period` | Perioden für Bollinger Bänder | `20` |

### ML-Modell Parameter

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| `prediction_horizon` | Anzahl der Perioden für die Vorhersage | `3` |
| `confidence_threshold` | Mindestkonfidenz für Handelssignale | `0.7` |

### Risikomanagement Parameter

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| `stop_loss_pct` | Stop-Loss in Prozent vom Einstiegspreis | `2` |
| `profit_target_pct` | Gewinnziel in Prozent vom Einstiegspreis | `4` |
| `trailing_stop_pct` | Nachfolgender Stop in Prozent | `1` |
| `max_position_size` | Maximale Positionsgröße in Prozent des Portfolios | `10` |

## Backtesting

Um die Strategie mit historischen Daten zu testen, verwenden Sie den Zenbot-Befehl `sim`:

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=30
```

### Beispiel für Backtesting mit angepassten Parametern

```bash
./zenbot.sh sim --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --days=60 --conf.rsi_periods=21 --conf.oversold_rsi=25 --conf.overbought_rsi=75 --conf.stop_loss_pct=1.5 --conf.profit_target_pct=3
```

### Interpretation der Backtesting-Ergebnisse

Nach Abschluss des Backtests zeigt Zenbot eine Zusammenfassung der Ergebnisse an, einschließlich:

- Gesamtgewinn/Verlust
- Anzahl der Trades
- Gewinn-Verlust-Verhältnis
- Prozentsatz der gewinnbringenden Trades
- Maximaler Drawdown
- Buy & Hold-Vergleich

Achten Sie besonders auf:
- **Sharpe Ratio**: Ein Wert über 1 ist gut, über 2 ist ausgezeichnet
- **Profit Factor**: Sollte über 1.3 liegen
- **Maximum Drawdown**: Sollte unter 20% bleiben

## Optimierung

Die Strategie unterstützt Zenbot's genetische Optimierungsfunktionen. Um die optimalen Parameter für Ihre Handelsbedingungen zu finden:

```bash
./zenbot.sh genetic --strategy bitcoin_ai_strategy --conf.selector="binance.BTC-USDT" --population=20 --generations=10
```

### Empfohlene Optimierungsparameter

Für die besten Ergebnisse empfehlen wir, folgende Parameter zu optimieren:

- `rsi_periods`, `oversold_rsi`, `overbought_rsi`
- `ema_short_period`, `ema_long_period`
- `bollinger_size`, `bollinger_period`
- `stop_loss_pct`, `profit_target_pct`, `trailing_stop_pct`
- `confidence_threshold`

### Optimierung für verschiedene Marktbedingungen

Es ist ratsam, separate Optimierungen für verschiedene Marktbedingungen durchzuführen:

- **Bullischer Markt**: Optimieren Sie mit Daten aus einer Aufwärtsphase
- **Bärischer Markt**: Optimieren Sie mit Daten aus einer Abwärtsphase
- **Seitwärtsmarkt**: Optimieren Sie mit Daten aus einer Konsolidierungsphase

## Risikomanagement

Die Strategie enthält integrierte Risikomanagement-Funktionen, die Sie an Ihre Risikotoleranz anpassen können.

### Stop-Loss

Der Stop-Loss wird als Prozentsatz vom Einstiegspreis festgelegt. Wenn der Preis unter diesen Wert fällt, wird die Position automatisch verkauft.

```bash
--conf.stop_loss_pct=2
```

### Take-Profit

Das Gewinnziel wird als Prozentsatz vom Einstiegspreis festgelegt. Wenn der Preis diesen Wert erreicht, wird die Position automatisch verkauft.

```bash
--conf.profit_target_pct=4
```

### Trailing-Stop

Der Trailing-Stop folgt dem Preis nach oben und wird als Prozentsatz vom Höchstpreis seit dem Einstieg festgelegt.

```bash
--conf.trailing_stop_pct=1
```

### Positionsgrößenbegrenzung

Begrenzt die maximale Größe einer Position als Prozentsatz des Gesamtportfolios.

```bash
--conf.max_position_size=10
```

## Fehlerbehebung

### Häufige Probleme und Lösungen

#### Die Strategie tätigt keine Trades

**Mögliche Ursachen:**
- Nicht genügend historische Daten (`min_periods` nicht erreicht)
- Konfidenz-Schwellenwert zu hoch
- Keine klaren Signale im aktuellen Markt

**Lösungen:**
- Reduzieren Sie `min_periods`
- Senken Sie `confidence_threshold`
- Überprüfen Sie die Marktbedingungen

#### Zu viele Trades

**Mögliche Ursachen:**
- Zu empfindliche Indikatoren-Einstellungen
- Konfidenz-Schwellenwert zu niedrig

**Lösungen:**
- Erhöhen Sie `rsi_periods`
- Passen Sie `oversold_rsi` und `overbought_rsi` an
- Erhöhen Sie `confidence_threshold`

#### Hohe Verluste

**Mögliche Ursachen:**
- Stop-Loss zu weit
- Positionsgröße zu groß
- Ungünstige Marktbedingungen

**Lösungen:**
- Verringern Sie `stop_loss_pct`
- Reduzieren Sie `max_position_size`
- Optimieren Sie die Strategie für die aktuellen Marktbedingungen

## Häufig gestellte Fragen

### Wie funktioniert das ML-Modell?

Das ML-Modell verwendet einen Ensemble-Ansatz, der mehrere Algorithmen kombiniert, um Preisbewegungen vorherzusagen. Es analysiert historische Daten, technische Indikatoren und Marktmuster, um Kauf- oder Verkaufssignale mit einem Konfidenzwert zu generieren.

### Kann ich die Strategie für andere Kryptowährungen verwenden?

Ja, obwohl die Strategie für Bitcoin optimiert ist, kann sie auch mit anderen Kryptowährungen verwendet werden. Es wird jedoch empfohlen, die Parameter für jede Kryptowährung separat zu optimieren.

### Wie oft sollte ich die Strategie neu optimieren?

Es wird empfohlen, die Strategie alle 1-3 Monate neu zu optimieren oder wenn sich die Marktbedingungen signifikant ändern.

### Ist die Strategie für den Live-Handel geeignet?

Ja, die Strategie ist für den Live-Handel konzipiert. Es wird jedoch empfohlen, zunächst ausführliche Backtests durchzuführen und dann mit dem Paper-Trading-Modus von Zenbot zu beginnen, bevor Sie echtes Geld einsetzen.

### Wie kann ich die Strategie weiter verbessern?

- Integrieren Sie externe Datenquellen wie Sentiment-Analyse oder On-Chain-Metriken
- Passen Sie die Gewichtungen der verschiedenen Signalkomponenten an
- Entwickeln Sie benutzerdefinierte Indikatoren für spezifische Marktbedingungen
- Verbessern Sie das ML-Modell mit fortgeschritteneren Algorithmen

---

**Hinweis**: Kryptowährungshandel birgt erhebliche Risiken. Verwenden Sie diese Strategie auf eigene Gefahr und handeln Sie nur mit Geld, dessen Verlust Sie sich leisten können.
