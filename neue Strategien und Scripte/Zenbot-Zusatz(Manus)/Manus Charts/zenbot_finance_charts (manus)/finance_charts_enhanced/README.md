# Finanz-Charts für Zenbot

Diese Sammlung enthält interaktive Finanz-Charts, die für das Webinterface von Zenbot verwendet werden können. Alle Charts sind mit Chart.js implementiert und bieten eine responsive, interaktive Darstellung verschiedener Finanzinformationen.

## Enthaltene Chart-Typen

1. **Liniendiagramm** (`1_line_chart.html`)
   - Visualisiert Trends und Veränderungen im Zeitverlauf
   - Ideal für Aktienkurse, Einnahmen, Gewinne oder Cashflows
   - Beispiel zeigt den Kursverlauf mehrerer Aktien über 12 Monate

2. **Balkendiagramm** (`2_bar_chart.html`)
   - Vergleicht Kennzahlen über verschiedene Kategorien hinweg
   - Nützlich für Einnahmen nach Produktlinien oder Ausgaben nach Abteilungen
   - Beispiel zeigt Quartalsumsätze nach Geschäftsbereichen

3. **Kerzendiagramm** (`3_candlestick_chart.html`)
   - Zeigt Eröffnungs-, Schluss-, Höchst- und Tiefstpreise von Finanzinstrumenten
   - Beliebt für die Darstellung der Marktpsychologie und technische Analyse
   - Beispiel zeigt den Kursverlauf einer Aktie über einen Monat

4. **Wasserfalldiagramm** (`4_waterfall_chart.html`)
   - Zeigt, wie ein Anfangswert durch verschiedene positive und negative Faktoren beeinflusst wird
   - Nützlich für Performanceanalysen, Bestandsprüfungen oder Nettogewinnberechnungen
   - Beispiel zeigt die Entwicklung des Betriebsergebnisses

5. **Streudiagramm** (`5_scatter_plot.html`)
   - Trägt zwei Variablen gegeneinander auf, um Muster oder Korrelationen zu erkennen
   - Beispiel zeigt die Beziehung zwischen Risiko und Rendite für verschiedene Anlagen

6. **Heatmap** (`6_heatmap.html`)
   - Stellt Daten durch Farben dar
   - Häufig verwendet für Korrelationsmatrizen oder Veränderungen über Zeiträume/Sektoren
   - Beispiel zeigt die Korrelation zwischen verschiedenen Anlageklassen

## Verwendung

1. Öffnen Sie `index.html` in einem Webbrowser, um eine Übersicht aller verfügbaren Charts zu sehen
2. Klicken Sie auf die Links, um die einzelnen Charts anzuzeigen
3. Jeder Chart enthält eine detaillierte Beschreibung und Dokumentation der verwendeten Variablen

## Integration in Zenbot

Um diese Charts in das Zenbot Webinterface zu integrieren:

1. Kopieren Sie die benötigten HTML-Dateien in Ihr Zenbot-Projekt
2. Binden Sie die Chart.js-Bibliothek ein (bereits in den HTML-Dateien verlinkt)
3. Passen Sie die Datenquellen an, um echte Daten aus Zenbot zu verwenden
4. Passen Sie bei Bedarf das Styling an Ihr Zenbot-Design an

## Variablen und Anpassung

Jeder Chart enthält eine detaillierte Dokumentation der verwendeten Variablen direkt in der HTML-Datei. Diese Dokumentation umfasst:

- Beschreibung der Variablen
- Datentypen
- Verwendungszweck

Diese Informationen erleichtern die Anpassung der Charts an Ihre spezifischen Anforderungen und Datenquellen.

## Abhängigkeiten

- Chart.js (Hauptbibliothek für alle Charts)
- chartjs-chart-financial (für Kerzendiagramme)
- chartjs-chart-matrix (für Heatmaps)
- Luxon und chartjs-adapter-luxon (für Zeitachsen)

Alle Abhängigkeiten werden über CDN geladen und müssen nicht separat installiert werden.

