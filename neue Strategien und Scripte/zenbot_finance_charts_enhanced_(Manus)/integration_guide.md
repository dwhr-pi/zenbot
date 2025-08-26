# Leitfaden zur Integration der Finanz-Charts in Zenbot

Dieser Leitfaden beschreibt, wie die bereitgestellten Finanz-Charts in das Zenbot Webinterface integriert werden können. Er enthält Schritt-für-Schritt-Anleitungen und Beispiele für die Anpassung der Charts an Ihre spezifischen Anforderungen.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Einfache Integration](#einfache-integration)
3. [Anpassung der Charts an Echtzeitdaten](#anpassung-der-charts-an-echtzeitdaten)
4. [Styling und Anpassung an das Zenbot-Design](#styling-und-anpassung-an-das-zenbot-design)
5. [Erweiterte Funktionen](#erweiterte-funktionen)
6. [Fehlerbehebung](#fehlerbehebung)

## Voraussetzungen

Bevor Sie mit der Integration beginnen, stellen Sie sicher, dass folgende Voraussetzungen erfüllt sind:

- Zugriff auf den Quellcode des Zenbot Webinterfaces
- Grundkenntnisse in HTML, CSS und JavaScript
- Verständnis der Datenstruktur von Zenbot

## Einfache Integration

### Schritt 1: Einbinden der Chart.js-Bibliothek

Fügen Sie die Chart.js-Bibliothek in Ihre Hauptseite ein:

```html
<head>
    <!-- Bestehende Head-Elemente -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Für Kerzendiagramme -->
    <script src="https://cdn.jsdelivr.net/npm/luxon@2.0.2"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.0.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.1.1"></script>
    
    <!-- Für Heatmaps -->
    <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@1.1.1"></script>
</head>
```

### Schritt 2: HTML-Struktur vorbereiten

Erstellen Sie Container für Ihre Charts in der gewünschten Seite:

```html
<div class="chart-container">
    <canvas id="line-chart"></canvas>
</div>

<div class="chart-container">
    <canvas id="bar-chart"></canvas>
</div>

<!-- Weitere Chart-Container nach Bedarf -->
```

### Schritt 3: CSS-Styling hinzufügen

Fügen Sie das folgende CSS hinzu, um die Chart-Container zu stylen:

```css
.chart-container {
    width: 800px;
    height: 500px;
    margin: 20px auto;
}

@media (max-width: 900px) {
    .chart-container {
        width: 100%;
        height: 400px;
    }
}
```

### Schritt 4: JavaScript-Code für die Charts einbinden

Kopieren Sie den JavaScript-Code aus den bereitgestellten HTML-Dateien und passen Sie ihn an:

```javascript
// Liniendiagramm
const lineCtx = document.getElementById('line-chart').getContext('2d');
new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'Tech AG',
                data: [100, 105, 102, 110, 115, 112, 120, 125, 130, 128, 135, 140],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.2,
                fill: false
            }
        ]
    },
    options: {
        // Optionen aus den Beispieldateien übernehmen
    }
});

// Weitere Charts nach Bedarf
```

## Anpassung der Charts an Echtzeitdaten

### Daten aus Zenbot API abrufen

```javascript
async function fetchZenbotData(endpoint) {
    try {
        const response = await fetch(`/api/${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return null;
    }
}

// Beispiel: Aktienkursdaten abrufen und Liniendiagramm aktualisieren
async function updateStockChart() {
    const stockData = await fetchZenbotData('stocks/history');
    
    if (stockData) {
        // Chart-Daten aktualisieren
        lineChart.data.labels = stockData.dates;
        lineChart.data.datasets[0].data = stockData.prices;
        lineChart.update();
    }
}

// Regelmäßige Aktualisierung
setInterval(updateStockChart, 60000); // Alle 60 Sekunden aktualisieren
```

### Dynamische Chart-Erstellung basierend auf Benutzereingaben

```javascript
function createChartFromUserSelection() {
    const selectedStock = document.getElementById('stock-selector').value;
    const timeframe = document.getElementById('timeframe-selector').value;
    
    fetchZenbotData(`stocks/${selectedStock}/history?timeframe=${timeframe}`)
        .then(data => {
            // Bestehenden Chart löschen, falls vorhanden
            if (window.currentChart) {
                window.currentChart.destroy();
            }
            
            // Neuen Chart erstellen
            const ctx = document.getElementById('dynamic-chart').getContext('2d');
            window.currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.dates,
                    datasets: [{
                        label: selectedStock,
                        data: data.prices,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.2,
                        fill: false
                    }]
                },
                options: {
                    // Optionen hier
                }
            });
        });
}

// Event-Listener für Benutzerinteraktionen
document.getElementById('update-chart-btn').addEventListener('click', createChartFromUserSelection);
```

## Styling und Anpassung an das Zenbot-Design

### Farbschema anpassen

Definieren Sie ein konsistentes Farbschema, das zum Zenbot-Design passt:

```javascript
// Farbschema für Charts
const zenbotColors = {
    primary: 'rgba(54, 162, 235, 1)',
    primaryLight: 'rgba(54, 162, 235, 0.2)',
    secondary: 'rgba(255, 99, 132, 1)',
    secondaryLight: 'rgba(255, 99, 132, 0.2)',
    tertiary: 'rgba(75, 192, 192, 1)',
    tertiaryLight: 'rgba(75, 192, 192, 0.2)',
    positive: 'rgba(75, 192, 192, 1)',
    negative: 'rgba(255, 99, 132, 1)',
    neutral: 'rgba(201, 203, 207, 1)'
};

// Verwendung im Chart
new Chart(ctx, {
    // ...
    data: {
        datasets: [{
            borderColor: zenbotColors.primary,
            backgroundColor: zenbotColors.primaryLight,
            // ...
        }]
    }
    // ...
});
```

### Globale Chart.js-Konfiguration

Definieren Sie globale Standardeinstellungen für alle Charts:

```javascript
Chart.defaults.font.family = "'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.font.size = 14;
Chart.defaults.color = '#666';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
Chart.defaults.plugins.legend.position = 'top';
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.plugins.title.color = '#333';
```

## Erweiterte Funktionen

### Interaktive Zeitraumauswahl

```javascript
// HTML
<div class="timeframe-selector">
    <button data-timeframe="1d" class="active">1 Tag</button>
    <button data-timeframe="1w">1 Woche</button>
    <button data-timeframe="1m">1 Monat</button>
    <button data-timeframe="3m">3 Monate</button>
    <button data-timeframe="1y">1 Jahr</button>
    <button data-timeframe="all">Alle</button>
</div>

// JavaScript
document.querySelectorAll('.timeframe-selector button').forEach(button => {
    button.addEventListener('click', function() {
        // Aktiven Button markieren
        document.querySelectorAll('.timeframe-selector button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Daten für den ausgewählten Zeitraum laden
        const timeframe = this.getAttribute('data-timeframe');
        updateChartWithTimeframe(timeframe);
    });
});

async function updateChartWithTimeframe(timeframe) {
    const data = await fetchZenbotData(`stocks/history?timeframe=${timeframe}`);
    // Chart aktualisieren
    // ...
}
```

### Vergleich mehrerer Aktien oder Indikatoren

```javascript
// HTML
<div class="stock-selector">
    <label><input type="checkbox" value="AAPL" checked> Apple</label>
    <label><input type="checkbox" value="MSFT"> Microsoft</label>
    <label><input type="checkbox" value="GOOGL"> Google</label>
    <label><input type="checkbox" value="AMZN"> Amazon</label>
</div>
<button id="compare-stocks">Vergleichen</button>

// JavaScript
document.getElementById('compare-stocks').addEventListener('click', async function() {
    const selectedStocks = Array.from(document.querySelectorAll('.stock-selector input:checked'))
        .map(input => input.value);
    
    if (selectedStocks.length === 0) return;
    
    // Daten für alle ausgewählten Aktien laden
    const datasets = [];
    for (const stock of selectedStocks) {
        const data = await fetchZenbotData(`stocks/${stock}/history`);
        datasets.push({
            label: stock,
            data: data.prices,
            borderColor: getColorForStock(stock),
            backgroundColor: getBackgroundColorForStock(stock),
            tension: 0.2,
            fill: false
        });
    }
    
    // Chart aktualisieren
    comparisonChart.data.datasets = datasets;
    comparisonChart.data.labels = data.dates; // Alle Aktien sollten die gleichen Zeitpunkte haben
    comparisonChart.update();
});

function getColorForStock(stockSymbol) {
    // Farbzuordnung für verschiedene Aktien
    const colorMap = {
        'AAPL': 'rgba(255, 99, 132, 1)',
        'MSFT': 'rgba(54, 162, 235, 1)',
        'GOOGL': 'rgba(255, 206, 86, 1)',
        'AMZN': 'rgba(75, 192, 192, 1)'
    };
    return colorMap[stockSymbol] || 'rgba(201, 203, 207, 1)';
}
```

## Fehlerbehebung

### Häufige Probleme und Lösungen

#### Problem: Charts werden nicht angezeigt

**Mögliche Ursachen und Lösungen:**
- Überprüfen Sie, ob die Chart.js-Bibliothek korrekt geladen wird
- Stellen Sie sicher, dass die Canvas-Elemente korrekte IDs haben
- Überprüfen Sie die Konsole auf JavaScript-Fehler
- Stellen Sie sicher, dass die Container-Elemente eine Höhe haben

#### Problem: Daten werden nicht korrekt angezeigt

**Mögliche Ursachen und Lösungen:**
- Überprüfen Sie das Format der Daten aus der API
- Stellen Sie sicher, dass Datumsformate korrekt konvertiert werden
- Überprüfen Sie, ob die Daten im erwarteten Format vorliegen

#### Problem: Kerzendiagramm wird nicht angezeigt

**Mögliche Ursachen und Lösungen:**
- Stellen Sie sicher, dass die zusätzlichen Bibliotheken geladen sind:
  - chartjs-chart-financial
  - luxon
  - chartjs-adapter-luxon
- Überprüfen Sie, ob das Financial-Chart-Plugin korrekt registriert wurde:
  ```javascript
  Chart.register(window.ChartjsFinancial);
  ```

### Debugging-Tipps

- Verwenden Sie `console.log()`, um Daten und Variablen zu überprüfen
- Nutzen Sie die Browser-Entwicklertools, um DOM-Elemente und Netzwerkanfragen zu inspizieren
- Testen Sie die Charts mit statischen Daten, bevor Sie dynamische Daten integrieren

## Zusammenfassung

Die Integration der Finanz-Charts in das Zenbot Webinterface erfordert folgende Schritte:

1. Einbinden der erforderlichen Bibliotheken
2. Vorbereiten der HTML-Struktur
3. Hinzufügen von CSS-Styling
4. Implementieren des JavaScript-Codes für die Charts
5. Anpassen der Charts an Echtzeitdaten aus der Zenbot API
6. Styling und Anpassung an das Zenbot-Design
7. Hinzufügen erweiterter Funktionen nach Bedarf

Durch Befolgen dieser Anleitung können Sie die bereitgestellten Finanz-Charts erfolgreich in Ihr Zenbot Webinterface integrieren und an Ihre spezifischen Anforderungen anpassen.

