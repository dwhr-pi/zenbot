#!/bin/bash

# Installationsscript für die Zenbot Copy-Trading Strategie
# Dieses Script kopiert die Strategie-Dateien in die richtige Zenbot-Verzeichnisstruktur

# Pfad zu Ihrer Zenbot-Installation
ZENBOT_PATH=""

# Frage nach dem Zenbot-Pfad, falls nicht angegeben
if [ -z "$ZENBOT_PATH" ]; then
  read -p "Bitte geben Sie den Pfad zu Ihrer Zenbot-Installation ein: " ZENBOT_PATH
fi

# Überprüfe, ob der Pfad existiert
if [ ! -d "$ZENBOT_PATH" ]; then
  echo "Fehler: Der angegebene Pfad existiert nicht."
  exit 1
fi

# Überprüfe, ob es sich um eine Zenbot-Installation handelt
if [ ! -f "$ZENBOT_PATH/zenbot.sh" ]; then
  echo "Warnung: Es wurde keine zenbot.sh im angegebenen Pfad gefunden. Sind Sie sicher, dass dies eine Zenbot-Installation ist?"
  read -p "Trotzdem fortfahren? (j/n): " CONTINUE
  if [ "$CONTINUE" != "j" ]; then
    echo "Installation abgebrochen."
    exit 1
  fi
fi

# Erstelle das Strategie-Verzeichnis, falls es nicht existiert
STRATEGY_DIR="$ZENBOT_PATH/extensions/strategies/copy_trading"
mkdir -p "$STRATEGY_DIR"

# Kopiere die Strategie-Dateien
cp -v strategy.js "$STRATEGY_DIR/"

# Kopiere die Beispiel-Signaldatei
cp -v signals.json "$ZENBOT_PATH/"

# Zeige Erfolgsbenachrichtigung
echo ""
echo "Installation abgeschlossen!"
echo ""
echo "Die Copy-Trading Strategie wurde erfolgreich installiert."
echo "Sie können die Strategie mit folgendem Befehl verwenden:"
echo ""
echo "  ./zenbot.sh trade --strategy=copy_trading"
echo ""
echo "Weitere Informationen und Konfigurationsoptionen finden Sie in der README.md"
echo ""

exit 0
