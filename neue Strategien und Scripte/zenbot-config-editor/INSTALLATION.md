# Installationsanleitung - Zenbot Konfigurations-Editor

Diese Anleitung führt Sie Schritt für Schritt durch die Installation und Einrichtung des Zenbot Konfigurations-Editors.

## Systemanforderungen

### Mindestanforderungen
- **Betriebssystem**: Windows 10, macOS 10.14, Ubuntu 18.04 oder neuer
- **Python**: Version 3.7 oder höher
- **RAM**: Mindestens 512 MB verfügbar
- **Festplatte**: 100 MB freier Speicherplatz
- **Netzwerk**: Internetverbindung für die Installation der Abhängigkeiten

### Empfohlene Anforderungen
- **Python**: Version 3.9 oder höher
- **RAM**: 1 GB oder mehr
- **Browser**: Chrome, Firefox, Safari oder Edge (neueste Versionen)

## Schritt 1: Python-Installation überprüfen

Überprüfen Sie zunächst, ob Python auf Ihrem System installiert ist:

### Windows
```cmd
python --version
```
oder
```cmd
python3 --version
```

### macOS/Linux
```bash
python3 --version
```

Falls Python nicht installiert ist, laden Sie es von [python.org](https://www.python.org/downloads/) herunter.

## Schritt 2: Projekt herunterladen

1. **ZIP-Datei entpacken**
   - Entpacken Sie die heruntergeladene `zenbot-config-editor.zip` Datei
   - Navigieren Sie in das entpackte Verzeichnis

2. **Terminal/Eingabeaufforderung öffnen**
   - **Windows**: Drücken Sie `Win + R`, geben Sie `cmd` ein und drücken Sie Enter
   - **macOS**: Drücken Sie `Cmd + Space`, geben Sie `Terminal` ein und drücken Sie Enter
   - **Linux**: Drücken Sie `Ctrl + Alt + T`

3. **Zum Projektverzeichnis navigieren**
   ```bash
   cd pfad/zum/zenbot-config-editor
   ```

## Schritt 3: Virtuelle Umgebung erstellen (Empfohlen)

Eine virtuelle Umgebung isoliert die Projektabhängigkeiten von anderen Python-Projekten:

### Windows
```cmd
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

Sie sollten nun `(venv)` am Anfang Ihrer Eingabeaufforderung sehen.

## Schritt 4: Abhängigkeiten installieren

Installieren Sie die erforderlichen Python-Pakete:

```bash
pip install -r requirements.txt
```

### Bei Problemen mit der Installation

Falls Sie Fehlermeldungen erhalten, versuchen Sie:

```bash
# Pip aktualisieren
pip install --upgrade pip

# Abhängigkeiten einzeln installieren
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install Werkzeug==2.3.7
```

## Schritt 5: Anwendung starten

Starten Sie den Zenbot Konfigurations-Editor:

```bash
python app.py
```

Sie sollten eine Ausgabe ähnlich dieser sehen:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

## Schritt 6: Browser öffnen

1. Öffnen Sie Ihren Webbrowser
2. Navigieren Sie zu: `http://localhost:5000` oder `http://127.0.0.1:5000`
3. Sie sollten nun die Zenbot Konfigurations-Editor Oberfläche sehen

## Schritt 7: Erste Konfiguration

1. **Automatische Beispieldatei**: Beim ersten Start wird automatisch eine `conf.js` Beispieldatei erstellt
2. **Parameter bearbeiten**: Klicken Sie auf die verschiedenen Eingabefelder, um die Hilfe anzuzeigen
3. **Speichern**: Klicken Sie auf "Konfiguration Speichern", um Ihre Änderungen zu übernehmen

## Erweiterte Installation

### Docker-Installation

Falls Sie Docker bevorzugen:

1. **Dockerfile erstellen** (bereits im Projekt enthalten)
2. **Image erstellen**:
   ```bash
   docker build -t zenbot-config-editor .
   ```
3. **Container starten**:
   ```bash
   docker run -p 5000:5000 -v $(pwd)/conf.js:/app/conf.js zenbot-config-editor
   ```

### Systemweite Installation

Für eine systemweite Installation ohne virtuelle Umgebung:

```bash
# Abhängigkeiten systemweit installieren
sudo pip3 install -r requirements.txt

# Anwendung als Service einrichten (Linux)
sudo cp zenbot-config-editor.service /etc/systemd/system/
sudo systemctl enable zenbot-config-editor
sudo systemctl start zenbot-config-editor
```

### Reverse Proxy Setup (Nginx)

Für den Produktionseinsatz mit Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Fehlerbehebung

### Problem: "Python nicht gefunden"
**Lösung**: 
- Stellen Sie sicher, dass Python korrekt installiert ist
- Fügen Sie Python zum PATH hinzu
- Verwenden Sie `python3` statt `python` auf macOS/Linux

### Problem: "pip nicht gefunden"
**Lösung**:
```bash
# Python mit pip neu installieren
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

### Problem: "Port 5000 bereits in Verwendung"
**Lösung**:
```bash
# Anderen Port verwenden
python app.py --port 5001

# Oder den Port freigeben
lsof -ti:5000 | xargs kill -9
```

### Problem: "Berechtigung verweigert"
**Lösung**:
```bash
# Dateiberechtigungen setzen
chmod +x app.py
chmod 644 conf.js

# Oder mit sudo ausführen (nicht empfohlen)
sudo python app.py
```

### Problem: "Modul nicht gefunden"
**Lösung**:
```bash
# Virtuelle Umgebung aktivieren
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Abhängigkeiten neu installieren
pip install -r requirements.txt
```

## Deinstallation

Um den Zenbot Konfigurations-Editor zu entfernen:

1. **Virtuelle Umgebung deaktivieren**:
   ```bash
   deactivate
   ```

2. **Projektverzeichnis löschen**:
   ```bash
   rm -rf zenbot-config-editor
   ```

3. **Systemweite Pakete entfernen** (falls installiert):
   ```bash
   pip uninstall Flask Flask-CORS Werkzeug
   ```

## Automatische Updates

Für automatische Updates können Sie ein Skript erstellen:

```bash
#!/bin/bash
# update.sh

cd /path/to/zenbot-config-editor
git pull origin main
pip install -r requirements.txt
sudo systemctl restart zenbot-config-editor
```

## Support

Bei Problemen:

1. **Logs überprüfen**: Aktivieren Sie den Debug-Modus mit `FLASK_DEBUG=True`
2. **GitHub Issues**: Erstellen Sie ein Issue auf der Projekt-Seite
3. **Community**: Besuchen Sie das Zenbot-Forum für allgemeine Fragen

---

**Viel Erfolg mit Ihrem Zenbot Konfigurations-Editor!**

*Diese Anleitung wurde von Manus AI erstellt und wird regelmäßig aktualisiert.*

