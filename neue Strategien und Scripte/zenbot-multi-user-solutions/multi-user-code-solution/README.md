# Multi-User Quellcode-Anpassungen für Zenbot (Konzept)

Diese Sektion beschreibt ein **konzeptionelles** Vorgehen, um Zenbot so anzupassen, dass eine einzelne Zenbot-Instanz mehrere Benutzer oder Strategien gleichzeitig verwalten kann. Dies ist der komplexeste Ansatz und erfordert tiefgreifende Kenntnisse der Zenbot-Codebasis (Node.js).

**Wichtiger Hinweis:** Dies ist keine sofort einsatzbereite Lösung, sondern ein Leitfaden für die Entwicklung. Die Implementierung erfordert erheblichen Aufwand und ist mit der Wartung bei Zenbot-Updates verbunden.

## Konzept und Herausforderungen

Das Ziel ist es, die Kernlogik von Zenbot so zu erweitern, dass sie nicht nur eine einzelne `conf.js` und eine einzelne Strategie verarbeitet, sondern dynamisch mehrere Konfigurationen und Strategien parallel ausführt, während sie die Daten und Operationen jedes Benutzers isoliert hält.

### Herausforderungen:

1.  **Konfigurationsmanagement:** Wie werden mehrere Benutzerkonfigurationen geladen und verwaltet?
2.  **Datenisolation:** Sicherstellen, dass die Handelsdaten, Logs und Strategieparameter jedes Benutzers getrennt gespeichert und verarbeitet werden.
3.  **API-Key-Management:** Sichere Handhabung und Nutzung mehrerer API-Schlüssel für verschiedene Börsen und Benutzer.
4.  **Parallelisierung:** Zenbot ist event-basiert, aber die Ausführung mehrerer Strategien könnte zu Performance-Engpässen führen oder Race Conditions verursachen.
5.  **UI/API-Erweiterung:** Eine zentrale Web-Oberfläche oder API müsste entwickelt werden, um alle Benutzer und ihre Bots zu verwalten und zu überwachen.
6.  **Fehlerbehandlung:** Robuste Fehlerbehandlung, um sicherzustellen, dass ein Fehler in einer Benutzerstrategie nicht das gesamte System zum Absturz bringt.

## Mögliche Ansatzpunkte für Code-Anpassungen

### 1. Zentrales Konfigurations- und Benutzer-Modul

Man könnte ein neues Modul einführen, das für das Laden und Verwalten von Benutzerkonfigurationen zuständig ist. Anstatt einer einzelnen `conf.js` könnte es ein Verzeichnis mit `user_configs/` lesen.

**Beispiel (Konzept):**

```javascript
// zenbot/lib/users.js (Neues Modul)

const fs = require("fs");
const path = require("path");

class UserManager {
  constructor() {
    this.users = {};
    this.configDir = path.resolve(__dirname, "../user_configs");
  }

  loadUsers() {
    const configFiles = fs.readdirSync(this.configDir).filter(file => file.endsWith(".js"));
    for (const file of configFiles) {
      const userId = file.replace("conf_", "").replace(".js", "");
      const userConfig = require(path.join(this.configDir, file));
      this.users[userId] = {
        id: userId,
        config: userConfig,
        // Weitere benutzerbezogene Daten
      };
      console.log(`[UserManager] Benutzer ${userId} geladen.`);
    }
  }

  getUser(userId) {
    return this.users[userId];
  }

  getAllUsers() {
    return Object.values(this.users);
  }
}

module.exports = new UserManager();
```

### 2. Anpassung des Haupt-Zenbot-Prozesses (`zenbot.js`)

Der Hauptprozess müsste so geändert werden, dass er nicht nur eine, sondern mehrere Instanzen der Handelslogik (oder Teile davon) für jeden geladenen Benutzer initialisiert.

**Beispiel (Konzeptuelle Änderungen in `zenbot.js`):**

```javascript
// zenbot/zenbot.js (Auszug, stark vereinfacht)

const program = require("commander");
const UserManager = require("./lib/users");
// ... weitere Zenbot-Module

program
  .version(require("../package.json").version)
  .option("--conf <path>", "path to optional conf.js file");

program
  .command("multi-trade")
  .description("start multiple trading bots for different users")
  .action(async function () {
    UserManager.loadUsers();
    const users = UserManager.getAllUsers();

    if (users.length === 0) {
      console.error("Keine Benutzerkonfigurationen gefunden.");
      process.exit(1);
    }

    for (const user of users) {
      console.log(`Starte Bot für Benutzer: ${user.id}`);
      // Hier müsste die Kernlogik von Zenbot für jeden Benutzer instanziiert werden.
      // Dies würde bedeuten, dass Teile von `lib/engine.js`, `lib/trade.js` etc.
      // so umgeschrieben werden müssen, dass sie benutzer-spezifische Kontexte erhalten.
      
      // Beispiel: Ein vereinfachter Aufruf (nicht funktionsfähig ohne weitere Änderungen)
      // const userEngine = new ZenbotEngine(user.config, user.id);
      // userEngine.start();

      // Für jede Instanz müssten separate Datenbankverbindungen, Log-Dateien
      // und möglicherweise sogar separate Web-UI-Server (auf verschiedenen Ports)
      // oder eine zentrale, authentifizierte UI implementiert werden.
    }

    // Eine zentrale Web-UI oder API könnte hier gestartet werden,
    // um den Status aller Benutzer zu überwachen.
  });

program.parse(process.argv);

// Wenn kein Befehl angegeben wurde, zeige Hilfe an
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
```

### 3. Anpassung der Datenpersistenz

Zenbot verwendet standardmäßig eine SQLite-Datenbank (`data.sqlite`) oder MongoDB. Für eine Multi-User-Lösung müsste sichergestellt werden, dass die Daten jedes Benutzers isoliert sind.

*   **SQLite:** Jede Benutzerinstanz könnte eine eigene `data_<user_id>.sqlite` Datei verwenden.
*   **MongoDB:** Daten könnten mit einem `userId`-Feld in jeder Collection getaggt werden, oder jede Benutzerinstanz könnte eine eigene MongoDB-Datenbank verwenden.

### 4. Web UI / API

Die Zenbot Web UI ist für eine einzelne Instanz konzipiert. Für eine Multi-User-Lösung gäbe es zwei Hauptansätze:

*   **Mehrere Ports:** Jede Benutzerinstanz startet ihre eigene Web UI auf einem eindeutigen Port (wie in den Docker- und PM2-Lösungen). Dies ist der einfachste Weg, erfordert aber, dass der Benutzer die Ports kennt.
*   **Zentrale, authentifizierte UI:** Eine einzige Web-Anwendung, die alle Zenbot-Instanzen (oder die zentrale Multi-User-Instanz) verwaltet. Dies würde Authentifizierung, Benutzerverwaltung und eine Schnittstelle zur Anzeige und Steuerung der einzelnen Bots erfordern. Dies ist ein erhebliches Entwicklungsprojekt für sich.

## Fazit

Die Entwicklung einer echten Multi-User-Zenbot-Instanz durch Quellcode-Anpassungen ist ein **fortgeschrittenes Projekt**, das über die reine Konfiguration hinausgeht. Es erfordert ein tiefes Verständnis der Zenbot-Architektur und der Node.js-Programmierung. Die oben genannten Konzepte sind nur Ausgangspunkte und müssten detailliert ausgearbeitet und implementiert werden.

Für die meisten Anwendungsfälle sind die Lösungen mit **Docker** oder **PM2** (oder `screen` für einfachere Szenarien) die praktikableren und robusteren Optionen, da sie eine gute Isolation und Verwaltung ohne Änderungen am Zenbot-Kern bieten.

