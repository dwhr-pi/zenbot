# TensorFlow 2 Beispiel für eine einfache Handelsstrategie

Dieses Dokument beschreibt, wie man TensorFlow 2 für eine einfache Handelsstrategie verwenden kann. Das Ziel ist es, die zukünftige Preisrichtung einer Aktie (ob der Preis steigen oder fallen wird) basierend auf historischen Daten vorherzusagen.

**Wichtiger Hinweis:** Dieses Beispiel dient ausschließlich zu Bildungszwecken. Aktienmärkte sind extrem volatil und unvorhersehbar. Eine erfolgreiche Anwendung in der realen Welt erfordert weitaus komplexere Modelle, mehr Daten und eine rigorose Backtesting-Strategie.

## Einleitung: Was ist das Ziel?

Das Ziel ist es, ein neuronales Netz zu erstellen, das historische Kursdaten analysiert, um vorherzusagen, ob der Kurs am nächsten Tag steigen oder fallen wird. Dies ist ein Klassifikationsproblem (Kaufen/Verkaufen). Für die Vorhersage von Zeitreihen wie Aktienkursen eignen sich besonders gut **Long Short-Term Memory (LSTM)**-Netzwerke, eine spezielle Art von rekurrierendem neuronalem Netz (RNN).

---

## Schritt 1: Die Umgebung einrichten

Zuerst müssen die notwendigen Python-Bibliotheken installiert werden. TensorFlow 2.x wird vorausgesetzt.

```bash
pip install tensorflow pandas numpy scikit-learn yfinance
```

- **TensorFlow:** Das Framework für maschinelles Lernen.
- **Pandas:** Zum Laden und Manipulieren der Finanzdaten.
- **NumPy:** Für numerische Operationen, insbesondere mit Arrays.
- **Scikit-learn:** Zur Datenvorverarbeitung.
- **yfinance:** Um historische Aktienkurse von Yahoo Finance herunterzuladen.

---

## Schritt 2: Daten laden und vorbereiten

Wir laden historische Daten, zum Beispiel für die Apple-Aktie (AAPL), und bereiten sie für das Modell vor.

```python
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from collections import deque
import random

# --- Einstellungen ---
# Ticker-Symbol der Aktie
TICKER = "AAPL"
# Zeitraum für die historischen Daten
START_DATE = "2015-01-01"
END_DATE = "2025-01-01"

# Anzahl der vergangenen Tage, die zur Vorhersage genutzt werden
SEQ_LEN = 60
# Zeithorizont für die Vorhersage (in Tagen)
FUTURE_PERIOD_PREDICT = 3

# --- Daten laden ---
data = yf.download(TICKER, start=START_DATE, end=END_DATE)

# --- Zielvariable erstellen (Target) ---
# Wir wollen vorhersagen, ob der Kurs in `FUTURE_PERIOD_PREDICT` Tagen höher ist
data[f'Future_{FUTURE_PERIOD_PREDICT}D_Close'] = data['Close'].shift(-FUTURE_PERIOD_PREDICT)

# Ziel: 1 für "Preis steigt" (Kaufen), 0 für "Preis fällt" (Verkaufen)
data['Target'] = (data[f'Future_{FUTURE_PERIOD_PREDICT}D_Close'] > data['Close']).astype(int)

# --- Daten für das Modell vorbereiten ---
# Nur die relevanten Spalten behalten und fehlende Werte entfernen
data = data[['Close', 'Volume', 'Target']].dropna()

# Skalieren der Daten zwischen 0 und 1, um dem Modell das Lernen zu erleichtern
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data[['Close', 'Volume']].values)

# --- Sequenzen erstellen ---
# Das LSTM-Netz benötigt Sequenzen aus vergangenen Daten als Input
sequential_data = []
prev_days = deque(maxlen=SEQ_LEN)

for i, row in enumerate(scaled_data):
    prev_days.append(row)
    if len(prev_days) == SEQ_LEN:
        # Sequenz der letzten SEQ_LEN Tage und das zugehörige Target
        sequential_data.append([np.array(prev_days), data['Target'].iloc[i]])

# Mischen der Daten, um eine zufällige Verteilung zu gewährleisten
random.shuffle(sequential_data)

# --- Aufteilen in Trainings- und Testdaten ---
buys = []
sells = []

for seq, target in sequential_data:
    if target == 1:
        buys.append([seq, target])
    else:
        sells.append([seq, target])

# Daten ausbalancieren, damit das Modell nicht einseitig lernt
lower = min(len(buys), len(sells))
buys = buys[:lower]
sells = sells[:lower]

sequential_data = buys + sells
random.shuffle(sequential_data)

# Aufteilen in Features (X) und Labels (y)
X = []
y = []

for seq, target in sequential_data:
    X.append(seq)
    y.append(target)

X = np.array(X)
y = np.array(y)

print(f"Trainingsdaten erstellt: {len(X)} Sequenzen")
```

---

## Schritt 3: Das LSTM-Modell erstellen und trainieren

Jetzt definieren wir die Architektur des neuronalen Netzes mit Keras, der High-Level-API von TensorFlow. Das Modell wird aus mehreren LSTM-Schichten bestehen.

```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization

# --- Modell-Architektur ---
model = Sequential()

# Erste LSTM-Schicht
model.add(LSTM(128, input_shape=(X.shape[1:]), return_sequences=True))
model.add(Dropout(0.2))
model.add(BatchNormalization())

# Zweite LSTM-Schicht
model.add(LSTM(128, return_sequences=True))
model.add(Dropout(0.1))
model.add(BatchNormalization())

# Dritte LSTM-Schicht
model.add(LSTM(128))
model.add(Dropout(0.2))
model.add(BatchNormalization())

# Dense-Schicht (vollständig verbundene Schicht)
model.add(Dense(32, activation='relu'))
model.add(Dropout(0.2))

# Output-Schicht
# 'sigmoid' für eine binäre Klassifikation (0 oder 1)
model.add(Dense(1, activation='sigmoid'))

# --- Modell kompilieren ---
# Optimizer, der die Gewichte des Modells anpasst
opt = tf.keras.optimizers.Adam(learning_rate=0.001, decay=1e-6)

model.compile(
    loss='binary_crossentropy',
    optimizer=opt,
    metrics=['accuracy']
)

# Modellzusammenfassung anzeigen
model.summary()

# --- Modell trainieren ---
# Aufteilen der Daten in Trainings- und Validierungssets
split_ratio = 0.9
split_index = int(len(X) * split_ratio)

train_X, test_X = X[:split_index], X[split_index:]
train_y, test_y = y[:split_index], y[split_index:]

history = model.fit(
    train_X, train_y,
    batch_size=64,
    epochs=10,
    validation_data=(test_X, test_y)
)
```

### Erklärung der Komponenten:
*   **Sequential:** Ein linearer Stapel von Schichten.
*   **LSTM:** Die Kernschicht für die Analyse von Zeitreihen. `return_sequences=True` ist notwendig, wenn die nächste Schicht wieder eine LSTM-Schicht ist.
*   **Dropout:** Eine Technik, um Overfitting zu verhindern, indem zufällig Neuronen während des Trainings "ausgeschaltet" werden.
*   **BatchNormalization:** Stabilisiert und beschleunigt den Trainingsprozess.
*   **Dense:** Eine reguläre, tief verbundene neuronale Netzwerkschicht.
*   **Activation ('relu', 'sigmoid'):** Aktivierungsfunktionen, die bestimmen, ob ein Neuron feuern soll. 'Sigmoid' ist ideal für die Ausgabe einer Wahrscheinlichkeit zwischen 0 und 1.
*   **Compile:** Konfiguriert das Modell für das Training. `binary_crossentropy` ist die passende Verlustfunktion für ein binäres Klassifikationsproblem.
*   **Fit:** Startet den Trainingsprozess.

---

## Schritt 4: Ergebnisse bewerten

Nach dem Training können wir die Genauigkeit des Modells auf den Testdaten bewerten.

```python
# Bewertung des Modells
score = model.evaluate(test_X, test_y, verbose=0)
print(f'Test loss: {score}')
print(f'Test accuracy: {score}')
```

Die Genauigkeit gibt an, wie oft das Modell die Preisrichtung korrekt vorhergesagt hat. Ein Wert über 0.5 (50 %) bedeutet, dass das Modell besser als zufälliges Raten ist. Professionelle Modelle erreichen oft nur geringfügig höhere Werte, die aber durch die Masse an Trades profitabel sein können.

https://github.com/stefan-jansen/machine-learning-for-trading  
https://github.com/dwhr-pi/machine-learning-for-trading  
[Simplylearn -Generative AI - Full course](https://youtu.be/JFxfm-wYUN4?si=T0wCxnWcU9jEbSzy)  

