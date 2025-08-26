# Anleitung zur Verwendung der optimierten MACD-Strategie in Zenbot

Diese Anleitung führt Sie durch die Installation, Konfiguration und Anwendung der optimierten MACD-Strategie für Zenbot, einem leistungsstarken Open-Source-Trading-Bot für Kryptowährungen.

## 1. Installation von Zenbot

### Systemvoraussetzungen
- Node.js (Version 10.x oder höher)
- MongoDB (Version 3.4 oder höher)
- Git

### Installationsschritte

1. **Klonen des Zenbot-Repositories**
   ```bash
   git clone https://github.com/DeviaVir/zenbot.git
   cd zenbot
   ```

2. **Installation der Abhängigkeiten**
   ```bash
   npm install
   ```

3. **MongoDB starten**
   Stellen Sie sicher, dass MongoDB auf Ihrem System läuft:
   ```bash
   sudo service mongod start
   ```

## 2. Konfiguration der MACD-Strategie

1. **Konfigurationsdatei kopieren**
   Kopieren Sie die bereitgestellte `conf.js` in das Hauptverzeichnis von Zenbot:
   ```bash
   cp /pfad/zur/conf.js /pfad/zu/zenbot/conf.js
   ```

2. **API-Schlüssel einrichten**
   Öffnen Sie die `conf.js` und tragen Sie Ihre API-Schlüssel für die gewünschte Börse ein:
   ```javascript
   c.binance = {
     enabled: true,
     key: 'HIER_IHREN_API_KEY_EINTRAGEN',
     secret: 'HIER_IHREN_API_SECRET_EINTRAGEN',
     normalized_pair: 'BTC/USDT'  // Ändern Sie dies auf Ihr gewünschtes Handelspaar
   }
   ```

3. **Handelsparameter anpassen (optional)**
   Sie können die Handelsparameter in der `conf.js` nach Bedarf anpassen:
   ```javascript
   c.trade = {
     enabled: false,  // Auf true setzen für Live-Trading
     paper: true,     // Auf false setzen für echtes Trading
     currency_capital: 1000,  // Startkapital anpassen
     // weitere Parameter...
   }
   ```

## 3. Testen der Strategie mit Backtesting

Bevor Sie mit echtem Geld handeln, sollten Sie die Strategie mit historischen Daten testen:

```bash
./zenbot.sh backtest --strategy macd --conf ./conf.js --days 30
```

Dies führt einen Backtest der MACD-Strategie über die letzten 30 Tage durch. Sie können den Zeitraum nach Bedarf anpassen.

## 4. Paper Trading

Nach erfolgreichen Backtests können Sie mit Paper Trading beginnen, um die Strategie in Echtzeit zu testen, ohne echtes Geld zu riskieren:

```bash
./zenbot.sh sim --strategy macd --conf ./conf.js
```

Überwachen Sie die Performance über einige Tage, um sicherzustellen, dass die Strategie wie erwartet funktioniert.

## 5. Live Trading starten

Wenn Sie mit den Ergebnissen des Paper Tradings zufrieden sind, können Sie zum Live Trading übergehen:

1. **Konfiguration anpassen**
   Ändern Sie in der `conf.js` die folgenden Parameter:
   ```javascript
   c.trade = {
     enabled: true,  // Live Trading aktivieren
     paper: false,   // Paper Trading deaktivieren
     // weitere Parameter...
   }
   ```

2. **Live Trading starten**
   ```bash
   ./zenbot.sh trade --strategy macd --conf ./conf.js
   ```

## 6. Überwachung und Optimierung

1. **Überwachung der Performance**
   Zenbot gibt Handelsinformationen in der Konsole aus. Sie können auch Benachrichtigungen über Telegram einrichten, indem Sie die entsprechenden Parameter in der `conf.js` konfigurieren.

2. **Feinabstimmung der Parameter**
   Basierend auf der Performance können Sie die Parameter in der `conf.js` weiter optimieren:
   ```javascript
   c.macd = {
     // Parameter anpassen...
   }
   ```

3. **Automatische Optimierung**
   Zenbot bietet auch eine genetische Optimierungsfunktion:
   ```bash
   ./zenbot.sh genetic --strategy macd --conf ./conf.js --population 20 --generations 10
   ```

## 7. Wichtige Hinweise

- **Risikomanagement**: Handeln Sie niemals mit mehr Geld, als Sie bereit sind zu verlieren.
- **Überwachung**: Lassen Sie den Bot nicht unbeaufsichtigt laufen, besonders bei volatilen Marktbedingungen.
- **Steuern**: Beachten Sie, dass Kryptowährungsgewinne in den meisten Ländern steuerpflichtig sind.
- **Sicherheit**: Bewahren Sie Ihre API-Schlüssel sicher auf und erteilen Sie nur die notwendigen Berechtigungen.

## 8. Fehlerbehebung

- **MongoDB-Verbindungsprobleme**: Stellen Sie sicher, dass MongoDB läuft und erreichbar ist.
- **API-Fehler**: Überprüfen Sie, ob Ihre API-Schlüssel korrekt sind und die notwendigen Berechtigungen haben.
- **Strategie-Fehler**: Überprüfen Sie die Logs auf Fehler und stellen Sie sicher, dass alle Parameter korrekt sind.

## 9. Ressourcen

- [Zenbot GitHub Repository](https://github.com/DeviaVir/zenbot)
- [Zenbot Dokumentation](https://github.com/DeviaVir/zenbot/tree/master/docs)
- [Zenbot Community auf Reddit](https://www.reddit.com/r/zenbot/)

Diese optimierte MACD-Strategie bietet ein ausgewogenes Verhältnis zwischen Rendite und Risiko und ist besonders gut für Märkte mit klaren Trends geeignet. Die Parameter wurden sorgfältig ausgewählt, um in verschiedenen Marktbedingungen gute Ergebnisse zu erzielen.
