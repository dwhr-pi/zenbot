#!/bin/bash

# Testskript für Zenbot Multi-Trading

echo "Starte Tests für Zenbot Multi-Trading..."

# Verzeichnisse erstellen, falls sie nicht existieren
mkdir -p config logs

# Integrationstest ausführen
echo "Führe Integrationstest aus..."
node src/integration_test.js

# Ergebnis prüfen
if [ $? -eq 0 ]; then
  echo "Integrationstest erfolgreich abgeschlossen."
else
  echo "Integrationstest fehlgeschlagen."
  exit 1
fi

# CLI-Test ausführen
echo "Führe CLI-Test aus..."

# Starte den Multi-Trading-Manager
echo "Starte Multi-Trading-Manager..."
node multi_trading.js start --log-level debug &
MANAGER_PID=$!

# Warte, bis der Manager gestartet ist
sleep 5

# Füge eine Test-Instanz hinzu
echo "Füge Test-Instanz hinzu..."
node multi_trading.js add binance BTC macd_cross --api-key test_key --api-secret test_secret --strategy-params '{"fastPeriod":12,"slowPeriod":26,"signalPeriod":9}'

# Zeige Statistiken an
echo "Zeige Statistiken an..."
node multi_trading.js stats

# Warte kurz
sleep 2

# Entferne die Test-Instanz
echo "Entferne Test-Instanz..."
node multi_trading.js remove binance_BTC_macd_cross

# Stoppe den Multi-Trading-Manager
echo "Stoppe Multi-Trading-Manager..."
node multi_trading.js stop

# Warte, bis der Manager gestoppt ist
sleep 2

# Prüfe, ob der Prozess noch läuft
if ps -p $MANAGER_PID > /dev/null; then
  echo "Fehler: Multi-Trading-Manager konnte nicht gestoppt werden."
  kill $MANAGER_PID
  exit 1
else
  echo "Multi-Trading-Manager erfolgreich gestoppt."
fi

echo "Alle Tests erfolgreich abgeschlossen."
