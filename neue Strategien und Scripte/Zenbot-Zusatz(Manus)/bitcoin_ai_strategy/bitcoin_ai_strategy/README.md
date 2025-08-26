# Bitcoin AI Strategie für Zenbot

Diese README-Datei bietet einen Überblick über die Bitcoin AI Strategie für Zenbot und die Inhalte dieses Pakets.

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Verzeichnisstruktur](#verzeichnisstruktur)
- [Installation](#installation)
- [Dokumentation](#dokumentation)
- [Lizenz](#lizenz)

## Überblick

Die Bitcoin AI Strategie für Zenbot ist eine fortschrittliche Handelsstrategie, die technische Analyse mit maschinellem Lernen kombiniert, um optimale Handelsentscheidungen für Bitcoin zu treffen. Die Strategie nutzt verschiedene technische Indikatoren, Mustererkennungs-Algorithmen und ein ML-Modell, um Kauf- und Verkaufssignale zu generieren.

## Verzeichnisstruktur

```
bitcoin_ai_strategy/
├── docs/                      # Ausführliche Dokumentation
│   ├── README.md              # Hauptdokumentation
│   ├── INSTALLATION.md        # Installationsanleitung
│   ├── CONFIGURATION.md       # Konfigurationsbeispiele
│   └── BACKTESTING.md         # Anleitung zum Backtesting
├── research/                  # Forschung und Design
│   ├── zenbot_strategy_requirements.md  # Anforderungsanalyse
│   └── bitcoin_ai_strategy_design.md    # Strategie-Design
├── src/                       # Quellcode
│   └── bitcoin_ai_strategy.js # Hauptstrategie-Datei
└── README.md                  # Diese Datei
```

## Installation

Siehe [INSTALLATION.md](docs/INSTALLATION.md) für detaillierte Installationsanweisungen.

Kurzfassung:

1. Entpacken Sie die ZIP-Datei
2. Kopieren Sie den Ordner `bitcoin_ai_strategy` in das Verzeichnis `extensions/strategies/` Ihrer Zenbot-Installation
3. Starten Sie Zenbot neu
4. Überprüfen Sie die Installation mit `./zenbot.sh list-strategies`

## Dokumentation

- [Hauptdokumentation](docs/README.md) - Ausführliche Beschreibung der Strategie
- [Installationsanleitung](docs/INSTALLATION.md) - Schritt-für-Schritt-Installationsanleitung
- [Konfigurationsbeispiele](docs/CONFIGURATION.md) - Beispielkonfigurationen für verschiedene Marktbedingungen
- [Backtesting-Anleitung](docs/BACKTESTING.md) - Anleitung zum Testen der Strategie mit historischen Daten

## Lizenz

Diese Strategie wird unter der MIT-Lizenz veröffentlicht. Sie können sie frei verwenden, modifizieren und verteilen, solange Sie den ursprünglichen Urheberrechtsvermerk beibehalten.

---

**Hinweis**: Kryptowährungshandel birgt erhebliche Risiken. Verwenden Sie diese Strategie auf eigene Gefahr und handeln Sie nur mit Geld, dessen Verlust Sie sich leisten können.
