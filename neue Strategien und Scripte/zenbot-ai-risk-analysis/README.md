# Zenbot AI Risk Analysis System

## Projektstruktur

```
zenbot-ai-risk-analysis/
├── api/                    # Flask API für KI-Risikoanalyse
│   ├── src/
│   │   ├── main.py        # Haupt-API-Datei
│   │   └── routes/
│   │       └── ai_risk.py # Risk Analysis Endpunkte
│   ├── requirements.txt   # Python-Abhängigkeiten
│   └── .env              # Umgebungsvariablen (zu konfigurieren)
├── strategy/              # Zenbot-Strategie
│   ├── ai_risk_strategy.js # Haupt-Strategie-Datei
│   ├── package.json       # Node.js-Abhängigkeiten
│   ├── test_strategy.js   # Test-Skript
│   └── ai_risk_config.json # Strategie-Konfiguration
├── docs/                  # Dokumentation
│   ├── README.md          # Projekt-Übersicht
│   ├── INSTALLATION_GUIDE.md # Detaillierte Installationsanleitung
│   └── risk_analysis_strategy.md # Strategiebeschreibung
├── examples/              # Beispiel-Konfigurationen
│   ├── .env.example       # Beispiel-Umgebungsvariablen
│   └── ai_risk_config.json # Beispiel-Strategie-Konfiguration
├── install.sh             # Automatisches Installations-Skript
└── LICENSE               # MIT-Lizenz
```

## Schnellstart

1. **Installation ausführen:**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

2. **Konfiguration anpassen:**
   - Bearbeiten Sie `api/.env` für API-Einstellungen
   - Bearbeiten Sie `strategy/ai_risk_config.json` für Strategie-Parameter

3. **API starten:**
   ```bash
   cd api
   source venv/bin/activate
   python src/main.py
   ```

4. **System testen:**
   ```bash
   cd strategy
   node test_strategy.js
   ```

## Hauptfunktionen

- **KI-gestützte Risikoanalyse** mit ChatGPT oder Ollama
- **Dynamisches Positionsmanagement** basierend auf KI-Erkenntnissen
- **Intelligente Stop-Loss-Anpassung** für optimales Risikomanagement
- **Automatische Handelsunterbrechung** bei kritischen Risikosituationen
- **Umfassende API** mit Health Monitoring und Metriken

## Systemanforderungen

- **Minimum:** Node.js 14+, Python 3.7+, 4 GB RAM
- **Empfohlen:** Node.js 18+, Python 3.9+, 8 GB RAM, SSD
- **Für Ollama:** 16 GB RAM, GPU mit 8 GB VRAM (große Modelle)

## Unterstützte KI-Provider

- **OpenAI ChatGPT:** GPT-3.5-turbo, GPT-4
- **Ollama:** Llama 2, Code Llama, Mistral, und andere Open-Source-Modelle

## Dokumentation

Vollständige Dokumentation finden Sie in:
- `docs/INSTALLATION_GUIDE.md` - Detaillierte Installation und Konfiguration
- `docs/risk_analysis_strategy.md` - Strategiekonzept und -theorie

## Support

Für Fragen und Support kontaktieren Sie Manus AI.

## Haftungsausschluss

Dieses System dient nur zu Informationszwecken. Handel birgt erhebliche Risiken.
Verwenden Sie nur Kapital, dessen Verlust Sie sich leisten können.

