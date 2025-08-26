#!/bin/bash

# Zenbot AI Risk Analysis - Installations-Skript
# Dieses Skript automatisiert die Installation des Systems

set -e

echo "=== Zenbot AI Risk Analysis Installation ==="
echo "Dieses Skript installiert das AI Risk Analysis System für Zenbot"
echo ""

# Überprüfe Systemanforderungen
echo "Überprüfe Systemanforderungen..."

# Node.js überprüfen
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installieren Sie Node.js 14+ vor der Fortsetzung."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js Version $NODE_VERSION ist zu alt. Mindestens Version 14 erforderlich."
    exit 1
fi
echo "✅ Node.js $(node --version) gefunden"

# Python überprüfen
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 ist nicht installiert. Bitte installieren Sie Python 3.7+ vor der Fortsetzung."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
if ! python3 -c "import sys; exit(0 if sys.version_info >= (3,7) else 1)"; then
    echo "❌ Python Version $PYTHON_VERSION ist zu alt. Mindestens Version 3.7 erforderlich."
    exit 1
fi
echo "✅ Python $(python3 --version) gefunden"

# pip überprüfen
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 ist nicht installiert. Bitte installieren Sie pip3 vor der Fortsetzung."
    exit 1
fi
echo "✅ pip3 gefunden"

echo ""
echo "Alle Systemanforderungen erfüllt!"
echo ""

# Installation der API
echo "=== API Installation ==="
cd api

echo "Erstelle virtuelle Python-Umgebung..."
python3 -m venv venv

echo "Aktiviere virtuelle Umgebung..."
source venv/bin/activate

echo "Installiere Python-Abhängigkeiten..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ API erfolgreich installiert"
echo ""

# Installation der Strategie
echo "=== Strategie Installation ==="
cd ../strategy

echo "Installiere Node.js-Abhängigkeiten..."
npm install

echo "✅ Strategie erfolgreich installiert"
echo ""

# Konfiguration
echo "=== Konfiguration ==="
cd ../examples

echo "Kopiere Beispiel-Konfigurationsdateien..."
cp .env.example ../api/.env
cp ai_risk_config.json ../strategy/

echo "✅ Beispiel-Konfigurationen kopiert"
echo ""

# Abschluss
echo "=== Installation abgeschlossen ==="
echo ""
echo "Nächste Schritte:"
echo "1. Bearbeiten Sie die Konfigurationsdateien:"
echo "   - api/.env (API-Konfiguration)"
echo "   - strategy/ai_risk_config.json (Strategie-Konfiguration)"
echo ""
echo "2. Starten Sie die API:"
echo "   cd api && source venv/bin/activate && python src/main.py"
echo ""
echo "3. Testen Sie die Installation:"
echo "   cd strategy && node test_strategy.js"
echo ""
echo "4. Integrieren Sie die Strategie in Zenbot (siehe docs/INSTALLATION_GUIDE.md)"
echo ""
echo "Für detaillierte Anweisungen lesen Sie docs/INSTALLATION_GUIDE.md"
echo ""
echo "🎉 Installation erfolgreich abgeschlossen!"

