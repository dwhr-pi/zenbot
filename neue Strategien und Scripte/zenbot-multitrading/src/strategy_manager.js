/**
 * Strategie-Manager für Zenbot Multi-Trading
 * 
 * Verwaltet verschiedene Trading-Strategien und deren Konfigurationen
 * für individuelle Coin-Trading-Instanzen.
 */

class StrategyManager {
  constructor(options = {}) {
    this.strategy = options.strategy;
    this.strategyParams = options.strategyParams || {};
    this.logger = options.logger;
    this.strategyInstance = null;
    this.isRunning = false;
    this.indicators = new Map();
  }

  /**
   * Initialisiert den Strategie-Manager
   */
  async init() {
    try {
      this.logger.info(`Initialisiere Strategie-Manager für ${this.strategy}`);
      
      // Strategie-Instanz laden
      const StrategyClass = await this.loadStrategy(this.strategy);
      this.strategyInstance = new StrategyClass(this.strategyParams);
      
      // Benötigte Indikatoren initialisieren
      await this.initializeIndicators();
      
      this.logger.info(`Strategie-Manager für ${this.strategy} erfolgreich initialisiert`);
      return true;
    } catch (error) {
      this.logger.error(`Fehler bei der Initialisierung des Strategie-Managers für ${this.strategy}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lädt eine Strategie-Klasse
   */
  async loadStrategy(strategyName) {
    try {
      // Hier würde normalerweise die Strategie dynamisch geladen werden
      // Für dieses Beispiel implementieren wir einige Basis-Strategien direkt
      
      const strategies = {
        'macd_cross': class MacdCrossStrategy {
          constructor(params) {
            this.fastPeriod = params.fastPeriod || 12;
            this.slowPeriod = params.slowPeriod || 26;
            this.signalPeriod = params.signalPeriod || 9;
            this.upThreshold = params.upThreshold || 0;
            this.downThreshold = params.downThreshold || 0;
          }
          
          async evaluate(data, indicators) {
            const macd = indicators.get('macd');
            if (!macd || !macd.histogram) return null;
            
            const currentHistogram = macd.histogram[macd.histogram.length - 1];
            const previousHistogram = macd.histogram[macd.histogram.length - 2];
            
            if (previousHistogram < this.upThreshold && currentHistogram >= this.upThreshold) {
              return { type: 'buy', price: data.ticker.last, amount: 1 };
            } else if (previousHistogram > this.downThreshold && currentHistogram <= this.downThreshold) {
              return { type: 'sell', price: data.ticker.last, amount: 1 };
            }
            
            return null;
          }
          
          getRequiredIndicators() {
            return ['macd'];
          }
        },
        
        'rsi': class RsiStrategy {
          constructor(params) {
            this.period = params.period || 14;
            this.overbought = params.overbought || 70;
            this.oversold = params.oversold || 30;
          }
          
          async evaluate(data, indicators) {
            const rsi = indicators.get('rsi');
            if (!rsi || !rsi.values) return null;
            
            const currentRsi = rsi.values[rsi.values.length - 1];
            const previousRsi = rsi.values[rsi.values.length - 2];
            
            if (previousRsi >= this.overbought && currentRsi < this.overbought) {
              return { type: 'sell', price: data.ticker.last, amount: 1 };
            } else if (previousRsi <= this.oversold && currentRsi > this.oversold) {
              return { type: 'buy', price: data.ticker.last, amount: 1 };
            }
            
            return null;
          }
          
          getRequiredIndicators() {
            return ['rsi'];
          }
        },
        
        'bollinger_bands': class BollingerBandsStrategy {
          constructor(params) {
            this.period = params.period || 20;
            this.stdDev = params.stdDev || 2;
          }
          
          async evaluate(data, indicators) {
            const bb = indicators.get('bollinger_bands');
            if (!bb || !bb.upper || !bb.lower) return null;
            
            const currentPrice = data.ticker.last;
            const upperBand = bb.upper[bb.upper.length - 1];
            const lowerBand = bb.lower[bb.lower.length - 1];
            
            if (currentPrice >= upperBand) {
              return { type: 'sell', price: currentPrice, amount: 1 };
            } else if (currentPrice <= lowerBand) {
              return { type: 'buy', price: currentPrice, amount: 1 };
            }
            
            return null;
          }
          
          getRequiredIndicators() {
            return ['bollinger_bands'];
          }
        }
      };
      
      if (!strategies[strategyName]) {
        throw new Error(`Strategie ${strategyName} nicht gefunden`);
      }
      
      return strategies[strategyName];
    } catch (error) {
      this.logger.error(`Fehler beim Laden der Strategie ${strategyName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Initialisiert die benötigten Indikatoren für die Strategie
   */
  async initializeIndicators() {
    try {
      const requiredIndicators = this.strategyInstance.getRequiredIndicators();
      
      for (const indicator of requiredIndicators) {
        this.logger.debug(`Initialisiere Indikator ${indicator}`);
        
        // Hier würden normalerweise die Indikatoren dynamisch geladen werden
        // Für dieses Beispiel initialisieren wir sie mit leeren Werten
        this.indicators.set(indicator, {});
      }
    } catch (error) {
      this.logger.error(`Fehler bei der Initialisierung der Indikatoren: ${error.message}`);
      throw error;
    }
  }

  /**
   * Startet den Strategie-Manager
   */
  async start() {
    if (this.isRunning) {
      this.logger.warn(`Strategie-Manager für ${this.strategy} läuft bereits`);
      return;
    }

    try {
      this.logger.info(`Starte Strategie-Manager für ${this.strategy}`);
      this.isRunning = true;
      this.logger.info(`Strategie-Manager für ${this.strategy} erfolgreich gestartet`);
    } catch (error) {
      this.logger.error(`Fehler beim Starten des Strategie-Managers für ${this.strategy}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stoppt den Strategie-Manager
   */
  async stop() {
    if (!this.isRunning) {
      this.logger.warn(`Strategie-Manager für ${this.strategy} läuft nicht`);
      return;
    }

    try {
      this.logger.info(`Stoppe Strategie-Manager für ${this.strategy}`);
      this.isRunning = false;
      this.logger.info(`Strategie-Manager für ${this.strategy} erfolgreich gestoppt`);
    } catch (error) {
      this.logger.error(`Fehler beim Stoppen des Strategie-Managers für ${this.strategy}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Aktualisiert die Konfiguration des Strategie-Managers
   */
  async updateConfig(newConfig) {
    try {
      this.logger.info(`Aktualisiere Konfiguration des Strategie-Managers für ${this.strategy}`);
      
      const needsReinitialization = newConfig.strategy && newConfig.strategy !== this.strategy;
      
      // Strategie-Manager stoppen, falls notwendig
      if (this.isRunning && needsReinitialization) {
        await this.stop();
      }
      
      // Konfiguration aktualisieren
      if (newConfig.strategy) this.strategy = newConfig.strategy;
      if (newConfig.strategyParams) this.strategyParams = { ...this.strategyParams, ...newConfig.strategyParams };
      
      // Strategie-Manager neu initialisieren, falls notwendig
      if (needsReinitialization) {
        await this.init();
        
        // Strategie-Manager neu starten, falls zuvor gestartet
        if (this.isRunning) {
          await this.start();
        }
      }
      
      this.logger.info(`Konfiguration des Strategie-Managers für ${this.strategy} erfolgreich aktualisiert`);
    } catch (error) {
      this.logger.error(`Fehler beim Aktualisieren der Konfiguration des Strategie-Managers für ${this.strategy}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Berechnet die Indikatoren für die aktuelle Marktdaten
   */
  async calculateIndicators(marketData) {
    try {
      const requiredIndicators = this.strategyInstance.getRequiredIndicators();
      
      for (const indicator of requiredIndicators) {
        await this.calculateIndicator(indicator, marketData);
      }
    } catch (error) {
      this.logger.error(`Fehler bei der Berechnung der Indikatoren: ${error.message}`);
      throw error;
    }
  }

  /**
   * Berechnet einen einzelnen Indikator
   */
  async calculateIndicator(indicator, marketData) {
    try {
      // Hier würde normalerweise die Berechnung des Indikators implementiert werden
      // Für dieses Beispiel implementieren wir einige Basis-Indikatoren direkt
      
      const ohlcv = marketData.ohlcv || [];
      
      switch (indicator) {
        case 'macd':
          // Vereinfachte MACD-Berechnung
          const fastPeriod = this.strategyParams.fastPeriod || 12;
          const slowPeriod = this.strategyParams.slowPeriod || 26;
          const signalPeriod = this.strategyParams.signalPeriod || 9;
          
          const closes = ohlcv.map(candle => candle[4]);
          
          // EMA-Berechnung (vereinfacht)
          const calculateEMA = (values, period) => {
            const k = 2 / (period + 1);
            let ema = values[0];
            const result = [ema];
            
            for (let i = 1; i < values.length; i++) {
              ema = values[i] * k + ema * (1 - k);
              result.push(ema);
            }
            
            return result;
          };
          
          const fastEMA = calculateEMA(closes, fastPeriod);
          const slowEMA = calculateEMA(closes, slowPeriod);
          
          // MACD-Linie berechnen
          const macdLine = [];
          for (let i = 0; i < closes.length; i++) {
            macdLine.push(fastEMA[i] - slowEMA[i]);
          }
          
          // Signal-Linie berechnen
          const signalLine = calculateEMA(macdLine, signalPeriod);
          
          // Histogram berechnen
          const histogram = [];
          for (let i = 0; i < macdLine.length; i++) {
            histogram.push(macdLine[i] - signalLine[i]);
          }
          
          this.indicators.set('macd', {
            line: macdLine,
            signal: signalLine,
            histogram
          });
          break;
          
        case 'rsi':
          // Vereinfachte RSI-Berechnung
          const period = this.strategyParams.period || 14;
          const closes = ohlcv.map(candle => candle[4]);
          
          // Gewinne und Verluste berechnen
          const gains = [];
          const losses = [];
          
          for (let i = 1; i < closes.length; i++) {
            const change = closes[i] - closes[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? -change : 0);
          }
          
          // Durchschnittliche Gewinne und Verluste berechnen
          const calculateAverage = (values, period) => {
            let sum = 0;
            for (let i = 0; i < period; i++) {
              sum += values[i];
            }
            
            const result = [sum / period];
            
            for (let i = period; i < values.length; i++) {
              sum = (sum - values[i - period] + values[i]);
              result.push(sum / period);
            }
            
            return result;
          };
          
          const avgGains = calculateAverage(gains, period);
          const avgLosses = calculateAverage(losses, period);
          
          // RSI berechnen
          const rsiValues = [];
          for (let i = 0; i < avgGains.length; i++) {
            const rs = avgGains[i] / (avgLosses[i] || 0.001); // Vermeidung von Division durch 0
            const rsi = 100 - (100 / (1 + rs));
            rsiValues.push(rsi);
          }
          
          this.indicators.set('rsi', {
            values: rsiValues
          });
          break;
          
        case 'bollinger_bands':
          // Vereinfachte Bollinger Bands-Berechnung
          const period = this.strategyParams.period || 20;
          const stdDev = this.strategyParams.stdDev || 2;
          const closes = ohlcv.map(candle => candle[4]);
          
          // Gleitender Durchschnitt berechnen
          const calculateSMA = (values, period) => {
            const result = [];
            
            for (let i = period - 1; i < values.length; i++) {
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += values[i - j];
              }
              result.push(sum / period);
            }
            
            return result;
          };
          
          const sma = calculateSMA(closes, period);
          
          // Standardabweichung berechnen
          const calculateStdDev = (values, sma, period) => {
            const result = [];
            
            for (let i = period - 1; i < values.length; i++) {
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += Math.pow(values[i - j] - sma[i - period + 1], 2);
              }
              result.push(Math.sqrt(sum / period));
            }
            
            return result;
          };
          
          const stdDevValues = calculateStdDev(closes, sma, period);
          
          // Bollinger Bands berechnen
          const upper = [];
          const lower = [];
          
          for (let i = 0; i < sma.length; i++) {
            upper.push(sma[i] + stdDev * stdDevValues[i]);
            lower.push(sma[i] - stdDev * stdDevValues[i]);
          }
          
          this.indicators.set('bollinger_bands', {
            middle: sma,
            upper,
            lower
          });
          break;
          
        default:
          this.logger.warn(`Unbekannter Indikator: ${indicator}`);
      }
    } catch (error) {
      this.logger.error(`Fehler bei der Berechnung des Indikators ${indicator}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Wertet die Strategie für die aktuellen Marktdaten aus
   */
  async evaluate(marketData) {
    if (!this.isRunning) {
      this.logger.warn(`Strategie-Manager für ${this.strategy} läuft nicht`);
      return null;
    }

    try {
      // Indikatoren berechnen
      await this.calculateIndicators(marketData);
      
      // Strategie auswerten
      const signal = await this.strategyInstance.evaluate(marketData, this.indicators);
      
      if (signal) {
        this.logger.info(`Strategie ${this.strategy} generiert Signal: ${signal.type} ${signal.amount} @ ${signal.price}`);
      }
      
      return signal;
    } catch (error) {
      this.logger.error(`Fehler bei der Auswertung der Strategie ${this.strategy}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = StrategyManager;
