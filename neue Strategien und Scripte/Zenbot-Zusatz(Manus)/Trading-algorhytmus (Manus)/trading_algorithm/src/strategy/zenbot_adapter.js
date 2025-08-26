// Zenbot-Adapter für den Trading-Algorithmus
// Verantwortlich für die Integration mit Zenbot und die Ausführung von Handelsstrategien

class ZenbotAdapter {
  constructor(config = {}) {
    this.strategyName = config.strategyName || 'neural_blockchain_strategy';
    this.description = 'Neuronales Netzwerk mit Blockchain-Aktivitätsanalyse';
    this.modelManager = null;
    this.signalGenerator = null;
    this.riskManager = null;
    this.blockchainConnector = null;
    this.dataNormalizer = null;
    
    // Strategie-Parameter
    this.params = {
      period: config.period || '1h',
      min_periods: config.min_periods || 50,
      lookback_periods: config.lookback_periods || 14,
      buy_threshold: config.buy_threshold || 1.5,
      sell_threshold: config.sell_threshold || -1.0,
      stop_loss_pct: config.stop_loss_pct || 2.0,
      take_profit_pct: config.take_profit_pct || 3.0,
      trailing_stop_pct: config.trailing_stop_pct || 1.5,
      max_position_size: config.max_position_size || 0.1,
      risk_per_trade: config.risk_per_trade || 0.01,
      price_weight: config.price_weight || 0.6,
      blockchain_weight: config.blockchain_weight || 0.4
    };
    
    // Zenbot-spezifische Eigenschaften
    this.tendencyPeriod = config.tendencyPeriod || 0;
    this.onlyOnCross = config.onlyOnCross || false;
  }

  /**
   * Initialisiert alle erforderlichen Module
   * @param {Object} dependencies - Abhängigkeiten (Module)
   */
  initialize(dependencies) {
    if (!dependencies) {
      throw new Error('Dependencies are required for initialization');
    }
    
    this.modelManager = dependencies.modelManager;
    this.signalGenerator = dependencies.signalGenerator;
    this.riskManager = dependencies.riskManager;
    this.blockchainConnector = dependencies.blockchainConnector;
    this.dataNormalizer = dependencies.dataNormalizer;
    
    console.log('Zenbot adapter initialized with all dependencies');
  }

  /**
   * Erstellt die Zenbot-Strategie-Konfiguration
   * @returns {Object} - Zenbot-Strategie-Konfiguration
   */
  createZenbotStrategy() {
    // Zenbot-Strategie-Objekt
    const strategy = {
      name: this.strategyName,
      description: this.description,
      
      // Zenbot-Parameter
      getOptions: () => {
        return {
          period: this.params.period,
          min_periods: this.params.min_periods,
          lookback_periods: this.params.lookback_periods,
          buy_threshold: this.params.buy_threshold,
          sell_threshold: this.params.sell_threshold,
          stop_loss_pct: this.params.stop_loss_pct,
          take_profit_pct: this.params.take_profit_pct,
          trailing_stop_pct: this.params.trailing_stop_pct,
          max_position_size: this.params.max_position_size,
          risk_per_trade: this.params.risk_per_trade,
          price_weight: this.params.price_weight,
          blockchain_weight: this.params.blockchain_weight
        };
      },
      
      // Zenbot-Tendenz-Periode
      tendency_period: this.tendencyPeriod,
      
      // Nur bei Kreuzung handeln
      only_on_cross: this.onlyOnCross,
      
      // Initialisierung der Strategie
      initialize: async function(s) {
        // Zenbot-Kontext speichern
        this.context = s;
        
        // Modell laden oder trainieren
        if (this.modelManager) {
          try {
            await this.modelManager.initialize();
            console.log('Model initialized');
          } catch (error) {
            console.error('Error initializing model:', error);
          }
        }
        
        // Blockchain-Connector initialisieren
        if (this.blockchainConnector) {
          try {
            console.log('Blockchain connector initialized');
          } catch (error) {
            console.error('Error initializing blockchain connector:', error);
          }
        }
        
        // Signalgenerator konfigurieren
        if (this.signalGenerator) {
          this.signalGenerator.buyThreshold = s.options.buy_threshold;
          this.signalGenerator.sellThreshold = s.options.sell_threshold;
          this.signalGenerator.priceWeight = s.options.price_weight;
          this.signalGenerator.onChainWeight = s.options.blockchain_weight;
          console.log('Signal generator configured');
        }
        
        // Risikomanager konfigurieren
        if (this.riskManager) {
          this.riskManager.stopLossPercentage = s.options.stop_loss_pct;
          this.riskManager.takeProfitPercentage = s.options.take_profit_pct;
          this.riskManager.trailingStopPercentage = s.options.trailing_stop_pct;
          this.riskManager.maxPositionSize = s.options.max_position_size;
          this.riskManager.riskPerTrade = s.options.risk_per_trade;
          console.log('Risk manager configured');
        }
        
        // Historische Daten für Modelltraining speichern
        this.historicalData = [];
        this.blockchainData = null;
        
        // Letzte Signale speichern
        this.lastSignal = 0;
        
        console.log('Neural blockchain strategy initialized');
      }.bind(this),
      
      // Verarbeitung jeder Periode
      onPeriod: async function(s, cb) {
        // Zenbot-Kontext aktualisieren
        this.context = s;
        
        try {
          // Aktuelle Kerze extrahieren
          const currentCandle = {
            timestamp: s.period.time,
            open: s.period.open,
            high: s.period.high,
            low: s.period.low,
            close: s.period.close,
            volume: s.period.volume
          };
          
          // Historische Daten aktualisieren
          this.historicalData.push(currentCandle);
          
          // Nur die letzten n Perioden behalten
          if (this.historicalData.length > s.options.lookback_periods) {
            this.historicalData = this.historicalData.slice(-s.options.lookback_periods);
          }
          
          // Blockchain-Daten abrufen (alle 24 Perioden, um API-Aufrufe zu reduzieren)
          if (!this.blockchainData || this.historicalData.length % 24 === 0) {
            try {
              if (this.blockchainConnector) {
                this.blockchainData = await this.blockchainConnector.getMultipleMetrics([
                  'transactions', 'hashrate', 'difficulty', 'fees'
                ]);
                console.log('Blockchain data updated');
              }
            } catch (error) {
              console.error('Error fetching blockchain data:', error);
            }
          }
          
          // Genügend Daten für Vorhersage?
          if (this.historicalData.length >= s.options.min_periods) {
            // Daten für Modellvorhersage vorbereiten
            const normalizedData = this.prepareDataForPrediction(this.historicalData);
            
            // Modellvorhersage durchführen
            let prediction = null;
            if (this.modelManager) {
              try {
                prediction = await this.modelManager.predict(normalizedData.sequences[0]);
                console.log('Model prediction:', prediction);
              } catch (error) {
                console.error('Error making prediction:', error);
              }
            }
            
            // Handelssignal generieren
            let signal = null;
            if (this.signalGenerator && prediction) {
              const signalData = {
                currentPrice: currentCandle.close,
                predictedPrice: this.modelManager.denormalizePrediction(prediction, 'close')[0],
                blockchainMetrics: this.blockchainData
              };
              
              signal = this.signalGenerator.generateSignal(signalData);
              console.log('Generated signal:', signal);
            }
            
            // Risikomanagement anwenden
            if (this.riskManager && signal) {
              const marketData = {
                symbol: s.asset + '-' + s.currency,
                price: currentCandle.close,
                recentPrices: this.historicalData.map(candle => candle.close)
              };
              
              const accountData = {
                balance: s.balance.currency,
                asset: s.balance.asset
              };
              
              const action = this.riskManager.applyRiskManagement(signal, marketData, accountData);
              console.log('Risk management action:', action);
              
              // Handelsaktion ausführen
              this.executeAction(action, s);
            }
          }
          
          // Callback aufrufen
          cb();
        } catch (error) {
          console.error('Error in onPeriod:', error);
          cb();
        }
      }.bind(this),
      
      // Hilfsmethode zur Datenvorbereitung
      prepareDataForPrediction: function(candles) {
        if (!this.dataNormalizer) {
          throw new Error('Data normalizer not initialized');
        }
        
        // Features für die Vorhersage extrahieren
        const features = ['close', 'volume', 'high', 'low'];
        
        // Daten für LSTM vorbereiten
        return this.dataNormalizer.prepareLSTMData(
          candles,
          features,
          this.context.options.min_periods,
          1
        );
      }.bind(this),
      
      // Handelsaktion ausführen
      executeAction: function(action, s) {
        if (!action || action.type === 'none') {
          return;
        }
        
        switch (action.type) {
          case 'buy':
            // Kaufsignal
            if (s.signal !== 'buy') {
              s.signal = 'buy';
              console.log('BUY signal at', s.period.close);
              
              // Stop-Loss und Take-Profit setzen
              if (action.stopLoss) {
                s.stop_loss = action.stopLoss;
                console.log('Stop loss set at', s.stop_loss);
              }
              
              if (action.takeProfit) {
                s.take_profit = action.takeProfit;
                console.log('Take profit set at', s.take_profit);
              }
            }
            break;
            
          case 'sell':
            // Verkaufssignal
            if (s.signal !== 'sell') {
              s.signal = 'sell';
              console.log('SELL signal at', s.period.close);
              
              // Stop-Loss und Take-Profit setzen
              if (action.stopLoss) {
                s.stop_loss = action.stopLoss;
                console.log('Stop loss set at', s.stop_loss);
              }
              
              if (action.takeProfit) {
                s.take_profit = action.takeProfit;
                console.log('Take profit set at', s.take_profit);
              }
            }
            break;
            
          case 'close':
            // Position schließen
            if (s.position.side === 'long') {
              s.signal = 'sell';
              console.log('CLOSE LONG position at', s.period.close);
            } else if (s.position.side === 'short') {
              s.signal = 'buy';
              console.log('CLOSE SHORT position at', s.period.close);
            }
            break;
        }
        
        // Signal speichern
        this.lastSignal = action.type === 'buy' ? 1 : (action.type === 'sell' ? -1 : 0);
      }.bind(this),
      
      // Ereignishandler für den Handel
      onTrade: function(s) {
        console.log('Trade executed at', s.period.close);
        
        // Position im Risikomanager aktualisieren
        if (this.riskManager) {
          if (s.position.side === 'long') {
            this.riskManager.openPosition(
              s.asset + '-' + s.currency,
              'long',
              s.position.price,
              s.position.size
            );
          } else if (s.position.side === 'short') {
            this.riskManager.openPosition(
              s.asset + '-' + s.currency,
              'short',
              s.position.price,
              s.position.size
            );
          }
        }
      }.bind(this),
      
      // Ereignishandler für das Schließen einer Position
      onPositionClose: function(s) {
        console.log('Position closed at', s.period.close);
        
        // Geschlossene Position im Risikomanager aktualisieren
        if (this.riskManager) {
          const positions = this.riskManager.getOpenPositions();
          positions.forEach(position => {
            this.riskManager.closePosition(
              position.id,
              s.period.close,
              'zenbot_close'
            );
          });
        }
      }.bind(this)
    };
    
    return strategy;
  }

  /**
   * Exportiert die Strategie für Zenbot
   * @returns {Object} - Zenbot-Strategie
   */
  exportStrategy() {
    return this.createZenbotStrategy();
  }

  /**
   * Erstellt eine Zenbot-Konfigurationsdatei
   * @param {string} symbol - Handelssymbol
   * @param {Object} options - Zusätzliche Optionen
   * @returns {string} - Zenbot-Konfiguration als JSON-String
   */
  createZenbotConfig(symbol, options = {}) {
    const config = {
      sim: options.sim !== undefined ? options.sim : true,
      paper: options.paper !== undefined ? options.paper : true,
      currency_capital: options.currency_capital || 1000,
      asset_capital: options.asset_capital || 0,
      maker_fee: options.maker_fee || 0.1,
      taker_fee: options.taker_fee || 0.2,
      order_type: options.order_type || 'maker',
      mongo_url: options.mongo_url || 'mongodb://localhost:27017/zenbot4',
      
      // Strategie-Konfiguration
      strategy: this.strategyName,
      period: this.params.period,
      min_periods: this.params.min_periods,
      lookback_periods: this.params.lookback_periods,
      buy_threshold: this.params.buy_threshold,
      sell_threshold: this.params.sell_threshold,
      stop_loss_pct: this.params.stop_loss_pct,
      take_profit_pct: this.params.take_profit_pct,
      trailing_stop_pct: this.params.trailing_stop_pct,
      max_position_size: this.params.max_position_size,
      risk_per_trade: this.params.risk_per_trade,
      price_weight: this.params.price_weight,
      blockchain_weight: this.params.blockchain_weight,
      
      // Handelspaar
      selector: symbol
    };
    
    return JSON.stringify(config, null, 2);
  }

  /**
   * Erstellt ein Zenbot-Kommando für Backtesting
   * @param {string} symbol - Handelssymbol
   * @param {string} days - Anzahl der Tage für Backtesting
   * @returns {string} - Zenbot-Kommando
   */
  createBacktestCommand(symbol, days = '90') {
    return `./zenbot.sh backfill ${symbol} --days=${days} && ./zenbot.sh sim ${symbol} --strategy=${this.strategyName} --period=${this.params.period} --min_periods=${this.params.min_periods} --lookback_periods=${this.params.lookback_periods} --buy_threshold=${this.params.buy_threshold} --sell_threshold=${this.params.sell_threshold} --stop_loss_pct=${this.params.stop_loss_pct} --take_profit_pct=${this.params.take_profit_pct} --trailing_stop_pct=${this.params.trailing_stop_pct} --max_position_size=${this.params.max_position_size} --risk_per_trade=${this.params.risk_per_trade} --price_weight=${this.params.price_weight} --blockchain_weight=${this.params.blockchain_weight}`;
  }

  /**
   * Erstellt ein Zenbot-Kommando für Live-Trading
   * @param {string} symbol - Handelssymbol
   * @param {boolean} paper - Paper-Trading aktivieren
   * @returns {string} - Zenbot-Kommando
   */
  createLiveCommand(symbol, paper = true) {
    const paperFlag = paper ? '--paper' : '';
    return `./zenbot.sh trade ${symbol} ${paperFlag} --strategy=${this.strategyName} --period=${this.params.period} --min_periods=${this.params.min_periods} --lookback_periods=${this.params.lookback_periods} --buy_threshold=${this.params.buy_threshold} --sell_threshold=${this.params.sell_threshold} --stop_loss_pct=${this.params.stop_loss_pct} --take_profit_pct=${this.params.take_profit_pct} --trailing_stop_pct=${this.params.trailing_stop_pct} --max_position_size=${this.params.max_position_size} --risk_per_trade=${this.params.risk_per_trade} --price_weight=${this.params.price_weight} --blockchain_weight=${this.params.blockchain_weight}`;
  }
}

module.exports = ZenbotAdapter;
