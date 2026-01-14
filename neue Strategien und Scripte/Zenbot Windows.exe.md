# Zenbot unter Windows als klickbare EXE, optional mit Installer
Phasen:
Windows-Lauffähigkeit sicherstellen. 
* Zenbot zu EXE bauen (pkg).  
* Optional: Setup.exe erstellen. 

Wir starten Phase 1.

### Phase 1 – Zenbot unter Windows lauffähig machen (Pflicht)
Bevor wir irgendwas paketieren, muss Zenbot normal unter Windows laufen.

#### Voraussetzungen
Auf dem Windows-Rechner:
Windows 10 oder 11  
Node.js LTS (64-bit)  
👉 https://nodejs.org (LTS wählen)  
Git for Windows  

### Schritt 1: Zenbot holen
In der PowerShell oder Git Bash:
Den Code kopieren
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
