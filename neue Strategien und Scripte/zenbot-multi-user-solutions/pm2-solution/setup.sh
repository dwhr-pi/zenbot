#!/bin/bash

# PM2 Zenbot Multi-User Setup Script
# Dieses Skript richtet die PM2-basierte Multi-User-Lösung für Zenbot ein

# Farben für die Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}PM2 Zenbot Multi-User Setup${NC}"
echo -e "${BLUE}===========================${NC}"

# Überprüfen, ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo -e "${RED}Fehler: Node.js ist nicht installiert!${NC}"
    echo -e "${YELLOW}Installieren Sie Node.js von: https://nodejs.org/${NC}"
    exit 1
fi

# Überprüfen, ob npm installiert ist
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Fehler: npm ist nicht installiert!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js und npm sind installiert${NC}"

# PM2 global installieren
echo -e "${BLUE}Installiere PM2 global...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PM2 erfolgreich installiert${NC}"
    else
        echo -e "${RED}✗ Fehler beim Installieren von PM2${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ PM2 ist bereits installiert${NC}"
fi

# Verzeichnisse erstellen
echo -e "${BLUE}Erstelle notwendige Verzeichnisse...${NC}"
mkdir -p logs
mkdir -p configs
echo -e "${GREEN}✓ Verzeichnisse erstellt${NC}"

# Zenbot-Pfad abfragen
echo -e "${YELLOW}Bitte geben Sie den absoluten Pfad zu Ihrer Zenbot-Installation ein:${NC}"
read -p "Zenbot-Pfad: " ZENBOT_PATH

if [ ! -d "$ZENBOT_PATH" ]; then
    echo -e "${RED}Fehler: Verzeichnis '$ZENBOT_PATH' existiert nicht!${NC}"
    exit 1
fi

if [ ! -f "$ZENBOT_PATH/zenbot.js" ]; then
    echo -e "${RED}Fehler: zenbot.js nicht in '$ZENBOT_PATH' gefunden!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Zenbot-Installation gefunden: $ZENBOT_PATH${NC}"

# ecosystem.config.js aktualisieren
echo -e "${BLUE}Aktualisiere ecosystem.config.js mit dem Zenbot-Pfad...${NC}"
sed -i "s|/path/to/zenbot|$ZENBOT_PATH|g" ecosystem.config.js
echo -e "${GREEN}✓ ecosystem.config.js aktualisiert${NC}"

# Konfigurationsdateien kopieren
echo -e "${BLUE}Kopiere Konfigurationsdateien...${NC}"
if [ -f "$ZENBOT_PATH/conf.js" ]; then
    cp "$ZENBOT_PATH/conf.js" configs/conf_template.js
    echo -e "${GREEN}✓ Template-Konfiguration kopiert${NC}"
    echo -e "${YELLOW}Bitte bearbeiten Sie configs/conf_user_a.js und configs/conf_user_b.js${NC}"
    echo -e "${YELLOW}mit Ihren spezifischen Einstellungen für jeden Benutzer.${NC}"
else
    echo -e "${YELLOW}Warnung: Keine conf.js in Zenbot gefunden. Verwenden Sie die Beispielkonfigurationen.${NC}"
fi

# PM2 Startup-Skript einrichten
echo -e "${BLUE}Richte PM2 Startup-Skript ein...${NC}"
echo -e "${YELLOW}Das folgende Kommando muss möglicherweise mit sudo ausgeführt werden:${NC}"
pm2 startup
echo -e "${YELLOW}Führen Sie das angezeigte Kommando aus, um PM2 beim Systemstart zu aktivieren.${NC}"

echo -e "\n${GREEN}Setup abgeschlossen!${NC}"
echo -e "\n${BLUE}Nächste Schritte:${NC}"
echo -e "1. Bearbeiten Sie configs/conf_user_a.js und configs/conf_user_b.js"
echo -e "2. Starten Sie die Bots mit: ${YELLOW}pm2 start ecosystem.config.js${NC}"
echo -e "3. Überprüfen Sie den Status mit: ${YELLOW}pm2 status${NC}"
echo -e "4. Sehen Sie sich die Logs an mit: ${YELLOW}pm2 logs${NC}"
echo -e "5. Speichern Sie die PM2-Konfiguration mit: ${YELLOW}pm2 save${NC}"

