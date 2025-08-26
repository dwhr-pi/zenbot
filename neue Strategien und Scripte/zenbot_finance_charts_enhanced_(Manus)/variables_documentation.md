# Dokumentation der Chart-Variablen

Diese Dokumentation beschreibt die Variablen, die in den verschiedenen Finanz-Charts verwendet werden. Sie dient als Referenz für die Anpassung und Integration der Charts in das Zenbot Webinterface.

## 1. Liniendiagramm (1_line_chart.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `labels` | Zeitpunkte (Monate) auf der X-Achse | Array von Strings |
| `datasets[].label` | Name der Aktie/des Datensatzes | String |
| `datasets[].data` | Aktienkurswerte zu den jeweiligen Zeitpunkten | Array von Zahlen |
| `datasets[].borderColor` | Farbe der Linie | String (CSS-Farbwert) |
| `datasets[].tension` | Glättungsfaktor der Linie (0 = keine Glättung) | Zahl (0-1) |
| `datasets[].fill` | Ob der Bereich unter der Linie gefüllt werden soll | Boolean |

### Beispiel:
```javascript
{
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
}
```

## 2. Balkendiagramm (2_bar_chart.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `labels` | Kategorien auf der X-Achse (Geschäftsbereiche) | Array von Strings |
| `datasets[].label` | Bezeichnung des Datensatzes (Quartal) | String |
| `datasets[].data` | Umsatzwerte für jede Kategorie | Array von Zahlen |
| `datasets[].backgroundColor` | Hintergrundfarbe der Balken | String oder Array von Strings |
| `datasets[].borderColor` | Randfarbe der Balken | String oder Array von Strings |
| `datasets[].borderWidth` | Breite des Balkenrands in Pixeln | Zahl |

### Beispiel:
```javascript
{
    labels: ['Retail', 'Online', 'B2B', 'International'],
    datasets: [
        {
            label: 'Q1 2024',
            data: [1200, 1800, 900, 1500],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }
    ]
}
```

## 3. Kerzendiagramm (3_candlestick_chart.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `data[].x` | Datum/Zeitpunkt der Kerze | Date oder String im ISO-Format |
| `data[].o` | Eröffnungskurs (Open) | Zahl |
| `data[].h` | Höchstkurs (High) | Zahl |
| `data[].l` | Tiefstkurs (Low) | Zahl |
| `data[].c` | Schlusskurs (Close) | Zahl |
| `color.up` | Farbe für steigende Kerzen (Schlusskurs > Eröffnungskurs) | String (CSS-Farbwert) |
| `color.down` | Farbe für fallende Kerzen (Schlusskurs < Eröffnungskurs) | String (CSS-Farbwert) |

### Beispiel:
```javascript
{
    datasets: [{
        label: 'Tech AG Aktie',
        data: [
            {x: '2024-01-01', o: 100, h: 110, l: 90, c: 105},
            {x: '2024-01-02', o: 105, h: 115, l: 95, c: 100}
        ],
        color: {
            up: 'rgba(75, 192, 192, 1)',
            down: 'rgba(255, 99, 132, 1)',
        }
    }]
}
```

## 4. Wasserfalldiagramm (4_waterfall_chart.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `labels` | Bezeichnungen der einzelnen Schritte im Wasserfall | Array von Strings |
| `datasets[].data` | Werte für jeden Schritt (positive oder negative Zahlen) | Array von Zahlen |
| `datasets[].backgroundColor` | Hintergrundfarben für die Balken (Start, Positiv, Negativ, Total) | Array von Strings oder Funktion |
| `datasets[].borderColor` | Randfarben für die Balken | Array von Strings oder Funktion |
| `isSummary` | Funktion zur Identifizierung von Summenbalken | Funktion |

### Beispiel:
```javascript
{
    labels: ['Ausgangswert', 'Umsatzsteigerung', 'Materialkosten', 'Personalkosten', 'Endergebnis'],
    datasets: [{
        data: [500, 200, -80, -120, 0], // Der letzte Wert wird automatisch berechnet
        backgroundColor: (context) => {
            const index = context.dataIndex;
            if (isSummary(index)) return 'rgba(75, 192, 192, 0.8)'; // Summen
            return data[index] >= 0 ? 'rgba(54, 162, 235, 0.8)' : 'rgba(255, 99, 132, 0.8)'; // Positiv/negativ
        }
    }]
}
```

## 5. Streudiagramm (5_scatter_plot.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `datasets[].label` | Bezeichnung der Datenreihe/Kategorie | String |
| `datasets[].data` | Array von Punkten mit x- und y-Koordinaten | Array von Objekten {x, y} |
| `datasets[].backgroundColor` | Farbe der Datenpunkte | String oder Array von Strings |
| `datasets[].borderColor` | Randfarbe der Datenpunkte | String oder Array von Strings |
| `datasets[].pointRadius` | Größe der Datenpunkte | Zahl oder Array von Zahlen |
| `datasets[].pointHoverRadius` | Größe der Datenpunkte bei Hover | Zahl oder Array von Zahlen |

### Beispiel:
```javascript
{
    datasets: [
        {
            label: 'Einzelaktien',
            data: [
                { x: 18, y: 12, label: 'Tech AG' },
                { x: 15, y: 10, label: 'Finanz GmbH' }
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointRadius: 8,
            pointHoverRadius: 10
        }
    ]
}
```

## 6. Heatmap (6_heatmap.html)

| Variable | Beschreibung | Datentyp |
|----------|-------------|----------|
| `data` | Array von Objekten mit x, y und v (Wert) Eigenschaften | Array von Objekten {x, y, v} |
| `backgroundColor` | Funktion zur Bestimmung der Farbe basierend auf dem Wert | Funktion |
| `borderColor` | Funktion zur Bestimmung der Randfarbe basierend auf dem Wert | Funktion |
| `width` | Breite jeder Zelle in der Matrix | Zahl |
| `height` | Höhe jeder Zelle in der Matrix | Zahl |

### Beispiel:
```javascript
{
    datasets: [{
        label: 'Korrelationsmatrix',
        data: [
            {x: 0, y: 0, v: 1.00},
            {x: 0, y: 1, v: 0.85},
            {x: 1, y: 0, v: 0.85},
            {x: 1, y: 1, v: 1.00}
        ],
        backgroundColor: function(context) {
            const value = context.dataset.data[context.dataIndex].v;
            return getColor(value); // Funktion zur Farbbestimmung basierend auf dem Wert
        },
        width: 50,
        height: 50
    }]
}
```

## Allgemeine Konfigurationsoptionen

Neben den spezifischen Variablen für jeden Chart-Typ gibt es allgemeine Konfigurationsoptionen, die für alle oder die meisten Charts gelten:

| Option | Beschreibung | Datentyp |
|--------|-------------|----------|
| `responsive` | Ob der Chart responsiv sein soll | Boolean |
| `maintainAspectRatio` | Ob das Seitenverhältnis beibehalten werden soll | Boolean |
| `scales.y.beginAtZero` | Ob die Y-Achse bei Null beginnen soll | Boolean |
| `scales.y.title.text` | Beschriftung der Y-Achse | String |
| `scales.x.title.text` | Beschriftung der X-Achse | String |
| `plugins.title.text` | Titel des Charts | String |
| `plugins.tooltip` | Konfiguration der Tooltips | Objekt |
| `plugins.legend.position` | Position der Legende | String ('top', 'bottom', 'left', 'right') |

### Beispiel:
```javascript
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Umsatz in Tsd. €'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Geschäftsbereich'
            }
        }
    },
    plugins: {
        title: {
            display: true,
            text: 'Quartalsumsätze nach Geschäftsbereich',
            font: {
                size: 18
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false
        },
        legend: {
            position: 'top',
        }
    }
}
```

