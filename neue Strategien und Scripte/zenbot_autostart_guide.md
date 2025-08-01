# Zenbot nach dem Systemstart automatisch starten

Diese Anleitung beschreibt, wie Sie Zenbot so konfigurieren, dass es nach einem Neustart des Systems auf verschiedenen Betriebssystemen automatisch gestartet wird.

---

### **Für Linux (mit `systemd`)**

Die gebräuchlichste Methode auf modernen Linux-Systemen ist die Erstellung eines `systemd`-Dienstes. Dies stellt sicher, dass Zenbot als Hintergrunddienst gestartet wird.

**1. Erstellen Sie eine Service-Datei:**

Öffnen Sie eine neue Datei mit einem Texteditor und Root-Rechten:
```bash
sudo nano /etc/systemd/system/zenbot.service
```

**2. Fügen Sie den folgenden Inhalt in die Datei ein:**

Passen Sie die Pfade `WorkingDirectory` und `ExecStart` an Ihre Zenbot-Installation an. Ersetzen Sie `BENUTZERNAME` und `BENUTZERGRUPPE` durch den Benutzernamen und die Gruppe, unter dem der Bot laufen soll.

```ini
[Unit]
Description=Zenbot
After=network.target

[Service]
ExecStart=/pfad/zu/ihrem/zenbot/zenbot.sh launch map --backfill-and-run-trades
WorkingDirectory=/pfad/zu/ihrem/zenbot
Restart=always
RestartSec=10
User=BENUTZERNAME
Group=BENUTZERGRUPPE

[Install]
WantedBy=multi-user.target
```

**3. `systemd` neu laden, den Dienst aktivieren und starten:**

*   Laden Sie die Konfiguration neu:
    ```bash
    sudo systemctl daemon-reload
    ```
*   Aktivieren Sie den Autostart:
    ```bash
    sudo systemctl enable zenbot.service
    ```
*   Starten Sie den Dienst sofort:
    ```bash
    sudo systemctl start zenbot.service
    ```

**4. Überprüfen Sie den Status:**

Sie können jederzeit überprüfen, ob der Dienst korrekt läuft mit:
```bash
sudo systemctl status zenbot.service
```

---

### **Für macOS (mit `launchd`)**

Auf macOS können Sie `launchd` verwenden, um Zenbot automatisch zu starten.

**1. Erstellen Sie eine `.plist`-Datei:**

Erstellen Sie eine Datei namens `com.zenbot.app.plist` im Verzeichnis `~/Library/LaunchAgents/`.

**2. Fügen Sie den folgenden Inhalt ein:**

Passen Sie den Pfad im `ProgramArguments`-Array an Ihre Zenbot-Installation an.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.zenbot.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/pfad/zu/ihrem/zenbot/zenbot.sh</string>
        <string>launch</string>
        <string>map</string>
        <string>--backfill-and-run-trades</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/zenbot.out</string>
    <key>StandardErrorPath</string>
    <string>/tmp/zenbot.err</string>
</dict>
</plist>
```

**3. Laden Sie den Dienst:**

Öffnen Sie ein Terminal und führen Sie folgenden Befehl aus:
```bash
launchctl load ~/Library/LaunchAgents/com.zenbot.app.plist
```

Nach dem nächsten Neustart sollte Zenbot automatisch gestartet werden. Sie können die Log-Dateien unter `/tmp/zenbot.out` und `/tmp/zenbot.err` auf Fehler überprüfen.

---

### **Für Windows (mit dem Aufgabenplaner)**

Unter Windows können Sie den Aufgabenplaner (Task Scheduler) verwenden, um Zenbot beim Systemstart auszuführen.

**1. Öffnen Sie den Aufgabenplaner:**

Suchen Sie im Startmenü nach "Aufgabenplaner" und öffnen Sie ihn.

**2. Erstellen Sie eine neue Aufgabe:**

1.  Klicken Sie im rechten Bereich auf **"Einfache Aufgabe erstellen..."**.
2.  Geben Sie einen Namen für die Aufgabe ein (z. B. "Zenbot Autostart") und klicken Sie auf "Weiter".
3.  Wählen Sie als Trigger **"Beim Start des Computers"** und klicken Sie auf "Weiter".
4.  Wählen Sie als Aktion **"Programm starten"** und klicken Sie auf "Weiter".
5.  Klicken Sie auf **"Durchsuchen..."** und wählen Sie die `zenbot.bat`-Datei in Ihrem Zenbot-Verzeichnis aus.
6.  Klicken Sie auf **"Fertig stellen"**.

**3. Konfigurieren Sie die Aufgabe für den Hintergrundbetrieb:**

1.  Klicken Sie mit der rechten Maustaste auf die neu erstellte Aufgabe und wählen Sie **"Eigenschaften"**.
2.  Wählen Sie auf der Registerkarte **"Allgemein"** die Option **"Unabhängig von der Benutzeranmeldung ausführen"**.
3.  Wechseln Sie zur Registerkarte **"Bedingungen"** und stellen Sie sicher, dass keine Bedingungen den Start verhindern (z.B. "Aufgabe nur starten, falls Computer im Netzbetrieb ausgeführt wird").
4.  Klicken Sie auf **"OK"**.

Damit sollte Zenbot bei jedem Systemstart automatisch im Hintergrund gestartet werden.

