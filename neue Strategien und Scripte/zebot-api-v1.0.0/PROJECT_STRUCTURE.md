# Zebot API - Projektstruktur

```
zebot-api/
├── zebot_api.js              # Haupt-API-Klasse (12.4 KB)
├── examples.js               # Verwendungsbeispiele (5.7 KB)
├── test.js                   # Test-Suite (7.0 KB)
├── package.json              # NPM-Konfiguration
├── package-lock.json         # NPM-Lock-Datei
├── README.md                 # Hauptdokumentation (3.2 KB)
├── CHANGELOG.md              # Versionshistorie (4.2 KB)
├── docs/                     # Dokumentationsverzeichnis
│   ├── api-reference.md      # Vollständige API-Referenz (16.6 KB)
│   ├── installation.md       # Installationsanleitung (12.0 KB)
│   └── examples.md           # Detaillierte Beispiele (39.3 KB)
└── node_modules/             # NPM-Abhängigkeiten
    └── ccxt/                 # CCXT-Bibliothek
```

## Dateibeschreibungen

### Kern-Dateien
- **zebot_api.js**: Die Hauptklasse mit allen API-Methoden
- **examples.js**: Praktische Beispiele für die API-Nutzung
- **test.js**: Umfassende Test-Suite für Qualitätssicherung
- **package.json**: NPM-Konfiguration mit Abhängigkeiten

### Dokumentation
- **README.md**: Schnellstart und Übersicht
- **CHANGELOG.md**: Versionshistorie und Features
- **docs/api-reference.md**: Vollständige Methodendokumentation
- **docs/installation.md**: Detaillierte Installationsanleitung
- **docs/examples.md**: Umfassende Beispielsammlung

### Abhängigkeiten
- **ccxt**: Kryptowährungs-Trading-Bibliothek (v4.0.0)

## Gesamtgröße
- Quellcode: ~100 KB
- Dokumentation: ~70 KB
- Abhängigkeiten: ~2 MB (node_modules)
- Gesamt (ohne node_modules): ~170 KB

## Installation
1. Entpacken Sie die ZIP-Datei
2. Führen Sie `npm install` aus
3. Testen Sie mit `node test.js`
4. Starten Sie mit den Beispielen: `node examples.js`

## Support
- GitHub: [Repository-Link]
- E-Mail: support@zebot-api.com
- Dokumentation: Siehe docs/ Verzeichnis

