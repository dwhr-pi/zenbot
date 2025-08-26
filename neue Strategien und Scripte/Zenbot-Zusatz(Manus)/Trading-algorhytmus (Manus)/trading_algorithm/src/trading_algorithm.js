// Hauptmodul des Trading-Algorithmus
// Verantwortlich für die Integration aller Komponenten und die Ausführung des Algorithmus

class TradingAlgorithm {
  constructor(config = {}) {
    // Konfiguration
    this.config = {
      // Allgemeine Einstellungen
      symbol: config.symbol || 'BTC/USDT',
      timeframe: config.timeframe || '1h',
      
      // Binance-API-Einstellungen
      binance: {
        apiKey: config.binanceApiKey || '',
        apiSecret: config.binanceApiSecret || '',
        testMode: config.binanceTestMode !== undefined ? config.binanceTestMode : true
      },
      
      // Modelleinstellungen
      model: {
        windowSize: config.windowSize || 50,
        features: config.features || ['close', 'volume', 'high', 'low'],
        learningRate: config.learningRate || 0.001,
        epochs: config.epochs || 100,
        batchSize: config.batchSize || 32
      },
      
      // Signalgenerator-Einstellungen
      signal: {
        buyThreshold: config.buyThreshold || 1.5,
        sellThreshold: config.sellThreshold || -1.0,
        priceWeight: config.priceWeight || 0.6,
        onChainWeight: config.onChainWeight || 0.4
      },
      
      // Risikomanagement-Einstellungen
      risk: {
        stopLossPercentage: config.stopLossPercentage || 2.0,
        takeProfitPercentage: config.takeProfitPercentage || 3.0,
        trailingStopPercentage: config.trailingStopPercentage || 1.5,
        maxPositionSize: config.maxPositionSize || 0.1,
        riskPerTrade: config.riskPerTrade || 0.01
      },
      
      // Zenbot-Einstellungen
      zenbot: {
        strategyName: config.strategyName || 'neural_blockchain_strategy',
        period: config.period || '1h',
        minPeriods: config.minPeriods || 50,
        lookbackPeriods: config.lookbackPeriods || 14
      }
    };
    
    // Komponenten
    this.binanceConnector = null;
    this.blockchainConnector = null;
    this.dataNormalizer = null;
    this.lstmModel = null;
    this.signalGenerator = null;
    this.riskManager = null;
    this.zenbotAdapter = null;
    
    // Status
    this.isInitialized = false;
    this.isRunning = false;
    this.historicalData = [];
    this.blockchainData = null;
    this.modelTrained = false;
  }

  /**
   * Initialisiert alle Komponenten des Algorithmus
   */
  async initialize() {
    try {
      console.log('Initializing trading algorithm...');
      
      // Komponenten importieren
      const BinanceConnector = require('./data/binance_connector');
      const BlockchainConnector = require('./data/blockchain_connector');
      const DataNormalizer = require('./data/data_normalizer');
      const LSTMModel = require('./models/lstm_model');
      const SignalGenerator = require('./strategy/signal_generator');
      const RiskManager = require('./strategy/risk_manager');
      const ZenbotAdapter = require('./strategy/zenbot_adapter');
      
      // Binance-Connector initialisieren
      this.binanceConnector = new BinanceConnector({
        apiKey: this.config.binance.apiKey,
        apiSecret: this.config.binance.apiSecret,
        testMode: this.config.binance.testMode
      });
      await this.binanceConnector.initialize();
      console.log('Binance connector initialized');
      
      // Blockchain-Connector initialisieren
      this.blockchainConnector = new BlockchainConnector();
      console.log('Blockchain connector initialized');
      
      // Daten-Normalisierer initialisieren
      this.dataNormalizer = new DataNormalizer({
        windowSize: this.config.model.windowSize
      });
      console.log('Data normalizer initialized');
      
      // LSTM-Modell initialisieren
      this.lstmModel = new LSTMModel({
        inputShape: [this.config.model.windowSize, this.config.model.features.length],
        learningRate: this.config.model.learningRate,
        epochs: this.config.model.epochs,
        batchSize: this.config.model.batchSize
      });
      await this.lstmModel.initialize();
      console.log('LSTM model initialized');
      
      // Signalgenerator initialisieren
      this.signalGenerator = new SignalGenerator({
        buyThreshold: this.config.signal.buyThreshold,
        sellThreshold: this.config.signal.sellThreshold,
        priceWeight: this.config.signal.priceWeight,
        onChainWeight: this.config.signal.onChainWeight
      });
      console.log('Signal generator initialized');
      
      // Risikomanager initialisieren
      this.riskManager = new RiskManager({
        stopLossPercentage: this.config.risk.stopLossPercentage,
        takeProfitPercentage: this.config.risk.takeProfitPercentage,
        trailingStopPercentage: this.config.risk.trailingStopPercentage,
        maxPositionSize: this.config.risk.maxPositionSize,
        riskPerTrade: this.config.risk.riskPerTrade
      });
      console.log('Risk manager initialized');
      
      // Zenbot-Adapter initialisieren
      this.zenbotAdapter = new ZenbotAdapter({
        strategyName: this.config.zenbot.strategyName,
        period: this.config.zenbot.period,
        min_periods: this.config.zenbot.minPeriods,
        lookback_periods: this.config.zenbot.lookbackPeriods,
        buy_threshold: this.config.signal.buyThreshold,
        sell_threshold: this.config.signal.sellThreshold,
        stop_loss_pct: this.config.risk.stopLossPercentage,
        take_profit_pct: this.config.risk.takeProfitPercentage,
        trailing_stop_pct: this.config.risk.trailingStopPercentage,
        max_position_size: this.config.risk.maxPositionSize,
        risk_per_trade: this.config.risk.riskPerTrade,
        price_weight: this.config.signal.priceWeight,
        blockchain_weight: this.config.signal.onChainWeight
      });
      
      // Abhängigkeiten für den Zenbot-Adapter setzen
      this.zenbotAdapter.initialize({
        modelManager: this.lstmModel,
        signalGenerator: this.signalGenerator,
        riskManager: this.riskManager,
        blockchainConnector: this.blockchainConnector,
        dataNormalizer: this.dataNormalizer
      });
      console.log('Zenbot adapter initialized');
      
      this.isInitialized = true;
      console.log('Trading algorithm initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Error initializing trading algorithm:', error);
      throw error;
    }
  }

  /**
   * Lädt historische Daten für Training und Backtesting
   * @param {string} symbol - Handelssymbol
   * @param {string} interval - Zeitintervall
   * @param {number} limit - Anzahl der Kerzen
   */
  async loadHistoricalData(symbol = this.config.symbol, interval = this.config.timeframe, limit = 1000) {
    try {
      console.log(`Loading historical data for ${symbol} with interval ${interval}...`);
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Historische Daten von Binance laden
      this.historicalData = await this.binanceConnector.getCandles(symbol, interval, limit);
      console.log(`Loaded ${this.historicalData.length} historical candles`);
      
      // Blockchain-Daten laden
      this.blockchainData = await this.blockchainConnector.getMultipleMetrics([
        'transactions', 'hashrate', 'difficulty', 'fees'
      ]);
      console.log('Loaded blockchain metrics');
      
      return this.historicalData;
    } catch (error) {
      console.error('Error loading historical data:', error);
      throw error;
    }
  }

  /**
   * Trainiert das LSTM-Modell mit historischen Daten
   */
  async trainModel() {
    try {
      console.log('Training LSTM model...');
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      if (this.historicalData.length === 0) {
        await this.loadHistoricalData();
      }
      
      // Daten für das Training vorbereiten
      const preparedData = this.dataNormalizer.prepareLSTMData(
        this.historicalData,
        this.config.model.features,
        this.config.model.windowSize,
        1
      );
      
      // Modell trainieren
      await this.lstmModel.train(preparedData.sequences, preparedData.targets, preparedData.metadata);
      console.log('Model training completed');
      
      this.modelTrained = true;
      return true;
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  }

  /**
   * Führt Backtesting mit historischen Daten durch
   * @returns {Object} - Backtesting-Ergebnisse
   */
  async runBacktest() {
    try {
      console.log('Running backtest...');
      
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      if (this.historicalData.length === 0) {
        await this.loadHistoricalData();
      }
      
      if (!this.modelTrained) {
        await this.trainModel();
      }
      
      // Ergebnisse für das Backtesting
      const results = {
        trades: [],
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          totalReturn: 0,
          averageReturn: 0
        }
      };
      
      // Anfangskapital
      let balance = 10000; // USDT
      let asset = 0; // BTC
      let position = null;
      
      // Für jede Kerze im Backtesting-Zeitraum
      for (let i = this.config.model.windowSize; i < this.historicalData.length; i++) {
        // Aktuelle Kerze
        const currentCandle = this.historicalData[i];
        
        // Eingabesequenz für das Modell erstellen
        const inputSequence = [];
        for (let j = i - this.config.model.windowSize; j < i; j++) {
          const timeStep = [];
          this.config.model.features.forEach(feature => {
            timeStep.push(this.historicalData[j][feature]);
          });
          inputSequence.push(timeStep);
        }
        
        // Normalisieren der Eingabesequenz
        const normalizedSequence = this.dataNormalizer.normalizeData(inputSequence.flat());
        
        // Reshape für das Modell
        const reshapedSequence = [];
        for (let j = 0; j < this.config.model.windowSize; j++) {
          const timeStep = [];
          for (let k = 0; k < this.config.model.features.length; k++) {
            const index = j * this.config.model.features.length + k;
            timeStep.push(normalizedSequence[index]);
          }
          reshapedSequence.push(timeStep);
        }
        
        // Vorhersage mit dem Modell
        const prediction = await this.lstmModel.predict(reshapedSequence);
        
        // Denormalisieren der Vorhersage
        const denormalizedPrediction = this.lstmModel.denormalizePrediction(prediction, 'close');
        
        // Handelssignal generieren
        const signalData = {
          currentPrice: currentCandle.close,
          predictedPrice: denormalizedPrediction[0],
          blockchainMetrics: this.blockchainData
        };
        
        const signal = this.signalGenerator.generateSignal(signalData);
        
        // Risikomanagement anwenden
        const marketData = {
          symbol: this.config.symbol,
          price: currentCandle.close,
          recentPrices: this.historicalData.slice(i - 30, i).map(candle => candle.close)
        };
        
        const accountData = {
          balance: balance,
          asset: asset
        };
        
        const action = this.riskManager.applyRiskManagement(signal, marketData, accountData);
        
        // Handelsaktion ausführen
        if (action.type === 'buy' && !position) {
          // Kaufen
          const size = action.size || (balance * 0.95) / currentCandle.close;
          const cost = size * currentCandle.close;
          
          if (balance >= cost) {
            balance -= cost;
            asset += size;
            
            position = {
              type: 'long',
              entryPrice: currentCandle.close,
              size: size,
              entryTime: currentCandle.timestamp,
              stopLoss: action.stopLoss,
              takeProfit: action.takeProfit
            };
            
            results.trades.push({
              type: 'buy',
              price: currentCandle.close,
              size: size,
              cost: cost,
              timestamp: currentCandle.timestamp,
              balance: balance,
              asset: asset
            });
          }
        } else if (action.type === 'sell' && !position) {
          // Short-Selling (falls unterstützt)
          // In diesem Beispiel nicht implementiert
        } else if (action.type === 'close' && position) {
          // Position schließen
          const revenue = position.size * currentCandle.close;
          balance += revenue;
          asset -= position.size;
          
          const profit = position.type === 'long' 
            ? revenue - (position.size * position.entryPrice)
            : (position.size * position.entryPrice) - revenue;
          
          const percentReturn = position.type === 'long'
            ? ((currentCandle.close / position.entryPrice) - 1) * 100
            : ((position.entryPrice / currentCandle.close) - 1) * 100;
          
          results.trades.push({
            type: 'sell',
            price: currentCandle.close,
            size: position.size,
            revenue: revenue,
            profit: profit,
            percentReturn: percentReturn,
            timestamp: currentCandle.timestamp,
            balance: balance,
            asset: asset
          });
          
          position = null;
        } else if (position) {
          // Stop-Loss und Take-Profit überprüfen
          if (position.type === 'long') {
            // Stop-Loss
            if (position.stopLoss && currentCandle.low <= position.stopLoss) {
              const revenue = position.size * position.stopLoss;
              balance += revenue;
              asset -= position.size;
              
              const profit = revenue - (position.size * position.entryPrice);
              const percentReturn = ((position.stopLoss / position.entryPrice) - 1) * 100;
              
              results.trades.push({
                type: 'stop_loss',
                price: position.stopLoss,
                size: position.size,
                revenue: revenue,
                profit: profit,
                percentReturn: percentReturn,
                timestamp: currentCandle.timestamp,
                balance: balance,
                asset: asset
              });
              
              position = null;
            }
            // Take-Profit
            else if (position.takeProfit && currentCandle.high >= position.takeProfit) {
              const revenue = position.size * position.takeProfit;
              balance += revenue;
              asset -= position.size;
              
              const profit = revenue - (position.size * position.entryPrice);
              const percentReturn = ((position.takeProfit / position.entryPrice) - 1) * 100;
              
              results.trades.push({
                type: 'take_profit',
                price: position.takeProfit,
                size: position.size,
                revenue: revenue,
                profit: profit,
                percentReturn: percentReturn,
                timestamp: currentCandle.timestamp,
                balance: balance,
                asset: asset
              });
              
              position = null;
            }
          }
        }
      }
      
      // Offene Position am Ende schließen
      if (position) {
        const lastCandle = this.historicalData[this.historicalData.length - 1];
        const revenue = position.size * lastCandle.close;
        balance += revenue;
        asset -= position.size;
        
        const profit = position.type === 'long'
          ? revenue - (position.size * position.entryPrice)
          : (position.size * position.entryPrice) - revenue;
        
        const percentReturn = position.type === 'long'
          ? ((lastCandle.close / position.entryPrice) - 1) * 100
          : ((position.entryPrice / lastCandle.close) - 1) * 100;
        
        results.trades.push({
          type: 'final_close',
          price: lastCandle.close,
          size: position.size,
          revenue: revenue,
          profit: profit,
          percentReturn: percentReturn,
          timestamp: lastCandle.timestamp,
          balance: balance,
          asset: asset
        });
      }
      
      // Performance-Metriken berechnen
      results.performance.totalTrades = results.trades.filter(t => t.type !== 'buy').length;
      results.performance.winningTrades = results.trades.filter(t => t.type !== 'buy' && t.profit > 0).length;
      results.performance.losingTrades = results.trades.filter(t => t.type !== 'buy' && t.profit <= 0).length;
      
      if (results.performance.totalTrades > 0) {
        results.performance.winRate = (results.performance.winningTrades / results.performance.totalTrades) * 100;
        
        const totalReturn = results.trades
          .filter(t => t.type !== 'buy')
          .reduce((sum, trade) => sum + trade.percentReturn, 0);
        
        results.performance.totalReturn = totalReturn;
        results.performance.averageReturn = totalReturn / results.performance.totalTrades;
      }
      
      // Gesamtrendite
      const initialBalance = 10000;
      const finalBalance = balance + (asset * this.historicalData[this.historicalData.length - 1].close);
      results.performance.totalProfit = finalBalance - initialBalance;
      results.performance.totalReturnPercent = ((finalBalance / initialBalance) - 1) * 100;
      
      console.log('Backtest completed');
      console.log('Performance:', results.performance);
      
      return results;
    } catch (error) {
      console.error('Error running backtest:', error);
      throw error;
    }
  }

  /**
   * Exportiert die Zenbot-Strategie
   * @returns {Object} - Zenbot-Strategie
   */
  exportZenbotStrategy() {
    if (!this.isInitialized) {
      throw new Error('Trading algorithm not initialized');
    }
    
    return this.zenbotAdapter.exportStrategy();
  }

  /**
   * Erstellt eine Zenbot-Konfigurationsdatei
   * @param {string} symbol - Handelssymbol
   * @param {Object} options - Zusätzliche Optionen
   * @returns {string} - Zenbot-Konfiguration als JSON-String
   */
  createZenbotConfig(symbol = this.config.symbol, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Trading algorithm not initialized');
    }
    
    return this.zenbotAdapter.createZenbotConfig(symbol, options);
  }

  /**
   * Erstellt ein Zenbot-Kommando für Backtesting
   * @param {string} symbol - Handelssymbol
   * @param {string} days - Anzahl der Tage für Backtesting
   * @returns {string} - Zenbot-Kommando
   */
  createBacktestCommand(symbol = this.config.symbol, days = '90') {
    if (!this.isInitialized) {
      throw new Error('Trading algorithm not initialized');
    }
    
    return this.zenbotAdapter.createBacktestCommand(symbol, days);
  }

  /**
   * Erstellt ein Zenbot-Kommando für Live-Trading
   * @param {string} symbol - Handelssymbol
   * @param {boolean} paper - Paper-Trading aktivieren
   * @returns {string} - Zenbot-Kommando
   */
  createLiveCommand(symbol = this.config.symbol, paper = true) {
    if (!this.isInitialized) {
      throw new Error('Trading algorithm not initialized');
    }
    
    return this.zenbotAdapter.createLiveCommand(symbol, paper);
  }

  /**
   * Speichert das trainierte Modell
   * @param {string} path - Pfad zum Speichern des Modells
   */
  async saveModel(path) {
    if (!this.isInitialized || !this.modelTrained) {
      throw new Error('Model not trained');
    }
    
    await this.lstmModel.saveModel(path);
    console.log(`Model saved to ${path}`);
  }

  /**
   * Lädt ein vortrainiertes Modell
   * @param {string} path - Pfad zum gespeicherten Modell
   */
  async loadModel(path) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    await this.lstmModel.loadModel(path);
    this.modelTrained = true;
    console.log(`Model loaded from ${path}`);
  }
}

module.exports = TradingAlgorithm;
