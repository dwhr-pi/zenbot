#!/bin/bash

# Zenbot Multi-User Screen Solution Startup Script
# Dieses Skript startet mehrere Zenbot-Instanzen in separaten Screen-Sessions

# Konfiguration
ZENBOT_PATH="/path/to/zenbot"  # Passen Sie diesen Pfad an Ihre Zenbot-Installation an
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$SCRIPT_DIR/configs"

# Farben für die Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Zenbot Multi-User Screen Solution${NC}"
echo -e "${BLUE}===================================${NC}"

# Überprüfen, ob Zenbot-Pfad existiert
if [ ! -d "$ZENBOT_PATH" ]; then
    echo -e "${RED}Fehler: Zenbot-Pfad '$ZENBOT_PATH' nicht gefunden!${NC}"
    echo -e "${YELLOW}Bitte passen Sie die Variable ZENBOT_PATH in diesem Skript an.${NC}"
    exit 1
fi

# Überprüfen, ob Screen installiert ist
if ! command -v screen &> /dev/null; then
    echo -e "${RED}Fehler: Screen ist nicht installiert!${NC}"
    echo -e "${YELLOW}Installieren Sie Screen mit: sudo apt-get install screen${NC}"
    exit 1
fi

# Funktion zum Starten einer Zenbot-Instanz
start_zenbot_instance() {
    local user_name=$1
    local config_file=$2
    local session_name="zenbot_$user_name"
    
    echo -e "${BLUE}Starte Zenbot für $user_name...${NC}"
    
    # Überprüfen, ob die Konfigurationsdatei existiert
    if [ ! -f "$config_file" ]; then
        echo -e "${RED}Fehler: Konfigurationsdatei '$config_file' nicht gefunden!${NC}"
        return 1
    fi
    
    # Überprüfen, ob bereits eine Session mit diesem Namen läuft
    if screen -list | grep -q "$session_name"; then
        echo -e "${YELLOW}Warnung: Session '$session_name' läuft bereits!${NC}"
        echo -e "${YELLOW}Verwenden Sie 'screen -r $session_name' um sich zu verbinden.${NC}"
        return 1
    fi
    
    # Screen-Session starten
    screen -dmS "$session_name" bash -c "
        cd '$ZENBOT_PATH'
        echo 'Starte Zenbot für $user_name mit Konfiguration: $config_file'
        echo 'Drücken Sie Ctrl+A, dann D um die Session zu verlassen (detach)'
        echo 'Verwenden Sie \"screen -r $session_name\" um zurückzukehren'
        echo '=================================================='
        ./zenbot.sh trade --paper --conf='$config_file'
        echo 'Zenbot für $user_name wurde beendet. Drücken Sie Enter um die Session zu schließen.'
        read
    "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Zenbot für $user_name erfolgreich gestartet (Session: $session_name)${NC}"
    else
        echo -e "${RED}✗ Fehler beim Starten von Zenbot für $user_name${NC}"
    fi
}

# Funktion zum Anzeigen des Status
show_status() {
    echo -e "\n${BLUE}Aktuelle Screen-Sessions:${NC}"
    screen -list | grep zenbot || echo -e "${YELLOW}Keine Zenbot-Sessions gefunden.${NC}"
}

# Funktion zum Stoppen aller Zenbot-Sessions
stop_all_bots() {
    echo -e "\n${YELLOW}Stoppe alle Zenbot-Sessions...${NC}"
    for session in $(screen -list | grep zenbot | awk '{print $1}'); do
        echo -e "${BLUE}Stoppe Session: $session${NC}"
        screen -S "$session" -X quit
    done
    echo -e "${GREEN}Alle Zenbot-Sessions wurden gestoppt.${NC}"
}

# Hauptmenü
case "$1" in
    start)
        echo -e "${BLUE}Starte alle Zenbot-Instanzen...${NC}"
        start_zenbot_instance "user_a" "$CONFIG_DIR/conf_user_a.js"
        start_zenbot_instance "user_b" "$CONFIG_DIR/conf_user_b.js"
        show_status
        echo -e "\n${GREEN}Alle Instanzen gestartet!${NC}"
        echo -e "${YELLOW}Verwenden Sie 'screen -r zenbot_user_a' oder 'screen -r zenbot_user_b' um sich zu verbinden.${NC}"
        ;;
    stop)
        stop_all_bots
        ;;
    status)
        show_status
        ;;
    connect)
        if [ -z "$2" ]; then
            echo -e "${RED}Fehler: Benutzername erforderlich!${NC}"
            echo -e "${YELLOW}Verwendung: $0 connect <user_a|user_b>${NC}"
            exit 1
        fi
        session_name="zenbot_$2"
        if screen -list | grep -q "$session_name"; then
            echo -e "${BLUE}Verbinde mit Session: $session_name${NC}"
            screen -r "$session_name"
        else
            echo -e "${RED}Session '$session_name' nicht gefunden!${NC}"
            show_status
        fi
        ;;
    *)
        echo -e "${YELLOW}Verwendung: $0 {start|stop|status|connect <user>}${NC}"
        echo ""
        echo -e "${BLUE}Befehle:${NC}"
        echo -e "  start    - Startet alle Zenbot-Instanzen"
        echo -e "  stop     - Stoppt alle Zenbot-Instanzen"
        echo -e "  status   - Zeigt den Status aller Sessions"
        echo -e "  connect  - Verbindet mit einer spezifischen Session"
        echo ""
        echo -e "${BLUE}Beispiele:${NC}"
        echo -e "  $0 start"
        echo -e "  $0 connect user_a"
        echo -e "  $0 status"
        echo -e "  $0 stop"
        exit 1
        ;;
esac

