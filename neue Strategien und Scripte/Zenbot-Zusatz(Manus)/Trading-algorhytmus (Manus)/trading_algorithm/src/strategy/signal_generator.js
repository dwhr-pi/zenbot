// Signal-Generator für Trading-Entscheidungen
// Verantwortlich für die Umwandlung von Modellvorhersagen in Handelssignale

class SignalGenerator {
  constructor(config = {}) {
    // Schwellenwerte für Kauf- und Verkaufssignale
    this.buyThreshold = config.buyThreshold || 1.5; // Prozentuale Änderung für Kaufsignal
    this.sellThreshold = config.sellThreshold || -1.0; // Prozentuale Änderung für Verkaufssignal
    
    // Gewichtungen für verschiedene Signalquellen
    this.priceWeight = config.priceWeight || 0.6; // Gewichtung der Preisvorhersage
    this.onChainWeight = config.onChainWeight || 0.4; // Gewichtung der On-Chain-Metriken
    
    // Signalglättung
    this.smoothingFactor = config.smoothingFactor || 0.3; // EMA-Glättungsfaktor
    this.previousSignal = 0; // Vorheriges Signal für Glättung
    
    // Signalhistorie
    this.signalHistory = [];
    this.maxHistoryLength = config.maxHistoryLength || 100;
  }

  /**
   * Generiert ein Handelssignal basierend auf Preisvorhersagen
   * @param {number} currentPrice - Aktueller Preis
   * @param {number} predictedPrice - Vorhergesagter Preis
   * @returns {number} - Handelssignal (-1 für Verkauf, 0 für Halten, 1 für Kauf)
   */
  generatePriceSignal(currentPrice, predictedPrice) {
    // Prozentuale Änderung berechnen
    const percentChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    // Signal basierend auf Schwellenwerten
    let signal = 0;
    
    if (percentChange >= this.buyThreshold) {
      signal = 1; // Kaufsignal
    } else if (percentChange <= this.sellThreshold) {
      signal = -1; // Verkaufssignal
    }
    
    return signal;
  }

  /**
   * Generiert ein Handelssignal basierend auf On-Chain-Metriken
   * @param {Object} blockchainMetrics - On-Chain-Metriken
   * @returns {number} - Handelssignal (-1 für Verkauf, 0 für Halten, 1 für Kauf)
   */
  generateOnChainSignal(blockchainMetrics) {
    // Überprüfen, ob Blockchain-Metriken vorhanden sind
    if (!blockchainMetrics || Object.keys(blockchainMetrics).length === 0) {
      return 0; // Neutrales Signal, wenn keine Daten vorhanden sind
    }
    
    // Signalwerte für verschiedene Metriken
    const signals = {
      transactions: 0,
      hashrate: 0,
      difficulty: 0,
      fees: 0
    };
    
    // Transaktionsvolumen analysieren
    if (blockchainMetrics.transactions) {
      const txChange = this.calculateMetricChange(blockchainMetrics.transactions);
      signals.transactions = this.interpretMetricChange(txChange, 5, -5);
    }
    
    // Hashrate analysieren
    if (blockchainMetrics.hashrate) {
      const hashrateChange = this.calculateMetricChange(blockchainMetrics.hashrate);
      signals.hashrate = this.interpretMetricChange(hashrateChange, 3, -3);
    }
    
    // Difficulty analysieren
    if (blockchainMetrics.difficulty) {
      const difficultyChange = this.calculateMetricChange(blockchainMetrics.difficulty);
      signals.difficulty = this.interpretMetricChange(difficultyChange, 2, -2);
    }
    
    // Gebühren analysieren
    if (blockchainMetrics.fees) {
      const feesChange = this.calculateMetricChange(blockchainMetrics.fees);
      signals.fees = this.interpretMetricChange(feesChange, 10, -10);
    }
    
    // Gewichtetes Gesamtsignal berechnen
    const weights = {
      transactions: 0.4,
      hashrate: 0.2,
      difficulty: 0.2,
      fees: 0.2
    };
    
    let totalSignal = 0;
    let totalWeight = 0;
    
    Object.keys(signals).forEach(metric => {
      if (signals[metric] !== 0) {
        totalSignal += signals[metric] * weights[metric];
        totalWeight += weights[metric];
      }
    });
    
    // Normalisieren des Signals auf [-1, 0, 1]
    if (totalWeight === 0) {
      return 0;
    }
    
    const normalizedSignal = totalSignal / totalWeight;
    
    // Diskretisieren des Signals
    if (normalizedSignal >= 0.5) {
      return 1;
    } else if (normalizedSignal <= -0.5) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Berechnet die prozentuale Änderung einer Metrik
   * @param {Array} metricData - Zeitreihe der Metrik
   * @returns {number} - Prozentuale Änderung
   */
  calculateMetricChange(metricData) {
    if (!Array.isArray(metricData) || metricData.length < 2) {
      return 0;
    }
    
    const current = metricData[metricData.length - 1];
    const previous = metricData[metricData.length - 2];
    
    if (previous === 0) {
      return 0;
    }
    
    return ((current - previous) / previous) * 100;
  }

  /**
   * Interpretiert die prozentuale Änderung einer Metrik als Signal
   * @param {number} change - Prozentuale Änderung
   * @param {number} buyThreshold - Schwellenwert für Kaufsignal
   * @param {number} sellThreshold - Schwellenwert für Verkaufssignal
   * @returns {number} - Interpretiertes Signal
   */
  interpretMetricChange(change, buyThreshold, sellThreshold) {
    if (change >= buyThreshold) {
      return 1;
    } else if (change <= sellThreshold) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Kombiniert Preis- und On-Chain-Signale zu einem Gesamtsignal
   * @param {number} priceSignal - Signal aus Preisvorhersage
   * @param {number} onChainSignal - Signal aus On-Chain-Metriken
   * @returns {number} - Kombiniertes Signal
   */
  combineSignals(priceSignal, onChainSignal) {
    // Gewichtete Kombination der Signale
    const combinedSignal = (priceSignal * this.priceWeight) + (onChainSignal * this.onChainWeight);
    
    // Glättung des Signals mit EMA
    const smoothedSignal = (combinedSignal * this.smoothingFactor) + (this.previousSignal * (1 - this.smoothingFactor));
    this.previousSignal = smoothedSignal;
    
    // Diskretisieren des geglätteten Signals
    if (smoothedSignal >= 0.5) {
      return 1;
    } else if (smoothedSignal <= -0.5) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Generiert ein Handelssignal basierend auf allen verfügbaren Daten
   * @param {Object} data - Eingabedaten für die Signalgenerierung
   * @returns {Object} - Handelssignal und Metadaten
   */
  generateSignal(data) {
    // Überprüfen, ob die erforderlichen Daten vorhanden sind
    if (!data || !data.currentPrice || !data.predictedPrice) {
      throw new Error('Missing required data for signal generation');
    }
    
    // Preis-Signal generieren
    const priceSignal = this.generatePriceSignal(data.currentPrice, data.predictedPrice);
    
    // On-Chain-Signal generieren (falls Daten vorhanden)
    const onChainSignal = data.blockchainMetrics ? 
      this.generateOnChainSignal(data.blockchainMetrics) : 0;
    
    // Signale kombinieren
    const finalSignal = this.combineSignals(priceSignal, onChainSignal);
    
    // Signal zur Historie hinzufügen
    this.addToSignalHistory(finalSignal, data);
    
    // Signal-Objekt erstellen
    const signalObject = {
      signal: finalSignal,
      timestamp: Date.now(),
      priceSignal,
      onChainSignal,
      currentPrice: data.currentPrice,
      predictedPrice: data.predictedPrice,
      percentChange: ((data.predictedPrice - data.currentPrice) / data.currentPrice) * 100,
      confidence: this.calculateConfidence(priceSignal, onChainSignal)
    };
    
    return signalObject;
  }

  /**
   * Berechnet die Konfidenz des Signals
   * @param {number} priceSignal - Signal aus Preisvorhersage
   * @param {number} onChainSignal - Signal aus On-Chain-Metriken
   * @returns {number} - Konfidenzwert zwischen 0 und 1
   */
  calculateConfidence(priceSignal, onChainSignal) {
    // Wenn beide Signale in die gleiche Richtung zeigen, höhere Konfidenz
    if (priceSignal !== 0 && priceSignal === onChainSignal) {
      return 0.9;
    }
    
    // Wenn die Signale widersprüchlich sind, niedrigere Konfidenz
    if (priceSignal !== 0 && onChainSignal !== 0 && priceSignal !== onChainSignal) {
      return 0.3;
    }
    
    // Wenn nur ein Signal vorhanden ist
    if (priceSignal !== 0 && onChainSignal === 0) {
      return 0.7;
    }
    
    if (onChainSignal !== 0 && priceSignal === 0) {
      return 0.5;
    }
    
    // Wenn beide Signale neutral sind
    return 0.1;
  }

  /**
   * Fügt ein Signal zur Historie hinzu
   * @param {number} signal - Generiertes Signal
   * @param {Object} data - Zugehörige Daten
   */
  addToSignalHistory(signal, data) {
    this.signalHistory.push({
      signal,
      timestamp: Date.now(),
      price: data.currentPrice,
      prediction: data.predictedPrice
    });
    
    // Historie auf maximale Länge begrenzen
    if (this.signalHistory.length > this.maxHistoryLength) {
      this.signalHistory.shift();
    }
  }

  /**
   * Gibt die Signalhistorie zurück
   * @param {number} limit - Maximale Anzahl der zurückgegebenen Einträge
   * @returns {Array} - Signalhistorie
   */
  getSignalHistory(limit = this.maxHistoryLength) {
    return this.signalHistory.slice(-limit);
  }

  /**
   * Analysiert die Signalstabilität über einen Zeitraum
   * @param {number} lookback - Anzahl der zu analysierenden Signale
   * @returns {Object} - Stabilitätsmetriken
   */
  analyzeSignalStability(lookback = 10) {
    if (this.signalHistory.length < lookback) {
      return { stability: 0, consistency: 0 };
    }
    
    const recentSignals = this.signalHistory.slice(-lookback).map(item => item.signal);
    
    // Zählen der verschiedenen Signaltypen
    const counts = {
      '-1': 0,
      '0': 0,
      '1': 0
    };
    
    recentSignals.forEach(signal => {
      counts[signal.toString()]++;
    });
    
    // Dominantes Signal finden
    const dominantSignal = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    // Stabilität: Anteil des dominanten Signals
    const stability = counts[dominantSignal] / lookback;
    
    // Konsistenz: Wie oft das Signal wechselt (weniger ist besser)
    let changes = 0;
    for (let i = 1; i < recentSignals.length; i++) {
      if (recentSignals[i] !== recentSignals[i - 1]) {
        changes++;
      }
    }
    
    const consistency = 1 - (changes / (lookback - 1));
    
    return {
      stability,
      consistency,
      dominantSignal: parseInt(dominantSignal)
    };
  }
}

module.exports = SignalGenerator;
