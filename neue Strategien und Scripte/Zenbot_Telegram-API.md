# Zenbot Telegram Anleitung zum Erhalt der API und des Sicherheitsschlüssels. 

Basierend auf den Suchergebnissen scheint es eine gewisse Verwirrung zu geben. Zenbot ist eine Befehlszeilenanwendung für den Handel mit Kryptowährungen und nicht direkt ein Telegram-Bot, den man einfach so einrichtet. Die Anleitungen, die gefunden wurden, beziehen sich auf die generelle Erstellung eines Telegram-Bots und den Erhalt eines API-Schlüssels (Token) dafür.

Es gibt keinen spezifischen "Sicherheitsschlüssel" für Zenbot in Verbindung mit Telegram. Der "API-Schlüssel" oder "Token" wird von Telegram selbst generiert, um einem Bot den Zugriff auf die Telegram-API zu ermöglichen.

Hier ist die allgemeine Vorgehensweise, um einen Telegram-Bot zu erstellen und den API-Token zu erhalten, den Sie dann theoretisch in einer Anwendung wie Zenbot verwenden könnten, wenn diese eine Telegram-Integration unterstützt:

### Anleitung zum Erhalt des Telegram-API-Tokens:

1.  **BotFather in Telegram finden:** Öffnen Sie Ihre Telegram-App und suchen Sie nach dem offiziellen Bot-Verwaltungs-Bot von Telegram namens "BotFather". Er hat ein blaues Häkchen zur Verifizierung.

2.  **Neuen Bot erstellen:** Starten Sie einen Chat mit dem BotFather und geben Sie den Befehl `/newbot` ein.

3.  **Namen und Benutzernamen vergeben:**
    *   Der BotFather wird Sie zunächst nach einem Anzeigenamen für Ihren Bot fragen. Diesen können Sie frei wählen.
    *   Anschließend müssen Sie einen eindeutigen Benutzernamen für Ihren Bot festlegen, der auf "_bot" enden muss (z. B. `MeinTest_bot`).

4.  **API-Token erhalten:** Nachdem Sie einen gültigen Benutzernamen gewählt haben, sendet Ihnen der BotFather eine Nachricht, die Ihren API-Token enthält. Dieser Token ist eine lange Zeichenfolge aus Zahlen und Buchstaben und dient zur Authentifizierung Ihres Bots. Behandeln Sie diesen Token wie ein Passwort und geben Sie ihn nicht an Unbefugte weiter.

5.  **API-Token wiederfinden:** Sollten Sie den Token verlieren oder vergessen, können Sie den BotFather erneut kontaktieren, den Befehl `/mybots` eingeben, Ihren Bot aus der Liste auswählen und dann die Option "API Token" wählen, um ihn erneut anzuzeigen.

Dieser API-Token wird dann in der Konfiguration der Software verwendet, die den Bot steuern soll (in Ihrem Fall potenziell Zenbot, falls es eine solche Funktion zur Benachrichtigung oder Steuerung via Telegram bietet). Die Dokumentation von Zenbot selbst wäre die primäre Quelle, um herauszufinden, wo und wie dieser Telegram-API-Token eingetragen werden muss.  


# Zenbot verlangt noch einen Sicherheitsschlüssel als Gegenprobe.

Diesen erhält man in dem man alles bisherige dazu (siehe oben) konfiguriert hat. 
Nun man sich diesen erstellten Chatraum/Channel zum Bot näher ansieht. 
Nun sollte unser Zenbot gestartet sein und das Terminal gut sichtbar sein. 
nur /zenbot.sh auszuführen sollte reichen.  
Gib jetzt einfach mal irgendeinen Text in den Chatraum oder Channel ein und siehe was im Terminal geschrieben wird und passiert. 
Im Terminal erscheint eine Nummer, neben der von Dir in Telegramm eingegeben Nachricht, die Du dort eingegeben hast nunmehr im Terminal sichtbar. 
Diese Nummer ist dann der gesuchte Schlüssel, der nur Dir gegenüber bzw. Zenbot bekannt gegeben wird. 
Kopiere diesen Sicherheitsschlüssel und füge den in die `confic.js` an entstprechder Stelle `Telegram_Secret_Key` ein. 

Der Schlüssel bedeutet, das Zenbot nur auf den User hört und Befehle annimmt, die nur von diesem einem User stammen. 
Vermeide, das zu diesem Zeitpunkt des Probelaufes andere Personen auf den Channel oder Chatraum zugriff haben. 
Später kannste mit einem Zweitaccount testen, ob Zenbot wirklich nur Dir gehorcht und keinem anderen. 
Biste Dir sicher, dann postet Zrnbot künftig Deine Ankäufe oder Handelsdaten im Chatraum. 
Mit een Befehlen die Zenbot akzeptiert, kannste im Chatraum/Channel ja etwas Herumexperimentieren und Dir sicher werden. 
