# Zenbot Konfigurations-Editor

Ein benutzerfreundlicher Web-Editor für Zenbot `conf.js` Konfigurationsdateien, entwickelt mit Flask und modernem Web-Design.

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Features](#features)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [Konfiguration](#konfiguration)
- [API-Referenz](#api-referenz)
- [Troubleshooting](#troubleshooting)
- [Entwicklung](#entwicklung)
- [Lizenz](#lizenz)

## Überblick

Der Zenbot Konfigurations-Editor ist eine Flask-basierte Webanwendung, die es ermöglicht, Zenbot-Konfigurationsdateien über eine intuitive Weboberfläche zu bearbeiten. Anstatt die `conf.js` Datei manuell in einem Texteditor zu bearbeiten, können Sie alle wichtigen Parameter über Formulare und Dropdown-Menüs verwalten.

### Warum dieser Editor?

Zenbot ist ein leistungsstarker Cryptocurrency-Trading-Bot, aber die Konfiguration über die `conf.js` Datei kann für Anfänger komplex und fehleranfällig sein. Dieser Editor löst folgende Probleme:

- **Benutzerfreundlichkeit**: Keine Notwendigkeit, JavaScript-Syntax zu verstehen
- **Fehlerreduzierung**: Validierung und vordefinierte Optionen verhindern Syntaxfehler
- **Dokumentation**: Integrierte Hilfe für jeden Parameter
- **Backup-Funktionalität**: Automatische Sicherung vor Änderungen
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten

## Features

### Kernfunktionen

- **Webbasierte Bearbeitung**: Moderne, responsive Weboberfläche
- **Intelligentes Parsing**: Automatisches Lesen und Schreiben von `conf.js` Dateien
- **Validierung**: Eingabevalidierung für kritische Parameter
- **Backup-System**: Automatische Backups vor Änderungen
- **Hilfe-System**: Kontextuelle Hilfe für jeden Parameter
- **Reset-Funktion**: Zurücksetzen auf Standardwerte

### Unterstützte Parameter

Der Editor unterstützt die wichtigsten Zenbot-Konfigurationsparameter:

#### Handelsparameter
- **Selector**: Börse und Währungspaar (z.B. `gdax.BTC-USD`)
- **Strategy**: Handelsstrategie (z.B. `trend_ema`, `macd`, `rsi`)
- **Paper Trading**: Simulation vs. Live-Handel

#### Kapital-Management
- **Currency Capital**: Startkapital in Basiswährung
- **Asset Capital**: Bereits vorhandenes Asset-Kapital
- **Buy/Sell Percentage**: Prozentsatz für Käufe und Verkäufe

#### Order-Management
- **Max Slippage**: Maximaler akzeptabler Slippage
- **Order Adjust Time**: Zeit für Order-Anpassungen
- **Order Poll Time**: Intervall für Order-Status-Abfragen

#### Erweiterte Einstellungen
- **Markup/Markdown**: Preisanpassungen für Orders
- **Backfill Days**: Tage für historische Daten

## Installation

### Voraussetzungen

- Python 3.7 oder höher
- pip (Python Package Manager)
- Zenbot Installation (optional, für Live-Tests)

### Schritt-für-Schritt Installation

1. **Projekt herunterladen und entpacken**
   ```bash
   unzip zenbot-config-editor.zip
   cd zenbot-config-editor
   ```

2. **Virtuelle Umgebung erstellen (empfohlen)**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # oder
   venv\Scripts\activate     # Windows
   ```

3. **Abhängigkeiten installieren**
   ```bash
   pip install -r requirements.txt
   ```

4. **Anwendung starten**
   ```bash
   python app.py
   ```

5. **Browser öffnen**
   Navigieren Sie zu `http://localhost:5000`

### Docker Installation (Alternative)

Für eine containerisierte Installation können Sie Docker verwenden:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

```bash
docker build -t zenbot-config-editor .
docker run -p 5000:5000 -v $(pwd)/conf.js:/app/conf.js zenbot-config-editor
```

## Verwendung

### Erste Schritte

1. **Anwendung starten**: Führen Sie `python app.py` aus
2. **Browser öffnen**: Gehen Sie zu `http://localhost:5000`
3. **Konfiguration laden**: Die Anwendung lädt automatisch eine vorhandene `conf.js` oder erstellt eine Beispieldatei

### Grundlegende Bedienung

#### Konfiguration bearbeiten

1. **Parameter auswählen**: Klicken Sie auf ein Eingabefeld
2. **Hilfe anzeigen**: Die Hilfe wird automatisch in der rechten Spalte angezeigt
3. **Werte eingeben**: Verwenden Sie die Dropdown-Menüs oder Eingabefelder
4. **Speichern**: Klicken Sie auf "Konfiguration Speichern"

#### Backup erstellen

- Klicken Sie auf "Backup" in der Navigation
- Ein timestamped Backup wird automatisch erstellt
- Format: `conf_backup_YYYYMMDD_HHMMSS.js`

#### Konfiguration zurücksetzen

- Klicken Sie auf "Reset" in der Navigation
- Bestätigen Sie die Aktion
- Die Konfiguration wird auf Standardwerte zurückgesetzt

### Erweiterte Funktionen

#### Batch-Bearbeitung

Für erweiterte Benutzer bietet die Anwendung die Möglichkeit, mehrere Parameter gleichzeitig zu bearbeiten:

```python
# Beispiel für programmatische Bearbeitung
from app import set_config_value

with open('conf.js', 'r') as f:
    content = f.read()

# Mehrere Werte setzen
content = set_config_value('selector', 'binance.BTC-USDT', content)
content = set_config_value('strategy', 'macd', content)
content = set_config_value('paper', 'false', content)

with open('conf.js', 'w') as f:
    f.write(content)
```

#### API-Integration

Die Anwendung kann auch als API verwendet werden:

```bash
# Konfigurationswerte abrufen
curl http://localhost:5000/api/config

# Konfigurationswerte setzen
curl -X POST http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d '{"selector": "gdax.BTC-USD", "strategy": "trend_ema"}'
```

## Konfiguration

### Umgebungsvariablen

Die Anwendung unterstützt folgende Umgebungsvariablen:

```bash
# Konfigurationsdatei-Pfad
export CONFIG_FILE="/path/to/your/conf.js"

# Flask-Einstellungen
export FLASK_ENV=development
export FLASK_DEBUG=True

# Server-Einstellungen
export HOST=0.0.0.0
export PORT=5000
```

### Anpassung der unterstützten Parameter

Sie können die unterstützten Parameter in `app.py` erweitern:

```python
CONFIG_FIELDS = {
    'your_parameter': {
        'type': 'select',  # oder 'number', 'text'
        'label': 'Ihr Parameter',
        'options': ['option1', 'option2'],  # nur für 'select'
        'help': 'Beschreibung Ihres Parameters'
    }
}
```

### Styling anpassen

Das Design kann über `static/style.css` angepasst werden:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-secondary-color;
}
```

## API-Referenz

### Endpunkte

#### GET /
Hauptseite mit dem Konfigurationsformular

**Response**: HTML-Seite

#### POST /
Speichert die Konfiguration

**Request Body**: Form-Data mit Konfigurationsparametern
**Response**: Redirect zur Hauptseite mit Erfolgsmeldung

#### GET /backup
Erstellt ein Backup der aktuellen Konfiguration

**Response**: Redirect zur Hauptseite mit Backup-Bestätigung

#### GET /reset
Setzt die Konfiguration auf Standardwerte zurück

**Response**: Redirect zur Hauptseite mit Reset-Bestätigung

### Hilfsfunktionen

#### get_config_value(key, content)
Extrahiert einen Wert aus der conf.js

**Parameter**:
- `key`: Parametername
- `content`: Dateiinhalt als String

**Return**: Parameterwert als String

#### set_config_value(key, new_value, content)
Setzt einen Wert in der conf.js

**Parameter**:
- `key`: Parametername
- `new_value`: Neuer Wert
- `content`: Dateiinhalt als String

**Return**: Modifizierter Dateiinhalt

## Troubleshooting

### Häufige Probleme

#### Problem: "conf.js nicht gefunden"
**Lösung**: 
- Stellen Sie sicher, dass sich eine `conf.js` im Projektverzeichnis befindet
- Die Anwendung erstellt automatisch eine Beispieldatei, wenn keine vorhanden ist

#### Problem: "Fehler beim Speichern"
**Lösung**:
- Überprüfen Sie die Dateiberechtigungen
- Stellen Sie sicher, dass die `conf.js` nicht von einem anderen Prozess verwendet wird

#### Problem: "Ungültige Konfiguration"
**Lösung**:
- Verwenden Sie die Reset-Funktion
- Überprüfen Sie die Syntax der `conf.js` manuell

#### Problem: "Server startet nicht"
**Lösung**:
```bash
# Port bereits in Verwendung
lsof -i :5000
kill -9 <PID>

# Abhängigkeiten neu installieren
pip install --force-reinstall -r requirements.txt
```

### Debug-Modus

Für detaillierte Fehlermeldungen aktivieren Sie den Debug-Modus:

```bash
export FLASK_DEBUG=True
python app.py
```

### Logs

Die Anwendung protokolliert wichtige Ereignisse:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Entwicklung

### Projektstruktur

```
zenbot-config-editor/
├── app.py                 # Haupt-Flask-Anwendung
├── requirements.txt       # Python-Abhängigkeiten
├── conf.js               # Zenbot-Konfigurationsdatei
├── templates/            # HTML-Templates
│   ├── index.html        # Hauptseite
│   └── error.html        # Fehlerseite
├── static/               # Statische Dateien
│   └── style.css         # CSS-Styling
└── README.md             # Diese Dokumentation
```

### Entwicklungsumgebung einrichten

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd zenbot-config-editor
   ```

2. **Entwicklungsabhängigkeiten installieren**
   ```bash
   pip install -r requirements.txt
   pip install flask-testing pytest
   ```

3. **Tests ausführen**
   ```bash
   python -m pytest tests/
   ```

### Beitragen

Wir freuen uns über Beiträge! Bitte beachten Sie:

1. **Fork** das Repository
2. **Branch** für Ihr Feature erstellen (`git checkout -b feature/AmazingFeature`)
3. **Commit** Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. **Push** zum Branch (`git push origin feature/AmazingFeature`)
5. **Pull Request** öffnen

### Code-Standards

- **PEP 8** für Python-Code
- **ESLint** für JavaScript
- **Prettier** für HTML/CSS
- **Docstrings** für alle Funktionen

### Testing

```python
# Beispiel-Test
import unittest
from app import app, get_config_value

class TestConfigEditor(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        
    def test_get_config_value(self):
        content = "c.selector = 'gdax.BTC-USD'"
        value = get_config_value('selector', content)
        self.assertEqual(value, 'gdax.BTC-USD')
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

---

**Entwickelt von Manus AI** | Version 1.0 | 2024

Für Support und Fragen besuchen Sie unsere [GitHub-Seite](https://github.com/manus-ai/zenbot-config-editor) oder erstellen Sie ein Issue.

