// LSTM-Modell mit TensorFlow.js für Zeitreihenprognosen
// Verantwortlich für die Vorhersage von Preisbewegungen basierend auf historischen Daten

class LSTMModel {
  constructor(config = {}) {
    // TensorFlow.js wird dynamisch importiert
    this.tf = null;
    
    // Modellkonfiguration
    this.inputShape = config.inputShape || [50, 1]; // [Zeitschritte, Features]
    this.outputSize = config.outputSize || 1;
    this.learningRate = config.learningRate || 0.001;
    this.epochs = config.epochs || 100;
    this.batchSize = config.batchSize || 32;
    this.validationSplit = config.validationSplit || 0.2;
    
    // LSTM-Architektur
    this.lstmLayers = config.lstmLayers || [
      { units: 100, returnSequences: true },
      { units: 50, returnSequences: false }
    ];
    
    // Dropout für Regularisierung
    this.dropoutRate = config.dropoutRate || 0.2;
    
    // Modellinstanz
    this.model = null;
    
    // Trainingsverlauf
    this.history = null;
    
    // Metadaten für Denormalisierung
    this.metadata = null;
  }

  /**
   * Initialisiert TensorFlow.js und erstellt das Modell
   */
  async initialize() {
    try {
      // Dynamischer Import von TensorFlow.js
      this.tf = await import('@tensorflow/tfjs');
      console.log('TensorFlow.js initialized:', this.tf.version.tfjs);
      
      // Modell erstellen
      this.buildModel();
      
      return true;
    } catch (error) {
      console.error('Error initializing TensorFlow.js:', error);
      throw error;
    }
  }

  /**
   * Erstellt das LSTM-Modell mit der angegebenen Architektur
   */
  buildModel() {
    if (!this.tf) {
      throw new Error('TensorFlow.js not initialized. Call initialize() first.');
    }
    
    // Sequentielles Modell erstellen
    this.model = this.tf.sequential();
    
    // Erste LSTM-Schicht mit Input-Shape
    this.model.add(this.tf.layers.lstm({
      inputShape: this.inputShape,
      units: this.lstmLayers[0].units,
      returnSequences: this.lstmLayers[0].returnSequences
    }));
    
    // Dropout nach der ersten Schicht
    this.model.add(this.tf.layers.dropout(this.dropoutRate));
    
    // Weitere LSTM-Schichten hinzufügen
    for (let i = 1; i < this.lstmLayers.length; i++) {
      this.model.add(this.tf.layers.lstm({
        units: this.lstmLayers[i].units,
        returnSequences: this.lstmLayers[i].returnSequences
      }));
      
      // Dropout nach jeder Schicht außer der letzten
      if (i < this.lstmLayers.length - 1) {
        this.model.add(this.tf.layers.dropout(this.dropoutRate));
      }
    }
    
    // Ausgabeschicht
    this.model.add(this.tf.layers.dense({
      units: this.outputSize,
      activation: 'linear'
    }));
    
    // Modell kompilieren
    this.model.compile({
      optimizer: this.tf.train.adam(this.learningRate),
      loss: 'meanSquaredError',
      metrics: ['mse', 'mae']
    });
    
    // Modellzusammenfassung ausgeben
    this.model.summary();
    
    return this.model;
  }

  /**
   * Konvertiert Daten in TensorFlow.js-Tensoren
   * @param {Array} sequences - Eingabesequenzen
   * @param {Array} targets - Zielwerte
   * @returns {Object} - Tensor-Objekte für Training
   */
  prepareData(sequences, targets) {
    if (!this.tf) {
      throw new Error('TensorFlow.js not initialized. Call initialize() first.');
    }
    
    // Konvertieren der Eingabesequenzen in einen 3D-Tensor [Samples, Timesteps, Features]
    const xs = this.tf.tensor3d(sequences);
    
    // Konvertieren der Zielwerte in einen 2D-Tensor [Samples, OutputSize]
    const ys = this.tf.tensor2d(targets);
    
    return { xs, ys };
  }

  /**
   * Trainiert das Modell mit den bereitgestellten Daten
   * @param {Array} sequences - Eingabesequenzen
   * @param {Array} targets - Zielwerte
   * @param {Object} metadata - Metadaten für Denormalisierung
   * @returns {Object} - Trainingsverlauf
   */
  async train(sequences, targets, metadata = null) {
    if (!this.model) {
      throw new Error('Model not built. Call buildModel() first.');
    }
    
    // Metadaten speichern
    this.metadata = metadata;
    
    // Daten vorbereiten
    const { xs, ys } = this.prepareData(sequences, targets);
    
    // Callbacks für Trainingsfortschritt
    const callbacks = {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}/${this.epochs}: loss = ${logs.loss.toFixed(4)}, mse = ${logs.mse.toFixed(4)}`);
      }
    };
    
    // Modell trainieren
    this.history = await this.model.fit(xs, ys, {
      epochs: this.epochs,
      batchSize: this.batchSize,
      validationSplit: this.validationSplit,
      shuffle: true,
      callbacks: callbacks
    });
    
    // Tensoren freigeben
    xs.dispose();
    ys.dispose();
    
    return this.history;
  }

  /**
   * Führt Vorhersagen mit dem trainierten Modell durch
   * @param {Array} sequence - Eingabesequenz
   * @returns {Array} - Vorhersagewerte
   */
  async predict(sequence) {
    if (!this.model) {
      throw new Error('Model not trained. Call train() first.');
    }
    
    // Eingabesequenz in einen Tensor konvertieren
    const input = this.tf.tensor3d([sequence]);
    
    // Vorhersage durchführen
    const prediction = this.model.predict(input);
    
    // Vorhersage in ein Array konvertieren
    const result = await prediction.array();
    
    // Tensoren freigeben
    input.dispose();
    prediction.dispose();
    
    return result[0];
  }

  /**
   * Denormalisiert Vorhersagewerte zurück in den ursprünglichen Wertebereich
   * @param {Array} normalizedPrediction - Normalisierte Vorhersage
   * @param {string} feature - Feature-Name (z.B. 'close')
   * @returns {Array} - Denormalisierte Vorhersage
   */
  denormalizePrediction(normalizedPrediction, feature = 'close') {
    if (!this.metadata || !this.metadata.min || !this.metadata.max) {
      throw new Error('Metadata not available. Cannot denormalize prediction.');
    }
    
    const min = this.metadata.min[feature];
    const max = this.metadata.max[feature];
    
    return normalizedPrediction.map(value => value * (max - min) + min);
  }

  /**
   * Speichert das trainierte Modell
   * @param {string} path - Pfad zum Speichern des Modells
   * @returns {Promise} - Speichervorgang
   */
  async saveModel(path) {
    if (!this.model) {
      throw new Error('No model to save. Train a model first.');
    }
    
    try {
      await this.model.save(`file://${path}`);
      console.log(`Model saved to ${path}`);
      return true;
    } catch (error) {
      console.error('Error saving model:', error);
      throw error;
    }
  }

  /**
   * Lädt ein vortrainiertes Modell
   * @param {string} path - Pfad zum gespeicherten Modell
   * @returns {Promise} - Ladevorgang
   */
  async loadModel(path) {
    if (!this.tf) {
      throw new Error('TensorFlow.js not initialized. Call initialize() first.');
    }
    
    try {
      this.model = await this.tf.loadLayersModel(`file://${path}`);
      console.log(`Model loaded from ${path}`);
      
      // Modell kompilieren
      this.model.compile({
        optimizer: this.tf.train.adam(this.learningRate),
        loss: 'meanSquaredError',
        metrics: ['mse', 'mae']
      });
      
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  /**
   * Evaluiert das Modell mit Testdaten
   * @param {Array} testSequences - Testsequenzen
   * @param {Array} testTargets - Testzielwerte
   * @returns {Object} - Evaluierungsergebnisse
   */
  async evaluate(testSequences, testTargets) {
    if (!this.model) {
      throw new Error('Model not trained. Call train() first.');
    }
    
    // Testdaten vorbereiten
    const { xs, ys } = this.prepareData(testSequences, testTargets);
    
    // Modell evaluieren
    const evaluation = await this.model.evaluate(xs, ys);
    
    // Ergebnisse extrahieren
    const loss = await evaluation[0].dataSync()[0];
    const mse = await evaluation[1].dataSync()[0];
    const mae = await evaluation[2].dataSync()[0];
    
    // Tensoren freigeben
    xs.dispose();
    ys.dispose();
    evaluation.forEach(tensor => tensor.dispose());
    
    return { loss, mse, mae };
  }

  /**
   * Führt eine Zeitreihenprognose für mehrere Schritte in die Zukunft durch
   * @param {Array} initialSequence - Anfangssequenz
   * @param {number} steps - Anzahl der Vorhersageschritte
   * @returns {Array} - Vorhersagen für mehrere Schritte
   */
  async forecast(initialSequence, steps = 5) {
    if (!this.model) {
      throw new Error('Model not trained. Call train() first.');
    }
    
    // Kopie der Anfangssequenz erstellen
    let currentSequence = JSON.parse(JSON.stringify(initialSequence));
    const predictions = [];
    
    // Schrittweise Vorhersagen durchführen
    for (let i = 0; i < steps; i++) {
      // Vorhersage für den aktuellen Schritt
      const prediction = await this.predict(currentSequence);
      predictions.push(prediction[0]);
      
      // Sequenz für den nächsten Schritt aktualisieren
      currentSequence.shift(); // Ersten Zeitschritt entfernen
      
      // Letzten Zeitschritt hinzufügen (mit allen Features)
      const lastTimeStep = currentSequence[currentSequence.length - 1].slice();
      lastTimeStep[0] = prediction[0]; // Vorhersage als erstes Feature
      currentSequence.push(lastTimeStep);
    }
    
    return predictions;
  }
}

module.exports = LSTMModel;
