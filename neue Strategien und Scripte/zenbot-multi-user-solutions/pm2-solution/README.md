# PM2-Lösung für Zenbot Multi-User

Diese Lösung nutzt PM2 (Process Manager 2) zur Verwaltung mehrerer Zenbot-Instanzen. PM2 ist ein Produktions-Prozessmanager für Node.js-Anwendungen mit integriertem Lastenausgleich, Überwachung und automatischem Neustart. Es ist eine robustere Alternative zu `screen` für den produktiven Einsatz.

## Vorteile

*   **Prozessmanagement:** PM2 überwacht die Zenbot-Prozesse und startet sie bei Absturz oder unerwarteter Beendigung automatisch neu.
*   **Einfache Verwaltung:** Zentralisierte Befehle zum Starten, Stoppen, Neustarten und Überwachen aller Instanzen.
*   **Logging:** PM2 bietet integriertes Logging und Log-Rotation.
*   **Systemstart:** PM2 kann so konfiguriert werden, dass die Zenbot-Instanzen automatisch beim Systemstart gestartet werden.
*   **Ressourcen:** Bietet detaillierte Metriken zur CPU- und Speichernutzung.

## Nachteile

*   **Komplexität:** Etwas komplexer in der Einrichtung als `screen`.
*   **Ressourcenverbrauch:** Jede Zenbot-Instanz ist ein vollständiger Node.js-Prozess.
*   **Keine echte Isolation:** Ähnlich wie bei `screen` laufen die Prozesse im selben Betriebssystemkontext.

## Voraussetzungen

*   Eine installierte Zenbot-Instanz auf Ihrem System.
*   Node.js und npm müssen installiert sein.
*   PM2 muss global installiert sein (`npm install -g pm2`).

## Struktur des Verzeichnisses

```
pm2-solution/
├── configs/
│   ├── conf_user_a.js  # Konfigurationsdatei für Benutzer A
│   └── conf_user_b.js  # Konfigurationsdatei für Benutzer B
├── logs/               # Verzeichnis für PM2-Logdateien
├── ecosystem.config.js # PM2-Konfigurationsdatei
├── package.json        # Enthält Skripte für die PM2-Verwaltung
└── setup.sh            # Skript zur einfachen Einrichtung
```

## Konfiguration

1.  **Zenbot-Installation:** Stellen Sie sicher, dass Sie eine funktionierende Zenbot-Installation haben. Das `ecosystem.config.js` und `setup.sh` Skript müssen den absoluten Pfad zu Ihrer Zenbot-Installation kennen.

2.  **Konfigurationsdateien (`configs/conf_user_a.js`, `configs/conf_user_b.js`):**
    *   Kopieren Sie Ihre Zenbot `conf.js` Vorlage in diese Dateien.
    *   Passen Sie die Einstellungen für jeden Benutzer individuell an, insbesondere die API-Schlüssel, Strategien, Selektoren (Börse, Asset, Währung) und Paper-Trading-Einstellungen.
    *   **Wichtig:** Jede Zenbot-Instanz, die eine Web UI startet, muss einen **einzigartigen Port** verwenden. Dies wird in den Beispielkonfigurationen (`conf_user_a.js`, `conf_user_b.js`) bereits berücksichtigt (Port 8081 und 8082).

    Beispiel für `conf_user_a.js`:
    ```javascript
    module.exports = {
      selector: 'binance.BTC-USDT',
      // ... andere Einstellungen
      web: {
        port: 8081, // Einzigartiger Port für Benutzer A
      },
      // ...
    };
    ```

3.  **`ecosystem.config.js`:**
    *   Dies ist die Hauptkonfigurationsdatei für PM2.
    *   Sie definiert die einzelnen Zenbot-Anwendungen (`apps`), die PM2 verwalten soll.
    *   **WICHTIG:** Sie müssen den `cwd` (current working directory) Pfad in dieser Datei an den absoluten Pfad Ihrer Zenbot-Installation anpassen.

    ```javascript
    module.exports = {
      apps: [
        {
          name: 'zenbot-user-a',
          script: './zenbot.js',
          cwd: '/path/to/zenbot', // <--- HIER ANPASSEN
          args: 'trade --paper --conf=./configs/conf_user_a.js',
          // ...
        },
        // ...
      ]
    };
    ```
    *   Die `args` (Argumente) weisen Zenbot an, welche Konfigurationsdatei verwendet werden soll.
    *   `log_file`, `out_file`, `error_file` definieren, wo PM2 die Logs für jede Instanz speichert.

4.  **`package.json`:**
    *   Enthält nützliche npm-Skripte, um PM2-Befehle einfacher auszuführen.

5.  **`setup.sh`:**
    *   Ein Hilfsskript, das Sie durch die Einrichtung führt, PM2 global installiert (falls nicht vorhanden) und den `cwd`-Pfad in `ecosystem.config.js` aktualisiert.

## Nutzung

1.  **Navigieren Sie in das Verzeichnis:**
    ```bash
    cd zenbot-multi-user-solutions/pm2-solution
    ```

2.  **Führen Sie das Setup-Skript aus:**
    ```bash
    ./setup.sh
    ```
    *   Folgen Sie den Anweisungen des Skripts, um den Pfad zu Ihrer Zenbot-Installation anzugeben.
    *   Das Skript wird Sie auch anweisen, `pm2 startup` auszuführen, um PM2 für den automatischen Start beim Systemboot zu konfigurieren.

3.  **Starten Sie die Zenbot-Instanzen:**
    ```bash
    pm2 start ecosystem.config.js
    # Oder über npm-Skript: npm start
    ```

4.  **Überprüfen Sie den Status der Instanzen:**
    ```bash
    pm2 status
    # Oder über npm-Skript: npm run status
    ```

5.  **Sehen Sie sich die Logs an:**
    ```bash
    pm2 logs
    # Oder für eine spezifische Instanz: pm2 logs zenbot-user-a
    # Oder über npm-Skript: npm run logs
    ```

6.  **Stoppen Sie die Zenbot-Instanzen:**
    ```bash
    pm2 stop ecosystem.config.js
    # Oder für eine spezifische Instanz: pm2 stop zenbot-user-a
    # Oder über npm-Skript: npm run stop
    ```

7.  **Löschen Sie die Instanzen aus PM2:**
    ```bash
    pm2 delete ecosystem.config.js
    # Oder über npm-Skript: npm run delete
    ```

8.  **Speichern Sie den aktuellen PM2-Status (für automatischen Neustart nach Reboot):**
    ```bash
    pm2 save
    # Oder über npm-Skript: npm run save-pm2
    ```

## Wichtige Hinweise

*   **API-Schlüssel:** Ersetzen Sie die Platzhalter in den Konfigurationsdateien durch Ihre echten API-Schlüssel. Achten Sie auf die Sicherheit Ihrer Schlüssel.
*   **Paper Trading:** Die Beispiele sind für Paper Trading konfiguriert (`--paper`). Entfernen Sie dies, um mit echtem Geld zu handeln, aber seien Sie sich der Risiken bewusst.
*   **Log-Dateien:** PM2 speichert die Logs im `logs/` Verzeichnis innerhalb des `pm2-solution` Ordners, wie in `ecosystem.config.js` konfiguriert.
*   **Ressourcen:** Überwachen Sie die Ressourcennutzung mit `pm2 monit`.

Diese PM2-basierte Lösung bietet eine professionelle und zuverlässige Methode, um mehrere Zenbot-Instanzen im Hintergrund zu betreiben und zu verwalten.

