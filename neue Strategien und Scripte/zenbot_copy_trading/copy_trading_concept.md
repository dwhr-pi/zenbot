# Zenbot Copy-Trading Strategie Konzept

## Übersicht

Die Copy-Trading-Strategie für Zenbot ermöglicht es, die Trades eines erfolgreichen Traders oder einer Signalquelle automatisch zu kopieren und auszuführen. Da Zenbot keine native Copy-Trading-Funktion bietet, implementieren wir diese als eigene Strategie-Erweiterung.

## Funktionsweise

1. **Signal-Empfang**: Die Strategie empfängt Handelssignale von einer externen Quelle (API, Webhook, Datei)
2. **Signal-Validierung**: Überprüfung der Signale auf Gültigkeit und Konformität
3. **Handelsausführung**: Automatische Ausführung der empfangenen Signale als Trades
4. **Risikomanagement**: Anpassung der Handelsgrößen und Implementierung von Schutzmaßnahmen
5. **Protokollierung**: Aufzeichnung aller Aktivitäten für Analyse und Nachverfolgung

## Architektur

Die Copy-Trading-Strategie besteht aus folgenden Komponenten:

1. **Signal-Adapter**: Verbindung zu verschiedenen Signalquellen (REST API, Webhook, Dateisystem)
2. **Strategie-Logik**: Kernkomponente zur Verarbeitung der Signale und Entscheidungsfindung
3. **Konfigurationsmodul**: Anpassbare Parameter für verschiedene Handelsstrategien
4. **Risikomanagement-Modul**: Schutz vor übermäßigen Verlusten und Positionsgrößenanpassung
5. **Logging-Modul**: Detaillierte Aufzeichnung aller Aktivitäten

## Signalquellen

Die Strategie unterstützt folgende Signalquellen:

1. **Webhook-Endpunkt**: Empfang von Signalen über HTTP-Anfragen
2. **API-Polling**: Regelmäßige Abfrage einer API nach neuen Signalen
3. **Dateisystem-Überwachung**: Überwachung einer Datei auf neue Signale
4. **Manuelle Eingabe**: Möglichkeit zur manuellen Eingabe von Signalen

## Signalformat

Ein typisches Signal enthält folgende Informationen:

```json
{
  "action": "buy",           // oder "sell"
  "symbol": "BTC-USD",       // Handelspaar
  "price": 50000,            // Optional: Preislimit
  "amount": 0.1,             // Optional: Handelsmenge
  "timestamp": 1621234567,   // Zeitstempel des Signals
  "source": "trader_name",   // Quelle des Signals
  "id": "unique_id"          // Eindeutige ID des Signals
}
```

## Risikomanagement

Die Strategie implementiert folgende Risikomanagement-Funktionen:

1. **Positionsgrößenanpassung**: Anpassung der Handelsgröße basierend auf Kontogröße und Risikoparametern
2. **Stop-Loss**: Automatische Platzierung von Stop-Loss-Orders
3. **Take-Profit**: Automatische Platzierung von Take-Profit-Orders
4. **Maximaler Drawdown**: Pausierung des Handels bei Erreichen eines maximalen Drawdowns
5. **Handelsfrequenzbegrenzung**: Begrenzung der Anzahl der Trades pro Zeiteinheit

## Konfigurationsparameter

Die Strategie bietet folgende konfigurierbare Parameter:

1. **Signalquelle**: Konfiguration der Signalquelle (URL, Dateiname, etc.)
2. **Handelspaare**: Liste der zu handelnden Paare
3. **Risikomanagement**: Einstellungen für Stop-Loss, Take-Profit, etc.
4. **Positionsgröße**: Festlegung der Handelsgröße (absolut oder prozentual)
5. **Zeitfilter**: Beschränkung des Handels auf bestimmte Zeitfenster
6. **Signalfilter**: Filterung von Signalen basierend auf benutzerdefinierten Kriterien
