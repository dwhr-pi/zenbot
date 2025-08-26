# Zenbot Copy-Trading Strategie

## Übersicht

Diese Copy-Trading-Strategie für Zenbot ermöglicht es, Handelssignale von externen Quellen zu empfangen und automatisch auszuführen. Die Strategie ist flexibel konfigurierbar und unterstützt verschiedene Signalquellen sowie umfangreiche Risikomanagement-Funktionen.

## Funktionen

- **Mehrere Signalquellen**: Unterstützung für dateibasierte Signale, API-Abfragen und Webhooks
- **Flexibles Risikomanagement**: Konfigurierbare Stop-Loss und Take-Profit Levels
- **Positionsgrößenberechnung**: Automatische Anpassung der Handelsgrößen basierend auf Kontogröße und Risikoparametern
- **Handelszeitfenster**: Beschränkung des Handels auf bestimmte Zeitfenster
- **Signalfilterung**: Filterung von Signalen basierend auf Qualitätskriterien
- **Detailliertes Logging**: Umfassende Protokollierung aller Aktivitäten

## Installation

1. Kopieren Sie die Strategie-Dateien in das Verzeichnis `extensions/strategies/copy_trading` Ihrer Zenbot-Installation:

```bash
mkdir -p /pfad/zu/zenbot/extensions/strategies/copy_trading
cp strategy.js /pfad/zu/zenbot/extensions/strategies/copy_trading/
```

2. Erstellen Sie eine Signaldatei (falls Sie die dateibasierte Signalquelle verwenden):

```bash
touch /pfad/zu/zenbot/signals.json
```

## Verwendung

Starten Sie Zenbot mit der Copy-Trading-Strategie:

```bash
./zenbot.sh trade --strategy=copy_trading [Optionen]
```

### Beispiel-Konfigurationen

#### Grundlegende Konfiguration:

```bash
./zenbot.sh trade --strategy=copy_trading --period=5m
```

#### Mit dateibasierter Signalquelle:

```bash
./zenbot.sh trade --strategy=copy_trading --signal_source=file --signal_file=/pfad/zu/signals.json
```

#### Mit API-Signalquelle:

```bash
./zenbot.sh trade --strategy=copy_trading --signal_source=api --api_url=https://example.com/signals --api_key=YOUR_API_KEY
```

#### Mit Webhook-Signalquelle:

```bash
./zenbot.sh trade --strategy=copy_trading --signal_source=webhook --webhook_port=8080
```

#### Mit Risikomanagement:

```bash
./zenbot.sh trade --strategy=copy_trading --risk_percentage=2 --stop_loss_pct=3 --take_profit_pct=6 --max_drawdown_pct=10
```

#### Mit Handelszeitfenster:

```bash
./zenbot.sh trade --strategy=copy_trading --enable_trading_hours=true --trading_hours_start=09:00 --trading_hours_end=17:00
```

## Konfigurationsoptionen

| Option | Beschreibung | Typ | Standard |
|--------|--------------|-----|----------|
| `period` | Zeit in Minuten zwischen Signal-Prüfungen | String | `1m` |
| `signal_source` | Signalquelle (file, webhook, api) | String | `file` |
| `signal_file` | Pfad zur Signaldatei bei Verwendung von file als Quelle | String | `signals.json` |
| `api_url` | URL der API bei Verwendung von api als Quelle | String | `` |
| `api_key` | API-Schlüssel für die Authentifizierung | String | `` |
| `webhook_port` | Port für den Webhook-Server bei Verwendung von webhook als Quelle | Number | `8080` |
| `risk_percentage` | Prozentsatz des Kapitals pro Trade (0-100) | Number | `1` |
| `max_open_trades` | Maximale Anzahl offener Trades | Number | `3` |
| `stop_loss_pct` | Stop-Loss in Prozent vom Einstiegspreis (0 = deaktiviert) | Number | `5` |
| `take_profit_pct` | Take-Profit in Prozent vom Einstiegspreis (0 = deaktiviert) | Number | `10` |
| `max_drawdown_pct` | Maximaler Drawdown in Prozent, bevor der Handel pausiert wird (0 = deaktiviert) | Number | `15` |
| `max_slippage_pct` | Maximaler Slippage in Prozent (0 = unbegrenzt) | Number | `1` |
| `signal_timeout` | Timeout für Signale in Minuten (0 = kein Timeout) | Number | `60` |
| `enable_trading_hours` | Aktiviert Handelszeitfenster | Boolean | `false` |
| `trading_hours_start` | Startzeit des Handelszeitfensters (HH:MM) | String | `09:00` |
| `trading_hours_end` | Endzeit des Handelszeitfensters (HH:MM) | String | `17:00` |
| `enable_signal_filter` | Aktiviert Signalfilterung | Boolean | `false` |
| `min_signal_quality` | Minimale Signalqualität (0-100) | Number | `50` |
| `enable_logging` | Aktiviert detailliertes Logging | Boolean | `true` |
| `log_file` | Pfad zur Log-Datei | String | `copy_trading.log` |

## Signalformat

Die Strategie erwartet Signale im folgenden JSON-Format:

```json
{
  "action": "buy",           // oder "sell"
  "symbol": "BTC-USD",       // Handelspaar
  "price": 50000,            // Optional: Preislimit
  "amount": 0.1,             // Optional: Handelsmenge
  "timestamp": 1621234567,   // Zeitstempel des Signals
  "source": "trader_name",   // Quelle des Signals
  "id": "unique_id",         // Eindeutige ID des Signals
  "quality": 75              // Optional: Signalqualität (0-100)
}
```

## Empfohlene Einstellungen

Basierend auf unseren Tests empfehlen wir die folgenden Einstellungen für verschiedene Handelsstrategien:

### Konservative Strategie (geringes Risiko)

```bash
./zenbot.sh trade --strategy=copy_trading \
  --period=15m \
  --risk_percentage=1 \
  --max_open_trades=2 \
  --stop_loss_pct=3 \
  --take_profit_pct=6 \
  --max_drawdown_pct=10 \
  --max_slippage_pct=0.5 \
  --enable_signal_filter=true \
  --min_signal_quality=70
```

### Ausgewogene Strategie (mittleres Risiko)

```bash
./zenbot.sh trade --strategy=copy_trading \
  --period=5m \
  --risk_percentage=2 \
  --max_open_trades=3 \
  --stop_loss_pct=5 \
  --take_profit_pct=10 \
  --max_drawdown_pct=15 \
  --max_slippage_pct=1 \
  --enable_signal_filter=true \
  --min_signal_quality=50
```

### Aggressive Strategie (hohes Risiko)

```bash
./zenbot.sh trade --strategy=copy_trading \
  --period=1m \
  --risk_percentage=5 \
  --max_open_trades=5 \
  --stop_loss_pct=10 \
  --take_profit_pct=20 \
  --max_drawdown_pct=25 \
  --max_slippage_pct=2 \
  --enable_signal_filter=false
```

## Erweiterte Konfiguration

### Signalquellen einrichten

#### Dateibasierte Signalquelle

Erstellen Sie eine JSON-Datei mit einem Array von Signalen:

```json
[
  {
    "action": "buy",
    "symbol": "BTC-USD",
    "price": 50000,
    "timestamp": 1621234567,
    "source": "manual",
    "id": "signal_1"
  },
  {
    "action": "sell",
    "symbol": "ETH-USD",
    "price": 3000,
    "timestamp": 1621234568,
    "source": "manual",
    "id": "signal_2"
  }
]
```

#### API-Signalquelle

Die API sollte Signale im oben beschriebenen Format zurückgeben. Die Strategie ruft die API regelmäßig ab und verarbeitet neue Signale.

#### Webhook-Signalquelle

Für die Webhook-Unterstützung ist eine zusätzliche Implementierung erforderlich. Die Strategie startet einen HTTP-Server, der Signale im oben beschriebenen Format empfängt.

### Risikomanagement anpassen

Das Risikomanagement kann über die folgenden Parameter angepasst werden:

- `risk_percentage`: Prozentsatz des Kapitals, der pro Trade riskiert wird
- `stop_loss_pct`: Prozentsatz, bei dem ein Trade automatisch mit Verlust geschlossen wird
- `take_profit_pct`: Prozentsatz, bei dem ein Trade automatisch mit Gewinn geschlossen wird
- `max_drawdown_pct`: Maximaler Drawdown, bevor der Handel pausiert wird

### Handelszeitfenster konfigurieren

Mit den Handelszeitfenstern können Sie den Handel auf bestimmte Zeiten beschränken:

```bash
./zenbot.sh trade --strategy=copy_trading \
  --enable_trading_hours=true \
  --trading_hours_start=09:00 \
  --trading_hours_end=17:00
```

## Fehlerbehebung

### Keine Signale werden verarbeitet

- Überprüfen Sie, ob die Signalquelle korrekt konfiguriert ist
- Stellen Sie sicher, dass die Signale im richtigen Format vorliegen
- Überprüfen Sie die Logs auf Fehlermeldungen

### Trades werden nicht ausgeführt

- Überprüfen Sie, ob die maximale Anzahl offener Trades erreicht ist
- Stellen Sie sicher, dass der maximale Drawdown nicht überschritten wurde
- Überprüfen Sie, ob die Signale innerhalb des konfigurierten Handelszeitfensters liegen

### Webhook funktioniert nicht

- Stellen Sie sicher, dass der Port nicht von einer anderen Anwendung verwendet wird
- Überprüfen Sie, ob Ihre Firewall den Port blockiert
- Testen Sie den Webhook mit einem Tool wie curl oder Postman

## Limitierungen

- Die Webhook-Unterstützung erfordert eine zusätzliche Implementierung
- Die Strategie simuliert Signale für Demonstrationszwecke; in einer realen Umgebung müssen Sie eine echte Signalquelle konfigurieren
- Die Positionsgrößenberechnung verwendet einen festen Wert für die Kontogröße; in einer realen Umgebung sollte dies angepasst werden

## Haftungsausschluss

Diese Strategie wird ohne jegliche Garantie bereitgestellt. Der Handel mit Kryptowährungen birgt erhebliche Risiken und kann zu finanziellen Verlusten führen. Verwenden Sie diese Strategie auf eigenes Risiko und testen Sie sie gründlich in einer Simulationsumgebung, bevor Sie sie mit echtem Geld einsetzen.
