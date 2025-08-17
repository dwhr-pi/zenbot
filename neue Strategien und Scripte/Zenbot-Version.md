In Zenbot – der quelloffene Trading-Bot auf Basis von Node.js – wird die Version standardmäßig in der Datei package.json definiert. 
Dort findest du typischerweise einen Eintrag wie "version": "...". 
Im offiziellen Archiv (Branch unstable) ist derzeit folgende Version hinterlegt:

```
"name": "zenbot4",
"version": "4.1.0",
```


Zusätzlich ist in den Releases auf GitHub zu sehen, dass die letzte veröffentlichte Version 4.1.4 am 1. Oktober 2018 erschien .

Eine Issue in der Repository-Historie bestätigt auch, dass zumindest bis etwa Ende 2020 die interne Zenbot-Version 4.1.0 genannt wurde .


---

Zusammenfassung

Frage	Antwort

In welcher Datei wird die Version festgelegt?	
In package.json (im Root-Verzeichnis)
Welche Version ist aktuell?	
Version im Code: 4.1.0, zuletzt veröffentlicht: 4.1.4 (Oktober 2018)



---

Wenn du mit dem Bot arbeitest, kannst du die Version auch direkt im Code auslesen, z. B. mit:

```
const { version } = require('./package.json');
console.log(version);
```

oder – wenn du den Prozess via npm start gestartet hast – über die Umgebungsvariable process.env.npm_package_version .


---

Möchtest du mehr über Unterschiede zwischen den Versionen erfahren, wie du auf neuere Forks oder Alternativen zugreifen kannst oder wie du die Version vielleicht statisch im Bot anzeigen lässt?
Sag einfach Bescheid – ich helfe gern weiter!

