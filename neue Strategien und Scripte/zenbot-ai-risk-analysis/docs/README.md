# README - Zenbot AI Risk Analysis System

## Überblick

Das Zenbot AI Risk Analysis System ist eine fortschrittliche Erweiterung für den Zenbot-Handelsbot, die Künstliche Intelligenz zur Verbesserung der Risikoanalyse und Handelsentscheidungen einsetzt. Das System integriert sowohl OpenAI's ChatGPT als auch lokale Large Language Models (LLMs) über Ollama.

## Schnellstart

### Voraussetzungen
- Node.js 14+ 
- Python 3.7+
- Zenbot 4.0+
- 4 GB RAM (8 GB empfohlen)

### Installation
1. Extrahieren Sie das Zip-Archiv
2. Installieren Sie die API: `cd api && pip install -r requirements.txt`
3. Installieren Sie die Strategie: `cd strategy && npm install`
4. Starten Sie die API: `python src/main.py`
5. Konfigurieren Sie Zenbot mit der AI Risk Strategy

### Grundkonfiguration
```json
{
  "api_url": "http://localhost:5000/api/risk",
  "ai_provider": "ollama",
  "model": "llama2",
  "risk_threshold": 0.7
}
```

## Hauptkomponenten

### 1. AI Risk Analysis API
- Flask-basierte REST API
- Unterstützung für ChatGPT und Ollama
- Strukturierte Risikoanalyse mit JSON-Output
- Health Monitoring und Metriken

### 2. Zenbot AI Risk Strategy
- Node.js-Modul für Zenbot
- Dynamische Positionsgrößenanpassung
- Intelligentes Stop-Loss-Management
- Automatische Handelsunterbrechung bei hohem Risiko

### 3. Konfigurationssystem
- Flexible JSON-basierte Konfiguration
- Umgebungsvariablen-Unterstützung
- Laufzeit-Konfigurationsänderungen

## Funktionen

- **KI-gestützte Sentiment-Analyse**: Verarbeitung von Marktdaten und Nachrichten
- **Dynamisches Risikomanagement**: Anpassung von Positionen basierend auf KI-Erkenntnissen
- **Multi-Provider-Unterstützung**: ChatGPT und Ollama Integration
- **Echtzeit-Monitoring**: Umfassende Logging- und Metriken-Funktionen
- **Sicherheit**: API-Key-Authentifizierung und Rate Limiting

## Dokumentation

- `INSTALLATION_GUIDE.md`: Vollständige Installations- und Konfigurationsanleitung
- `risk_analysis_strategy.md`: Detaillierte Strategiebeschreibung
- `API_REFERENCE.md`: Vollständige API-Dokumentation

## Support und Entwicklung

Dieses System wurde von Manus AI entwickelt und bietet eine innovative Lösung für KI-gestütztes Risikomanagement im algorithmischen Handel.

### Systemanforderungen
- **Minimum**: 4 GB RAM, Dual-Core CPU
- **Empfohlen**: 8 GB RAM, Quad-Core CPU, SSD
- **Für Ollama**: 16 GB RAM, GPU mit 8 GB VRAM (für große Modelle)

### Lizenz
MIT License - Siehe LICENSE-Datei für Details.

### Haftungsausschluss
Dieses System dient nur zu Informationszwecken. Handel mit Kryptowährungen und anderen Finanzinstrumenten birgt erhebliche Risiken. Verwenden Sie das System nur mit Kapital, dessen Verlust Sie sich leisten können.

