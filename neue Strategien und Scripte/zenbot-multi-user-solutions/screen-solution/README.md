# Screen-Lösung für Zenbot Multi-User

Diese Lösung verwendet das `screen`-Dienstprogramm, um mehrere Zenbot-Instanzen in separaten, persistenten Terminal-Sitzungen im Hintergrund auszuführen. Dies ist nützlich, wenn Sie sich von Ihrem Server abmelden möchten, aber die Bots weiterlaufen sollen.

## Vorteile

*   **Einfachheit:** Relativ einfach einzurichten und zu verstehen, besonders für Benutzer, die mit der Kommandozeile vertraut sind.
*   **Persistenz:** Zenbot-Instanzen laufen weiter, auch wenn die SSH-Verbindung zum Server getrennt wird.
*   **Ressourceneffizienz:** Jede Instanz ist ein separater Prozess, aber `screen` selbst ist sehr leichtgewichtig.
*   **Flexibilität:** Jede Instanz kann eine eigene Konfiguration, Strategie und API-Schlüssel verwenden.

## Nachteile

*   **Ressourcenverbrauch:** Jede Zenbot-Instanz ist ein vollständiger Node.js-Prozess, der RAM und CPU verbraucht. Bei sehr vielen Instanzen kann dies ins Gewicht fallen.
*   **Verwaltung:** Die Verwaltung vieler `screen`-Sessions kann unübersichtlich werden.
*   **Keine echte Isolation:** Die Prozesse laufen im selben Betriebssystemkontext und teilen sich Systemressourcen, was zu Konflikten führen kann, wenn Zenbot-Instanzen auf dieselben Ports oder Dateien zugreifen wollen (z.B. die Web-UI).

## Voraussetzungen

*   Eine installierte Zenbot-Instanz auf Ihrem System.
*   Das `screen`-Dienstprogramm muss installiert sein. Auf Debian/Ubuntu-Systemen können Sie es mit `sudo apt-get install screen` installieren.

## Struktur des Verzeichnisses

```
screen-solution/
├── configs/
│   ├── conf_user_a.js  # Konfigurationsdatei für Benutzer A
│   └── conf_user_b.js  # Konfigurationsdatei für Benutzer B
└── start_bots.sh       # Skript zum Starten und Verwalten der Zenbot-Instanzen
```

## Konfiguration

1.  **Zenbot-Installation:** Stellen Sie sicher, dass Sie eine funktionierende Zenbot-Installation haben. Dieses Skript geht davon aus, dass sich das Zenbot-Verzeichnis an einem bekannten Ort befindet.

2.  **Konfigurationsdateien (`configs/conf_user_a.js`, `configs/conf_user_b.js`):**
    *   Kopieren Sie Ihre Zenbot `conf.js` Vorlage in diese Dateien.
    *   Passen Sie die Einstellungen für jeden Benutzer individuell an, insbesondere die API-Schlüssel, Strategien, Selektoren (Börse, Asset, Währung) und Paper-Trading-Einstellungen.
    *   **Wichtig:** Wenn Sie die Zenbot Web UI verwenden möchten, stellen Sie sicher, dass jede Instanz einen **einzigartigen Port** verwendet. Dies kann in der `conf.js` unter `web.port` eingestellt werden. Standardmäßig verwendet Zenbot Port 8080. Wenn Sie mehrere Instanzen starten, ohne die Ports zu ändern, wird nur die erste Instanz die Web UI starten können.

    Beispiel für `conf_user_a.js` (mit geändertem Web-Port):
    ```javascript
    module.exports = {
      selector: 'binance.BTC-USDT',
      // ... andere Einstellungen
      web: {
        port: 8081, // Einzigartiger Port für Benutzer A
        // ...
      },
      // ...
    };
    ```

3.  **`start_bots.sh`:**
    *   Öffnen Sie diese Datei in einem Texteditor.
    *   **Passen Sie die Variable `ZENBOT_PATH` an:** Ersetzen Sie `/path/to/zenbot` durch den tatsächlichen absoluten Pfad zu Ihrem Zenbot-Installationsverzeichnis.

    ```bash
    # Konfiguration
    ZENBOT_PATH="/home/ubuntu/zenbot"  # <--- HIER ANPASSEN
    ```
    *   Das Skript ist so konfiguriert, dass es `conf_user_a.js` und `conf_user_b.js` startet. Sie können weitere `start_zenbot_instance` Aufrufe hinzufügen, um mehr Benutzer zu unterstützen.

## Nutzung

1.  **Navigieren Sie in das Verzeichnis:**
    ```bash
    cd zenbot-multi-user-solutions/screen-solution
    ```

2.  **Machen Sie das Skript ausführbar:**
    ```bash
    chmod +x start_bots.sh
    ```

3.  **Starten Sie die Zenbot-Instanzen:**
    ```bash
    ./start_bots.sh start
    ```
    Dies startet Zenbot für `user_a` und `user_b` in separaten `screen`-Sessions (`zenbot_user_a` und `zenbot_user_b`).

4.  **Überprüfen Sie den Status der Sessions:**
    ```bash
    ./start_bots.sh status
    # Oder direkt: screen -list
    ```

5.  **Verbinden Sie sich mit einer Zenbot-Session:**
    Um die Ausgabe eines Bots zu sehen oder mit ihm zu interagieren:
    ```bash
    ./start_bots.sh connect user_a
    # Oder direkt: screen -r zenbot_user_a
    ```
    *   Um die Session zu verlassen (detach), ohne den Bot zu stoppen: Drücken Sie `Ctrl+A`, dann `D`.

6.  **Stoppen Sie alle Zenbot-Instanzen:**
    ```bash
    ./start_bots.sh stop
    ```
    Dies beendet alle `screen`-Sessions, die mit `zenbot_` beginnen.

## Wichtige Hinweise

*   **API-Schlüssel:** Ersetzen Sie die Platzhalter in den Konfigurationsdateien durch Ihre echten API-Schlüssel. Achten Sie auf die Sicherheit Ihrer Schlüssel.
*   **Paper Trading:** Die Beispiele sind für Paper Trading konfiguriert (`--paper`). Entfernen Sie dies, um mit echtem Geld zu handeln, aber seien Sie sich der Risiken bewusst.
*   **Log-Dateien:** Zenbot schreibt seine Logs standardmäßig in das `logs/` Verzeichnis innerhalb seiner Installation. Jede Instanz wird ihre eigenen Logs dort ablegen.
*   **Fehlerbehebung:** Wenn ein Bot nicht startet, überprüfen Sie die Logs in der `screen`-Session oder die Zenbot-Logdateien für Fehlermeldungen.

Diese `screen`-basierte Lösung bietet eine einfache und effektive Möglichkeit, mehrere Zenbot-Instanzen auf einem einzelnen Server zu betreiben und deren Persistenz zu gewährleisten.

