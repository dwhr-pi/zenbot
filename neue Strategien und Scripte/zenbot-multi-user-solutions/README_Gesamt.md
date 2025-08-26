# Zenbot Multi-User Lösungen: Eine Übersicht

Dieses Archiv enthält verschiedene Ansätze und Quellcode-Beispiele, um Zenbot für mehrere Benutzer oder den parallelen Betrieb von mehreren Strategien zu konfigurieren. Jede Lösung hat ihre eigenen Vor- und Nachteile in Bezug auf Komplexität, Isolation und Ressourcenverbrauch.

## Inhaltsverzeichnis

1.  [Einführung](#einführung)
2.  [Lösungen im Überblick](#lösungen-im-überblick)
    *   [Docker-Lösung](#docker-lösung)
    *   [Screen-Lösung](#screen-lösung)
    *   [PM2-Lösung](#pm2-lösung)
    *   [Multi-User Quellcode-Anpassungen (Konzept)](#multi-user-quellcode-anpassungen-konzept)
3.  [Wichtige Hinweise](#wichtige-hinweise)

## Einführung

Zenbot ist ein leistungsstarker Open-Source-Trading-Bot, der für den automatisierten Handel mit Kryptowährungen entwickelt wurde. Standardmäßig ist Zenbot für den Betrieb einer einzelnen Instanz mit einer spezifischen Konfiguration ausgelegt. Wenn jedoch die Anforderung besteht, mehrere Benutzer gleichzeitig zu unterstützen oder verschiedene Handelsstrategien parallel auszuführen, sind Anpassungen oder alternative Bereitstellungsmethoden erforderlich.

Dieses Dokument und die beiliegenden Verzeichnisse bieten praktische Beispiele für die gängigsten und robustesten Methoden, um Zenbot in einer Multi-User-Umgebung zu betreiben. Die Auswahl der besten Lösung hängt von Ihren spezifischen Anforderungen, technischen Kenntnissen und der gewünschten Skalierbarkeit ab.

## Lösungen im Überblick

### Docker-Lösung

Die Docker-Lösung bietet die höchste Isolation und Portabilität. Jede Zenbot-Instanz läuft in einem eigenen, isolierten Docker-Container. Dies verhindert Konflikte zwischen den Konfigurationen und Abhängigkeiten der einzelnen Benutzer und ermöglicht eine einfache Skalierung und Bereitstellung auf verschiedenen Systemen.

*   **Vorteile:** Vollständige Isolation, hohe Portabilität, einfache Verwaltung mit `docker-compose`, gute Skalierbarkeit.
*   **Nachteile:** Erfordert Kenntnisse in Docker und Docker Compose, etwas komplexer in der Ersteinrichtung.
*   **Details und Anleitung:** Siehe `docker-solution/README.md`

### Screen-Lösung

Die Screen-Lösung ist ein einfacher Ansatz, um mehrere Zenbot-Instanzen in persistenten Terminal-Sitzungen im Hintergrund auszuführen. Dies ist nützlich, wenn Sie sich von Ihrem Server abmelden möchten, aber die Bots weiterlaufen sollen.

*   **Vorteile:** Einfach einzurichten, Prozesse laufen persistent im Hintergrund, geringer Overhead durch `screen`.
*   **Nachteile:** Weniger Isolation als Docker, Verwaltung vieler Sessions kann unübersichtlich werden, höherer Ressourcenverbrauch pro Instanz als eine zentralisierte Lösung.
*   **Details und Anleitung:** Siehe `screen-solution/README.md`

### PM2-Lösung

PM2 (Process Manager 2) ist ein robuster Prozessmanager für Node.js-Anwendungen. Er bietet Funktionen wie automatischen Neustart bei Absturz, integriertes Logging und Überwachung. Dies ist eine professionellere Alternative zu `screen` für den produktiven Einsatz von Node.js-Anwendungen.

*   **Vorteile:** Zuverlässiges Prozessmanagement, automatischer Neustart, zentralisiertes Logging, einfache Überwachung, Konfiguration für Systemstart.
*   **Nachteile:** Etwas komplexer in der Einrichtung als `screen`, weniger Isolation als Docker.
*   **Details und Anleitung:** Siehe `pm2-solution/README.md`

### Multi-User Quellcode-Anpassungen (Konzept)

Dieser Ansatz beschreibt ein **konzeptionelles** Vorgehen, um den Zenbot-Quellcode so anzupassen, dass eine einzige Zenbot-Instanz mehrere Benutzer oder Strategien intern verwalten kann. Dies ist der komplexeste Weg und erfordert tiefgreifende Änderungen an der Zenbot-Codebasis.

*   **Vorteile:** Potenziell ressourcenschonendste Lösung im Betrieb (eine Instanz verwaltet alles), Möglichkeit einer zentralen, authentifizierten Web-Oberfläche.
*   **Nachteile:** Sehr hoher Entwicklungsaufwand, erfordert tiefgreifende Kenntnisse der Zenbot-Architektur, aufwendige Wartung bei Zenbot-Updates, keine sofort einsatzbereite Lösung.
*   **Details und Anleitung:** Siehe `multi-user-code-solution/README.md`

## Wichtige Hinweise

*   **API-Schlüssel-Sicherheit:** Unabhängig von der gewählten Lösung ist es von größter Bedeutung, Ihre API-Schlüssel sicher zu behandeln. Verwenden Sie niemals Hardcoded-Schlüssel in öffentlichen Repositories und beschränken Sie die Berechtigungen Ihrer API-Schlüssel auf das absolute Minimum.
*   **Paper Trading vs. Live Trading:** Alle bereitgestellten Beispiele sind standardmäßig für Paper Trading konfiguriert (`--paper`). Bevor Sie mit echtem Geld handeln, stellen Sie sicher, dass Sie die Risiken verstehen und Ihre Konfigurationen gründlich getestet haben.
*   **Ressourcenverbrauch:** Beachten Sie, dass das Betreiben mehrerer Zenbot-Instanzen (auch im Paper Trading) Systemressourcen (CPU, RAM, Netzwerk) verbraucht. Überwachen Sie die Leistung Ihres Servers, um Engpässe zu vermeiden.
*   **Zenbot-Updates:** Wenn Sie Zenbot aktualisieren, stellen Sie sicher, dass Ihre Multi-User-Konfigurationen und -Skripte weiterhin kompatibel sind. Bei Quellcode-Anpassungen kann dies besonders aufwendig sein.

Wir hoffen, dass diese Sammlung von Lösungen Ihnen hilft, die für Ihre Anforderungen passende Multi-User-Konfiguration für Zenbot zu finden und zu implementieren. Bei Fragen oder Problemen konsultieren Sie bitte die spezifischen `README.md`-Dateien in den jeweiligen Lösungsverzeichnissen.

