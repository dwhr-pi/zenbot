#!/bin/bash

# Installationsskript für Zenbot Multi-Trading

echo "Installiere Zenbot Multi-Trading..."

# Verzeichnisse erstellen
mkdir -p config logs

# Abhängigkeiten installieren
echo "Installiere Abhängigkeiten..."
npm install commander ccxt moment crypto mongodb

echo "Installation abgeschlossen."
echo "Starten Sie Zenbot Multi-Trading mit: node multi_trading.js"
