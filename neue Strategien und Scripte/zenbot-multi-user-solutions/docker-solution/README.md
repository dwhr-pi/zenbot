# Docker-Lösung für Zenbot Multi-User

Diese Lösung verwendet Docker und Docker Compose, um mehrere isolierte Zenbot-Instanzen zu betreiben. Jede Instanz läuft in einem eigenen Container mit einer spezifischen Konfiguration und separaten Daten.

## Vorteile

*   **Vollständige Isolation:** Jeder Container hat sein eigenes Dateisystem, seine eigenen Abhängigkeiten und seinen eigenen Prozessraum. Konflikte zwischen den Konfigurationen sind ausgeschlossen.
*   **Skalierbarkeit und Portabilität:** Einmal als Docker-Image konfiguriert, kann es leicht auf verschiedenen Systemen bereitgestellt werden.
*   **Einfache Verwaltung:** Mit `docker-compose` können alle Instanzen gleichzeitig gestartet, gestoppt und verwaltet werden.
*   **Ressourcenmanagement:** Docker bietet Mechanismen zur Begrenzung von CPU- und Speichernutzung pro Container.

## Voraussetzungen

*   Docker und Docker Compose müssen auf Ihrem System installiert sein.
    *   [Docker Installation Guide](https://docs.docker.com/get-docker/)
    *   [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

## Struktur des Verzeichnisses

```
docker-solution/
├── configs/
│   ├── conf_user_a.js  # Konfigurationsdatei für Benutzer A
│   └── conf_user_b.js  # Konfigurationsdatei für Benutzer B
├── database/
│   ├── user_a/         # Persistente Daten für Benutzer A (z.B. SQLite DB)
│   └── user_b/         # Persistente Daten für Benutzer B
├── logs/
│   ├── user_a/         # Log-Dateien für Benutzer A
│   └── user_b/         # Log-Dateien für Benutzer B
├── Dockerfile          # Definiert das Docker-Image für Zenbot
└── docker-compose.yml  # Definiert die Multi-Container-Anwendung
```

## Konfiguration

1.  **Konfigurationsdateien (`configs/conf_user_a.js`, `configs/conf_user_b.js`):**
    *   Kopieren Sie Ihre Zenbot `conf.js` Vorlage in diese Dateien.
    *   Passen Sie die Einstellungen für jeden Benutzer individuell an, insbesondere die API-Schlüssel, Strategien, Selektoren (Börse, Asset, Währung) und Paper-Trading-Einstellungen.
    *   Stellen Sie sicher, dass die `selector` und `exchange` Felder korrekt sind.

    Beispiel für `conf_user_a.js`:
    ```javascript
    module.exports = {
      selector: 'binance.BTC-USDT',
      asset: 'BTC',
      currency: 'USDT',
      exchange: 'binance',
      binance: {
        key: 'YOUR_BINANCE_API_KEY_A',
        secret: 'YOUR_BINANCE_SECRET_A',
      },
      strategy: {
        name: 'trend_ema',
        period: '1h',
        // ... weitere Strategie-Einstellungen
      },
      paper: {
        enabled: true,
        starting_balance: 1000,
        // ... weitere Paper-Trading-Einstellungen
      },
    };
    ```

2.  **`Dockerfile`:**
    *   Dieses Dockerfile klont das Zenbot-Repository und installiert alle notwendigen Abhängigkeiten.
    *   Es basiert auf `node:18-alpine` für eine schlanke Basis.
    *   Sie können die Node.js-Version bei Bedarf anpassen.

3.  **`docker-compose.yml`:**
    *   Definiert zwei Zenbot-Dienste (`zenbot_user_a`, `zenbot_user_b`), die jeweils eine eigene Konfigurationsdatei und persistente Daten- und Log-Verzeichnisse mounten.
    *   Jeder Dienst exposed einen eigenen Port für die Zenbot Web UI (8081 für Benutzer A, 8082 für Benutzer B).
    *   Die `command`-Anweisung startet Zenbot im `trade --paper` Modus und verwendet die spezifische Konfigurationsdatei.
    *   Optionale Dienste für MongoDB und Redis sind enthalten, falls Sie diese für Zenbot benötigen (Zenbot kann auch ohne diese laufen, wenn Sie keine historischen Daten speichern oder keine erweiterte Funktionalität nutzen).
    *   Die `networks` und `volumes` Sektionen sorgen für die Kommunikation zwischen den Containern und die Persistenz der Daten.

## Nutzung

1.  **Navigieren Sie in das Verzeichnis:**
    ```bash
    cd zenbot-multi-user-solutions/docker-solution
    ```

2.  **Starten Sie die Zenbot-Instanzen:**
    ```bash
    docker-compose up -d --build
    ```
    *   `up`: Startet die Dienste, die in `docker-compose.yml` definiert sind.
    *   `-d`: Startet die Dienste im Detached-Modus (im Hintergrund).
    *   `--build`: Baut die Docker-Images neu, falls Änderungen am `Dockerfile` vorgenommen wurden oder noch kein Image existiert.

3.  **Überprüfen Sie den Status der Container:**
    ```bash
    docker-compose ps
    ```

4.  **Sehen Sie sich die Logs an (optional):**
    ```bash
    docker-compose logs -f zenbot_user_a
    docker-compose logs -f zenbot_user_b
    ```
    *   `-f`: Folgt den Logs in Echtzeit.

5.  **Greifen Sie auf die Web UI zu:**
    *   Benutzer A: `http://localhost:8081`
    *   Benutzer B: `http://localhost:8082`

6.  **Stoppen Sie die Zenbot-Instanzen:**
    ```bash
    docker-compose down
    ```
    *   `down`: Stoppt und entfernt die Container, Netzwerke und Volumes (es sei denn, Volumes sind explizit als extern definiert).

## Wichtige Hinweise

*   **API-Schlüssel:** Ersetzen Sie `YOUR_BINANCE_API_KEY_A`, `YOUR_BINANCE_SECRET_A` usw. durch Ihre echten API-Schlüssel. Seien Sie äußerst vorsichtig mit der Sicherheit Ihrer API-Schlüssel.
*   **Paper Trading:** Die Beispiele sind für Paper Trading konfiguriert (`--paper`). Entfernen Sie dies, um mit echtem Geld zu handeln, aber seien Sie sich der Risiken bewusst.
*   **Datenpersistenz:** Die `volumes` in `docker-compose.yml` stellen sicher, dass Ihre Datenbank- und Log-Daten auch nach dem Stoppen und Entfernen der Container erhalten bleiben.
*   **Ressourcen:** Überwachen Sie die Ressourcennutzung Ihrer Docker-Container, insbesondere wenn Sie viele Instanzen betreiben.
*   **Zenbot-Version:** Das Dockerfile klont die neueste Version von Zenbot. Wenn Sie eine spezifische Version benötigen, können Sie `git checkout <tag/branch>` im Dockerfile hinzufügen.

Diese Docker-Lösung bietet eine robuste und skalierbare Möglichkeit, Zenbot für mehrere Benutzer oder Strategien gleichzeitig zu betreiben.

