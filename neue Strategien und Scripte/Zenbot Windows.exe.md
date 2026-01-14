Zenbot Dwhr-pi Konvertierung

# Zenbot unter Windows als klickbare EXE, optional mit Installer
Phasen:
Windows-Lauffähigkeit sicherstellen. 
* Zenbot zu EXE bauen (pkg).  
* Optional: Setup.exe erstellen. 

Wir starten Phase 1.

## Phase 1 – Zenbot unter Windows lauffähig machen (Pflicht)
Bevor wir irgendwas paketieren, muss Zenbot normal unter Windows laufen.

#### Voraussetzungen
Auf dem Windows-Rechner:
Windows 10 oder 11  
Node.js LTS (64-bit)  
👉 https://nodejs.org (LTS wählen)  
Git for Windows  

### Schritt 1: Zenbot holen
In der PowerShell oder Git Bash:

Den Code kopieren und auf Zenbot-Version anpassen.  
(Standard DeviaVir oder Fork?)
```Bash
git clone https://github.com/DeviaVir/zenbot.git
cd zenbot
npm install
```
⏱️ ~5–10 Minuten


### Schritt 2: Testlauf (wichtig!)
Den Code kopieren
```Bash
node zenbot.js --help
```
Wenn du eine Hilfe-Ausgabe siehst → alles gut.

Falls Fehler:  
* oft Pfad- oder npm-Abhängigkeitsprobleme.  
* das lösen wir vor dem Packaging.  

## Phase 2 – Zenbot in eine Windows-EXE verpacken
Warum pkg?
* stabil
* weit verbreitet
* erzeugt eine einzelne EXE
* kein Node.js beim User nötig

### Schritt 3: pkg installieren
Den Code kopieren
```Bash
npm install -g pkg
```
Test:
Den Code kopieren
``` Bash
pkg --version
```


### Schritt 4: pkg-Konfiguration vorbereiten
In package.json ergänzen:
Den Code kopieren
```Json
{
  "bin": "zenbot.js",
  "pkg": {
    "assets": [
      "conf/**/*",
      "strategies/**/*",
      "extensions/**/*"
    ],
    "targets": [
      "node18-win-x64"
    ]
  }
}
```
⚠️ Wichtig:
* node18 = LTS
* Pfade relativ, nicht absolut

### Schritt 5: EXE bauen
Den Code kopieren
```Bash
pkg .
```
Das Ergebnis sollte sein:
```
Text
zenbot-win.exe
```

🎉 Das ist schon deine Klick-EXE (CLI-basiert)
Test:
Den Code zum testen kopieren und in der CLI einfügen. 
```Bash
zenbot-win.exe --help
```

## Phase 3 – Optional: Klick-Installer (Setup.exe)
Wenn du willst:
* Desktop-Icon
* Startmenü
* Deinstallation

➡️ Inno Setup (sehr empfehlenswert).  
Ich liefere dir auf Wunsch:
* fertiges .iss-Script
* Branding (Icon, Name)
* Auto-Startoption


### Typische Windows-Fallen (vorab wichtig)
Ich sag dir das jetzt, damit du nicht reinläufst:  

Dateizugriffe
* pkg-EXE läuft nicht im Projektordner
* Lösung: `process.cwd()` sauber nutzen
Schreibrechte
* Keine Logs in Program Files
* Nutze %APPDATA%\Zenbot
Firewall
* WebSocket-Verbindungen evtl. blockiert
* Einmal erlauben lassen

#### 

* Realistische Zeitschätzung ab jetzt *

| Schritt      | Zeit:        |
|:------------:|:------------:|
| Windows-Test | 30–60 min.   |
| pkg-Build    | 15 min.      |
| Fixes        | 1–2 h.       |
| Installer:   | 30–60 min.   |

➡️ Heute noch machbar

### Nächster Schritt (konkret) 

👉 Sag mir bitte als Nächstes:

Welche Zenbot-Version genau?  
(Standard DeviaVir oder Fork?)  
Soll Zenbot:  
🔹* rein per Konsole.  
🔹* oder per Doppelklick starten (Default-Config)?  


