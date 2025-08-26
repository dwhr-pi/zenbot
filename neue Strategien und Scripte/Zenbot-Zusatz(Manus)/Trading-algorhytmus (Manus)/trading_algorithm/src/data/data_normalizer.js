// Datenvorverarbeitung und Feature-Engineering für den Trading-Algorithmus
// Verantwortlich für die Normalisierung und Transformation von Markt- und Blockchain-Daten

class DataNormalizer {
  constructor(config = {}) {
    this.windowSize = config.windowSize || 50; // Standardfenstergröße für gleitende Durchschnitte
    this.featureScaling = config.featureScaling || 'minmax'; // Standardskalierungsmethode
    this.cache = new Map(); // Cache für berechnete Statistiken
  }

  /**
   * Normalisiert einen Datensatz mit Min-Max-Skalierung
   * @param {Array<number>} data - Zu normalisierende Daten
   * @param {number} min - Minimaler Wert (optional, wird berechnet wenn nicht angegeben)
   * @param {number} max - Maximaler Wert (optional, wird berechnet wenn nicht angegeben)
   * @returns {Array<number>} - Normalisierte Daten im Bereich [0,1]
   */
  minMaxNormalize(data, min = null, max = null) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // Min und Max berechnen, falls nicht angegeben
    const dataMin = min !== null ? min : Math.min(...data);
    const dataMax = max !== null ? max : Math.max(...data);
    
    // Vermeidung von Division durch Null
    if (dataMax === dataMin) {
      return data.map(() => 0.5); // Alle Werte auf 0.5 setzen, wenn keine Varianz
    }
    
    // Min-Max-Normalisierung anwenden
    return data.map(value => (value - dataMin) / (dataMax - dataMin));
  }

  /**
   * Normalisiert einen Datensatz mit Z-Score-Normalisierung
   * @param {Array<number>} data - Zu normalisierende Daten
   * @param {number} mean - Mittelwert (optional, wird berechnet wenn nicht angegeben)
   * @param {number} std - Standardabweichung (optional, wird berechnet wenn nicht angegeben)
   * @returns {Array<number>} - Z-Score-normalisierte Daten
   */
  zScoreNormalize(data, mean = null, std = null) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // Mittelwert berechnen, falls nicht angegeben
    const dataMean = mean !== null ? mean : data.reduce((sum, value) => sum + value, 0) / data.length;
    
    // Standardabweichung berechnen, falls nicht angegeben
    let dataStd = std;
    if (dataStd === null) {
      const squaredDiffs = data.map(value => Math.pow(value - dataMean, 2));
      const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / data.length;
      dataStd = Math.sqrt(variance);
    }
    
    // Vermeidung von Division durch Null
    if (dataStd === 0) {
      return data.map(() => 0); // Alle Werte auf 0 setzen, wenn keine Varianz
    }
    
    // Z-Score-Normalisierung anwenden
    return data.map(value => (value - dataMean) / dataStd);
  }

  /**
   * Normalisiert einen Datensatz mit der angegebenen Methode
   * @param {Array<number>} data - Zu normalisierende Daten
   * @param {string} method - Normalisierungsmethode ('minmax' oder 'zscore')
   * @param {Object} params - Zusätzliche Parameter für die Normalisierung
   * @returns {Array<number>} - Normalisierte Daten
   */
  normalizeData(data, method = this.featureScaling, params = {}) {
    switch (method.toLowerCase()) {
      case 'minmax':
        return this.minMaxNormalize(data, params.min, params.max);
      case 'zscore':
        return this.zScoreNormalize(data, params.mean, params.std);
      default:
        throw new Error(`Unknown normalization method: ${method}`);
    }
  }

  /**
   * Berechnet den gleitenden Durchschnitt für einen Datensatz
   * @param {Array<number>} data - Eingabedaten
   * @param {number} windowSize - Fenstergröße für den gleitenden Durchschnitt
   * @returns {Array<number>} - Gleitender Durchschnitt
   */
  calculateSMA(data, windowSize = this.windowSize) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    if (windowSize <= 0 || windowSize > data.length) {
      throw new Error(`Invalid window size: ${windowSize}`);
    }

    const result = [];
    
    // Berechnung des gleitenden Durchschnitts
    for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);
      const average = window.reduce((sum, value) => sum + value, 0) / windowSize;
      result.push(average);
    }
    
    return result;
  }

  /**
   * Berechnet den exponentiell gewichteten gleitenden Durchschnitt
   * @param {Array<number>} data - Eingabedaten
   * @param {number} alpha - Glättungsfaktor (0 < alpha <= 1)
   * @returns {Array<number>} - Exponentiell gewichteter gleitender Durchschnitt
   */
  calculateEMA(data, alpha = 0.2) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    if (alpha <= 0 || alpha > 1) {
      throw new Error(`Invalid alpha value: ${alpha}`);
    }

    const result = [data[0]]; // Erster Wert ist gleich dem ersten Datenpunkt
    
    // Berechnung des EMA
    for (let i = 1; i < data.length; i++) {
      const ema = alpha * data[i] + (1 - alpha) * result[i - 1];
      result.push(ema);
    }
    
    return result;
  }

  /**
   * Berechnet die prozentuale Veränderung zwischen aufeinanderfolgenden Werten
   * @param {Array<number>} data - Eingabedaten
   * @returns {Array<number>} - Prozentuale Veränderungen
   */
  calculatePercentageChange(data) {
    if (!Array.isArray(data) || data.length <= 1) {
      throw new Error('Data must be an array with at least 2 elements');
    }

    const result = [0]; // Erster Wert ist 0, da keine vorherige Referenz existiert
    
    for (let i = 1; i < data.length; i++) {
      if (data[i - 1] === 0) {
        result.push(0); // Vermeidung von Division durch Null
      } else {
        const change = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
        result.push(change);
      }
    }
    
    return result;
  }

  /**
   * Erstellt Zeitfenster für Sequenzvorhersagen
   * @param {Array<number>} data - Eingabedaten
   * @param {number} windowSize - Fenstergröße
   * @param {number} horizon - Vorhersagehorizont (Anzahl der zukünftigen Zeitschritte)
   * @returns {Array<Object>} - Array von Objekten mit Eingabe- und Zielsequenzen
   */
  createTimeWindows(data, windowSize = this.windowSize, horizon = 1) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    if (windowSize <= 0 || windowSize >= data.length) {
      throw new Error(`Invalid window size: ${windowSize}`);
    }

    if (horizon <= 0) {
      throw new Error(`Invalid horizon: ${horizon}`);
    }

    const windows = [];
    
    // Erstellen der Zeitfenster
    for (let i = 0; i <= data.length - windowSize - horizon; i++) {
      const inputWindow = data.slice(i, i + windowSize);
      const targetWindow = data.slice(i + windowSize, i + windowSize + horizon);
      
      windows.push({
        input: inputWindow,
        target: targetWindow
      });
    }
    
    return windows;
  }

  /**
   * Bereitet Daten für LSTM-Modelle vor
   * @param {Array<Object>} candles - Kerzen-Daten (OHLCV)
   * @param {Array<string>} features - Zu verwendende Features (z.B. ['close', 'volume'])
   * @param {number} windowSize - Fenstergröße
   * @param {number} horizon - Vorhersagehorizont
   * @returns {Object} - Vorbereitete Daten für LSTM-Training
   */
  prepareLSTMData(candles, features = ['close'], windowSize = this.windowSize, horizon = 1) {
    if (!Array.isArray(candles) || candles.length === 0) {
      throw new Error('Candles must be a non-empty array');
    }

    // Extrahieren der angegebenen Features
    const featureData = {};
    features.forEach(feature => {
      if (!candles[0].hasOwnProperty(feature)) {
        throw new Error(`Feature not found in candle data: ${feature}`);
      }
      
      featureData[feature] = candles.map(candle => candle[feature]);
    });
    
    // Normalisieren der Features
    const normalizedFeatures = {};
    features.forEach(feature => {
      normalizedFeatures[feature] = this.normalizeData(featureData[feature]);
    });
    
    // Erstellen der Zeitfenster für jedes Feature
    const featureWindows = {};
    features.forEach(feature => {
      featureWindows[feature] = this.createTimeWindows(
        normalizedFeatures[feature],
        windowSize,
        horizon
      );
    });
    
    // Kombinieren der Features zu Trainingssequenzen
    const sequences = [];
    const targets = [];
    
    // Anzahl der Fenster (sollte für alle Features gleich sein)
    const numWindows = featureWindows[features[0]].length;
    
    for (let i = 0; i < numWindows; i++) {
      // Für jedes Zeitfenster ein mehrdimensionales Feature-Array erstellen
      const inputSequence = [];
      
      for (let j = 0; j < windowSize; j++) {
        const timeStep = [];
        
        features.forEach(feature => {
          timeStep.push(featureWindows[feature][i].input[j]);
        });
        
        inputSequence.push(timeStep);
      }
      
      // Zielwert (normalerweise der Close-Preis)
      const targetValue = featureWindows[features[0]][i].target;
      
      sequences.push(inputSequence);
      targets.push(targetValue);
    }
    
    return {
      sequences,
      targets,
      // Metadaten für die spätere Denormalisierung
      metadata: {
        features,
        min: features.reduce((obj, feature) => {
          obj[feature] = Math.min(...featureData[feature]);
          return obj;
        }, {}),
        max: features.reduce((obj, feature) => {
          obj[feature] = Math.max(...featureData[feature]);
          return obj;
        }, {})
      }
    };
  }

  /**
   * Kombiniert Markt- und Blockchain-Daten zu einem einheitlichen Feature-Set
   * @param {Array<Object>} marketData - Marktdaten (OHLCV)
   * @param {Object} blockchainData - Blockchain-Metriken
   * @returns {Object} - Kombinierte Features für ML-Modelle
   */
  combineFeatures(marketData, blockchainData) {
    if (!Array.isArray(marketData) || marketData.length === 0) {
      throw new Error('Market data must be a non-empty array');
    }

    if (!blockchainData || typeof blockchainData !== 'object') {
      throw new Error('Blockchain data must be an object');
    }

    // Extrahieren der Marktdaten-Features
    const marketFeatures = {
      close: marketData.map(candle => candle.close),
      volume: marketData.map(candle => candle.volume),
      high: marketData.map(candle => candle.high),
      low: marketData.map(candle => candle.low)
    };
    
    // Berechnen von abgeleiteten Marktdaten-Features
    marketFeatures.volatility = marketData.map(candle => candle.high - candle.low);
    marketFeatures.priceChange = this.calculatePercentageChange(marketFeatures.close);
    marketFeatures.volumeChange = this.calculatePercentageChange(marketFeatures.volume);
    
    // Extrahieren und Normalisieren der Blockchain-Features
    const blockchainFeatures = {};
    
    Object.keys(blockchainData).forEach(metric => {
      if (blockchainData[metric] && blockchainData[metric].values) {
        // Extrahieren der Werte aus den Blockchain-Daten
        const values = blockchainData[metric].values.map(item => item.y);
        
        // Normalisieren der Werte
        blockchainFeatures[metric] = this.normalizeData(values);
        
        // Berechnen der prozentualen Veränderung
        blockchainFeatures[`${metric}Change`] = this.calculatePercentageChange(values);
      }
    });
    
    return {
      market: marketFeatures,
      blockchain: blockchainFeatures
    };
  }

  /**
   * Denormalisiert Vorhersagewerte zurück in den ursprünglichen Wertebereich
   * @param {Array<number>} normalizedData - Normalisierte Daten
   * @param {number} min - Minimaler Wert im ursprünglichen Bereich
   * @param {number} max - Maximaler Wert im ursprünglichen Bereich
   * @returns {Array<number>} - Denormalisierte Daten
   */
  denormalizeMinMax(normalizedData, min, max) {
    if (!Array.isArray(normalizedData)) {
      throw new Error('Normalized data must be an array');
    }

    return normalizedData.map(value => value * (max - min) + min);
  }
}

module.exports = DataNormalizer;
