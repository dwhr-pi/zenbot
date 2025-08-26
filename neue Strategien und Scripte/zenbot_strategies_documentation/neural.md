# Neural Strategie

## Beschreibung
Die Neural Strategie ist eine fortschrittliche Handelsstrategie, die neuronales Lernen nutzt, um zukünftige Preisbewegungen vorherzusagen. Im Gegensatz zu traditionellen technischen Indikatoren verwendet diese Strategie maschinelles Lernen, um Muster in historischen Preisdaten zu erkennen und darauf basierend Prognosen zu erstellen.

## Funktionsweise
Die Strategie trainiert ein neuronales Netzwerk mit historischen Preisdaten und verwendet dieses Modell, um zukünftige Preise vorherzusagen. Der Kaufalgorithmus vergleicht den Durchschnitt der letzten drei realen Preise mit dem Durchschnitt des aktuellen und des letzten vorhergesagten Preises. Wenn der Durchschnitt der realen Preise niedriger ist als der Durchschnitt der Vorhersagen, wird ein Kaufsignal generiert.

Das neuronale Netzwerk wird kontinuierlich mit neuen Daten trainiert, um seine Vorhersagegenauigkeit zu verbessern. Die Parameter wie Aktivierungstyp, Anzahl der Neuronen und Lernrate können angepasst werden, um die Performance zu optimieren.

## Beste Voreinstellungen
```
--period=1m
--activation_1_type=sigmoid
--neurons_1=1
--depth=1
--min_periods=1000
--min_predict=1
--momentum=0.9
--decay=0.1
--threads=1
--learns=2
```

## Empfohlene Anwendungsfälle
- Märkte mit erkennbaren Mustern oder Zyklen
- Situationen, in denen traditionelle technische Indikatoren nicht ausreichend sind
- Längerfristige Handelsstrategien mit ausreichend Trainingsdaten
- Märkte mit moderater bis hoher Vorhersagbarkeit

## Vorteile
- Kann komplexe, nicht-lineare Muster erkennen, die traditionelle Indikatoren möglicherweise übersehen
- Passt sich durch kontinuierliches Lernen an veränderte Marktbedingungen an
- Kann mehrere Eingabefaktoren berücksichtigen
- Potenziell höhere Genauigkeit bei der Vorhersage von Preisbewegungen

## Nachteile
- Erfordert eine große Menge an historischen Daten für effektives Training
- Rechenintensiver als traditionelle Strategien
- Risiko des Overfittings, wenn nicht richtig konfiguriert
- Die Optimierung der neuronalen Netzwerkparameter erfordert Fachwissen
- Stellen Sie sicher, dass Sie die Poll-Trades-Zeit niedriger als den Periodenwert einstellen
