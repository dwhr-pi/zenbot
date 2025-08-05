Hallo! Hier sind die Installationsanleitungen, um Zenbot auf Microsoft Windows und macOS auszuführen.

### Was ist Zenbot?

Zenbot ist ein quelloffener, kommandozeilenbasierter Handelsbot für Kryptowährungen. Er unterstützt eine Vielzahl von Kryptowährungsbörsen und ist in erster Linie für technische Händler gedacht. Die Entwicklung von Zenbot wurde jedoch eingestellt, was bedeutet, dass es möglicherweise nicht mehr mit den neuesten Systemen oder den APIs der Börsen kompatibel ist.

---

### Installationsanleitung für Microsoft Windows

Die Installation unter Windows erfordert einige zusätzliche Schritte, da Zenbot primär für Linux- und macOS-Umgebungen entwickelt wurde. Die Verwendung des Windows-Subsystems für Linux (WSL) wird empfohlen, um Kompatibilitätsprobleme zu umgehen.

**Schritt 1: Windows-Subsystem für Linux (WSL) installieren**

1.  Öffnen Sie die PowerShell als Administrator.
2.  Führen Sie den folgenden Befehl aus, um WSL zu aktivieren und die Standard-Linux-Distribution (normalerweise Ubuntu) zu installieren:
    ```
    wsl --install
    ```
3.  Starten Sie Ihren Computer nach Abschluss der Installation neu.

**Schritt 2: Node.js und MongoDB installieren**

1.  Öffnen Sie Ihre neu installierte Linux-Distribution (z. B. Ubuntu) aus dem Startmenü.
2.  Installieren Sie `nvm` (Node Version Manager), um Node.js zu verwalten:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
3.  Laden Sie die `.bashrc`-Datei neu, damit `nvm` verfügbar ist:
    ```bash
    source ~/.bashrc
    ```
4.  Installieren Sie Node.js Version 16 (eine von Zenbot unterstützte Version):
    ```bash
    nvm install 16
    nvm use 16
    ```
5.  Installieren Sie MongoDB, eine für Zenbot erforderliche Datenbank:
    ```bash
    sudo apt-get update
    sudo apt-get install -y mongodb
    ```
6.  Starten Sie den MongoDB-Dienst:
    ```bash
    sudo service mongodb start
    ```

**Schritt 3: Zenbot herunterladen und installieren**

1.  Klonen Sie das Zenbot-Repository von GitHub:
    ```bash
    git clone https://github.com/deviavir/zenbot.git
    ```
2.  Wechseln Sie in das Zenbot-Verzeichnis:
    ```bash
    cd zenbot
    ```
3.  Installieren Sie die erforderlichen Node.js-Abhängigkeiten:
    ```bash
    npm install
    ```

**Schritt 4: Zenbot konfigurieren und ausführen**

1.  Erstellen Sie eine Konfigurationsdatei, indem Sie die Beispieldatei kopieren:
    ```bash
    cp conf-sample.js conf.js
    ```
2.  Bearbeiten Sie die `conf.js`-Datei mit einem Texteditor (z. B. `nano conf.js`), um Ihre API-Schlüssel für die Börse und andere Einstellungen hinzuzufügen.
3.  Führen Sie Zenbot aus, um die verfügbaren Befehle anzuzeigen:
    ```bash
    ./zenbot.sh shell
    ```

---

### Installationsanleitung für macOS

Die Installation auf macOS ist unkomplizierter, da es sich um ein Unix-basiertes System handelt.

**Schritt 1: Homebrew installieren**

1.  Öffnen Sie das Terminal.
2.  Falls Sie Homebrew, einen Paketmanager für macOS, noch nicht installiert haben, fügen Sie den folgenden Befehl ein:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

**Schritt 2: Node.js und MongoDB installieren**

1.  Installieren Sie die neueste Version von Node.js und MongoDB mit Homebrew:
    ```bash
    brew install node
    brew install mongodb-community
    ```
2.  Starten Sie den MongoDB-Dienst:
    ```bash
    brew services start mongodb-community
    ```

**Schritt 3: Zenbot herunterladen und installieren**

1.  Klonen Sie das Zenbot-Repository von GitHub:
    ```bash
    git clone https://github.com/deviavir/zenbot.git
    ```
2.  Wechseln Sie in das Zenbot-Verzeichnis:
    ```bash
    cd zenbot
    ```
3.  Installieren Sie die erforderlichen Node.js-Abhängigkeiten:
    ```bash
    npm install
    ```

**Schritt 4: Zenbot konfigurieren und ausführen**

1.  Erstellen Sie Ihre Konfigurationsdatei:
    ```bash
    cp conf-sample.js conf.js
    ```
2.  Bearbeiten Sie die `conf.js`-Datei, um Ihre Börsen-API-Schlüssel und andere Handelsparameter einzutragen.
3.  Führen Sie Zenbot aus:
    ```bash
    ./zenbot.sh trade
    ```

> **Wichtiger Hinweis:** Die Entwicklung von Zenbot wurde eingestellt. Dies kann zu Kompatibilitätsproblemen mit modernen Betriebssystemen oder den APIs von Kryptowährungsbörsen führen. Die Verwendung erfolgt auf eigenes Risiko.

