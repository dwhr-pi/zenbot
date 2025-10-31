# Algo-Trading Strategie für Zenbot erklären und erstellen. biete dies in Markdown-Dateien und als Zip-Datei an.

Hallo! Ich kann dir erklären, wie eine Algo-Trading-Strategie für Zenbot konzipiert und erstellt wird. Zenbot ist ein Open-Source-Bot für den Handel mit Kryptowährungen, der es Benutzern ermöglicht, ihre eigenen Handelsstrategien zu implementieren und zu testen.

Da ich als KI in einer eingeschränkten Umgebung arbeite, kann ich keine Zip-Dateien direkt erstellen oder zum Download anbieten. Ich kann dir jedoch den gesamten Prozess und den Code in Markdown-Formatierung bereitstellen, sodass du die Dateien ganz einfach selbst erstellen und in einer Zip-Datei zusammenfassen kannst.

Zuerst werde ich die notwendigen Informationen über Zenbot-Strategien und deren Struktur sammeln.

Basierend auf den gesammelten Informationen kann ich dir nun eine detaillierte Anleitung und den Code für eine Zenbot-Strategie zur Verfügung stellen.

### **Wichtiger Hinweis vorab**

Der Handel mit Kryptowährungen, insbesondere mit Bots, ist hochriskant. Zenbot ist ein experimentelles Werkzeug, und du kannst dein investiertes Kapital verlieren. Es ist unerlässlich, jede Strategie ausgiebig im "Paper-Trading"-Modus (Simulation) und mit Backtesting zu testen, bevor du echtes Geld einsetzt.

---

### **Teil 1: Grundlegendes zu Zenbot-Strategien**

Eine Zenbot-Strategie ist im Wesentlichen ein Satz von Regeln, die in JavaScript geschrieben sind und dem Bot sagen, wann er kaufen oder verkaufen soll. Diese Regeln basieren typischerweise auf technischen Indikatoren.

#### **Dateistruktur**

Jede Strategie befindet sich in ihrem eigenen Ordner innerhalb des Zenbot-Verzeichnisses unter `extensions/strategies/`. Der Hauptcode der Strategie liegt in einer Datei namens `strategy.js`.

Wenn du also eine neue Strategie namens "meine_strategie" erstellst, würde die Struktur so aussehen:

```
zenbot/
└── extensions/
    └── strategies/
        └── meine_strategie/
            └── strategy.js
```

#### **Schlüsselfunktionen in `strategy.js`**

Eine Strategiedatei exportiert ein Objekt, das mehrere optionale Methoden enthalten kann. Die wichtigsten sind:

1.  `onPeriod(s, cb)`: Diese Funktion wird am Ende jeder Handelsperiode (z. B. alle 5 Minuten) aufgerufen. Hier analysierst du die Indikatoren und entscheidest, ob ein Kauf- oder Verkaufssignal gesendet werden soll.
2.  `onReport(s, cb)`: Diese Funktion wird bei jeder Aktualisierung der Konsole aufgerufen. Sie ist nützlich, um benutzerdefinierte Informationen während des Betriebs des Bots anzuzeigen.

---

### **Teil 2: Erstellen einer Beispielstrategie: "MACD Cross"**

Wir erstellen eine einfache, aber klassische Strategie, die auf dem **MACD (Moving Average Convergence Divergence)** Indikator basiert.

*   **Kauf-Signal**: Wenn die MACD-Linie die Signallinie von unten nach oben kreuzt.
*   **Verkauf-Signal**: Wenn die MACD-Linie die Signallinie von oben nach unten kreuzt.

#### **Schritt 1: Ordner und Datei erstellen**

1.  Navigiere in dein Zenbot-Verzeichnis.
2.  Erstelle einen neuen Ordner: `extensions/strategies/macd_cross`
3.  Erstelle in diesem neuen Ordner eine leere Datei namens `strategy.js`.

#### **Schritt 2: Den Code für die Strategie schreiben**

Füge den folgenden Code in deine `strategy.js`-Datei ein. Ich habe Kommentare hinzugefügt, um jeden Teil zu erklären.

```markdown
### **Datei: extensions/strategies/macd_cross/strategy.js**

```javascript
// Importiert die Zenbot-Bibliothek für technische Analysen
var z = require('zenbot_sim_lib');

module.exports = {
  name: 'macd_cross',
  description: 'Kauft, wenn die MACD-Linie die Signallinie kreuzt, und verkauft, wenn sie nach unten kreuzt.',

  // Parameter der Strategie definieren. Diese können über die Kommandozeile angepasst werden.
  getOptions: function () {
    this.option('period', 'Länge der Handelsperiode', String, '5m');
    this.option('min_periods', 'Minimale Anzahl an Perioden für die Berechnung', Number, 52);
    this.option('ema_short_period', 'Zeitraum für den kurzen EMA', Number, 12);
    this.option('ema_long_period', 'Zeitraum für den langen EMA', Number, 26);
    this.option('signal_period', 'Zeitraum für die EMA-Signallinie', Number, 9);
  },

  // Diese Funktion wird am Ende jeder Periode aufgerufen.
  onPeriod: function (s, cb) {
    // Sicherstellen, dass genügend Daten vorhanden sind, um den Indikator zu berechnen.
    if (s.lookback.length > s.options.min_periods) {
      // MACD-Indikator mit den definierten Parametern berechnen.
      z.macd(s, 'macd', s.options.ema_short_period, s.options.ema_long_period, s.options.signal_period);

      // Überprüfen, ob die MACD-Werte für die aktuelle und die vorherige Periode vorhanden sind.
      if (s.period.macd && s.lookback && s.lookback.macd) {
        let macd_value = s.period.macd;
        let prev_macd_value = s.lookback.macd;

        // KAUF-Logik: MACD kreuzt die Signallinie von unten.
        if (prev_macd_value.macd < prev_macd_value.signal && macd_value.macd > macd_value.signal) {
          s.signal = 'buy';
        }
        // VERKAUF-Logik: MACD kreuzt die Signallinie von oben.
        else if (prev_macd_value.macd > prev_macd_value.signal && macd_value.macd < macd_value.signal) {
          s.signal = 'sell';
        }
        // HALTEN-Logik: Keine Kreuzung, kein Signal.
        else {
          s.signal = null;
        }
      }
    }
    // Callback-Funktion aufrufen, um den Vorgang abzuschließen.
    cb();
  },

  // Diese Funktion wird bei jeder Konsolenaktualisierung aufgerufen.
  onReport: function (s, cb) {
    var cols = [];
    if (s.period.macd) {
      // Zeigt den aktuellen MACD-Wert in der Konsole an.
      cols.push('MACD: ' + z.formatVal(s.period.macd.macd, 8));
      cols.push('Signal: ' + z.formatVal(s.period.macd.signal, 8));
    } else {
      cols.push('Berechne...');
    }
    cb(null, cols);
  }
};
```

---

### **Teil 3: Die Strategie verwenden und testen**

Nachdem du die Strategie erstellt hast, musst du sie testen.

#### **1. Strategie auflisten**

Überprüfe, ob Zenbot deine neue Strategie erkennt:
```bash
./zenbot.sh list-strategies
```
Deine `macd_cross`-Strategie sollte in der Liste erscheinen.

#### **2. Backtesting (Simulation mit historischen Daten)**

Bevor du eine Strategie live einsetzt, solltest du ein Backtesting durchführen. [4]

*   **Schritt A: Historische Daten herunterladen**
    Lade die Daten für das gewünschte Währungspaar und den Zeitraum herunter. Beispiel für BTC/EUR von der Börse Coinbase Pro (gdax) für die letzten 30 Tage:
    ```bash
    ./zenbot.sh backfill gdax.BTC-EUR --days 30
    ```

*   **Schritt B: Simulation durchführen**
    Führe die Simulation mit deiner Strategie durch:
    ```bash
    ./zenbot.sh sim gdax.BTC-EUR --strategy macd_cross --period=5m
    ```
    Zenbot wird die Strategie auf den heruntergeladenen Daten ausführen und am Ende einen Bericht erstellen. Dieser Bericht wird als HTML-Datei im Ordner `simulations/` gespeichert. [4] Du kannst diese Datei in deinem Browser öffnen, um eine detaillierte Analyse der Trades, Gewinne und Verluste zu sehen.

#### **3. Paper-Trading (Simulation am Live-Markt)**

Wenn die Backtesting-Ergebnisse vielversprechend sind, ist der nächste Schritt das Paper-Trading. Dabei läuft der Bot in Echtzeit, aber ohne echtes Geld zu verwenden. [4]

```bash
./zenbot.sh trade gdax.BTC-EUR --strategy macd_cross --paper
```

Beobachte den Bot für einige Tage oder Wochen, um zu sehen, wie er sich unter realen Marktbedingungen verhält.

---

### **Zusammenfassung als Markdown-Dateien**

Hier ist die Struktur, die du für deine Zip-Datei verwenden kannst:

#### `README.md`
```markdown
# Zenbot Algo-Trading Strategie: MACD Cross

Dieses Paket enthält eine Anleitung und den Code zur Erstellung einer einfachen Handelsstrategie für den Zenbot.

**Wichtiger Hinweis:** Der Handel mit Kryptowährungen ist riskant. Teste diese Strategie ausgiebig mit Backtesting und Paper-Trading, bevor du echtes Geld einsetzt.

## Inhalt

1.  **Anleitung.md**: Eine Schritt-für-Schritt-Anleitung zur Funktionsweise und Erstellung von Zenbot-Strategien.
2.  **macd_cross/strategy.js**: Der Quellcode für die Beispielstrategie "MACD Cross".

## Verwendung

1.  Kopiere den Ordner `macd_cross` in das Verzeichnis `extensions/strategies/` deiner Zenbot-Installation.
2.  Folge den Anweisungen in `Anleitung.md`, um die Strategie zu testen und zu verwenden.
```

#### `Anleitung.md`
```markdown
# Anleitung: Zenbot-Strategie erstellen und verwenden

## 1. Grundlegendes

Eine Zenbot-Strategie ist eine JavaScript-Datei, die in `extensions/strategies/` gespeichert wird. Sie definiert, wann der Bot kaufen oder verkaufen soll, basierend auf technischen Indikatoren.

## 2. Die "MACD Cross"-Strategie

Diese Strategie verwendet den MACD-Indikator:
- **Kauf-Signal**: Wenn die MACD-Linie die Signallinie von unten kreuzt.
- **Verkauf-Signal**: Wenn die MACD-Linie die Signallinie von oben kreuzt.

## 3. Installation der Strategie

- Kopiere den Ordner `macd_cross` (mit der darin enthaltenen `strategy.js`) in das Verzeichnis `extensions/strategies/` deiner Zenbot-Installation.

## 4. Testen der Strategie

Führe die folgenden Befehle im Hauptverzeichnis deines Zenbot-Ordners aus. Ersetze `gdax.BTC-EUR` bei Bedarf durch deine gewünschte Börse und dein Währungspaar.

### Schritt A: Historische Daten laden
```bash
./zenbot.sh backfill gdax.BTC-EUR --days 30
```

### Schritt B: Backtesting (Simulation)
```bash
./zenbot.sh sim gdax.BTC-EUR --strategy macd_cross
```
Die Ergebnisse werden in einer HTML-Datei im Ordner `simulations/` gespeichert.

### Schritt C: Paper-Trading (Live-Simulation)
```bash
./zenbot.sh trade gdax.BTC-EUR --strategy macd_cross --paper
```

## 5. Live-Handel (AUF EIGENES RISIKO)

Wenn du nach ausgiebigen Tests bereit bist, live zu handeln, musst du deine API-Schlüssel in der `conf.js`-Datei konfigurieren und den `--paper`-Flag weglassen:

```bash
./zenbot.sh trade gdax.BTC-EUR --strategy macd_cross
``````

#### `macd_cross/strategy.js`
(Der oben bereits gezeigte JavaScript-Code)

Du kannst diese drei Textblöcke einfach in die entsprechenden Dateien kopieren und sie dann in einem Zip-Archiv zusammenfassen.
