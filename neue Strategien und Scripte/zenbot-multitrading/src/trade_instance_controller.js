/**
 * Trading-Instanz-Controller für Zenbot Multi-Trading
 * 
 * Verwaltet eine einzelne Trading-Instanz für einen spezifischen Coin
 * mit einer individuellen Strategie auf einer bestimmten Börse.
 */

const EventEmitter = require('events');
const StrategyManager = require('./strategy_manager');
const ExchangeConnector = require('./exchange_connector');

class TradeInstanceController extends EventEmitter {
  constructor(options = {}) {
    super();
    this.id = options.id;
    this.config = options.config;
    this.logger = options.logger;
    this.strategyManager = null;
    this.exchangeConnector = null;
    this.isRunning = false;
    this.stats = {
      isActive: false,
      successfulTrades: 0,
      failedTrades: 0,
      totalProfit: 0,
      lastTradeTime: null,
      openPositions: 0,
      balance: {}
    };
  }

  /**
   * Initialisiert die Trading-Instanz
   */
  async init() {
    try {
      this.logger.info(`Initialisiere Trading-Instanz ${this.id}`);
      
      // Exchange-Connector initialisieren
      this.exchangeConnector = new ExchangeConnector({
        exchange: this.config.exchange,
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret,
        logger: this.logger
      });
      
      await this.exchangeConnector.init();
      
      // Strategie-Manager initialisieren
      this.strategyManager = new StrategyManager({
        strategy: this.config.strategy,
        strategyParams: this.config.strategyParams,
        logger: this.logger
      });
      
      await this.strategyManager.init();
      
      this.logger.info(`Trading-Instanz ${this.id} erfolgreich initialisiert`);
      return true;
    } catch (error) {
      this.logger.error(`Fehler bei der Initialisierung der Trading-Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Startet die Trading-Instanz
   */
  async start() {
    if (this.isRunning) {
      this.logger.warn(`Trading-Instanz ${this.id} läuft bereits`);
      return;
    }

    try {
      this.logger.info(`Starte Trading-Instanz ${this.id}`);
      
      // Verbindung zur Börse herstellen
      await this.exchangeConnector.connect();
      
      // Strategie starten
      await this.strategyManager.start();
      
      // Trading-Loop starten
      this.startTradingLoop();
      
      this.isRunning = true;
      this.stats.isActive = true;
      
      this.logger.info(`Trading-Instanz ${this.id} erfolgreich gestartet`);
      this.emit('status', { instanceId: this.id, status: 'started' });
    } catch (error) {
      this.logger.error(`Fehler beim Starten der Trading-Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stoppt die Trading-Instanz
   */
  async stop() {
    if (!this.isRunning) {
      this.logger.warn(`Trading-Instanz ${this.id} läuft nicht`);
      return;
    }

    try {
      this.logger.info(`Stoppe Trading-Instanz ${this.id}`);
      
      // Trading-Loop stoppen
      this.stopTradingLoop();
      
      // Strategie stoppen
      await this.strategyManager.stop();
      
      // Verbindung zur Börse trennen
      await this.exchangeConnector.disconnect();
      
      this.isRunning = false;
      this.stats.isActive = false;
      
      this.logger.info(`Trading-Instanz ${this.id} erfolgreich gestoppt`);
      this.emit('status', { instanceId: this.id, status: 'stopped' });
    } catch (error) {
      this.logger.error(`Fehler beim Stoppen der Trading-Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Aktualisiert die Konfiguration der Trading-Instanz
   */
  async updateConfig(newConfig) {
    try {
      this.logger.info(`Aktualisiere Konfiguration der Trading-Instanz ${this.id}`);
      
      // Konfiguration aktualisieren
      this.config = { ...this.config, ...newConfig };
      
      // Strategie-Manager aktualisieren, falls notwendig
      if (newConfig.strategy || newConfig.strategyParams) {
        await this.strategyManager.updateConfig({
          strategy: newConfig.strategy || this.config.strategy,
          strategyParams: newConfig.strategyParams || this.config.strategyParams
        });
      }
      
      // Exchange-Connector aktualisieren, falls notwendig
      if (newConfig.exchange || newConfig.apiKey || newConfig.apiSecret) {
        await this.exchangeConnector.updateConfig({
          exchange: newConfig.exchange || this.config.exchange,
          apiKey: newConfig.apiKey || this.config.apiKey,
          apiSecret: newConfig.apiSecret || this.config.apiSecret
        });
      }
      
      this.logger.info(`Konfiguration der Trading-Instanz ${this.id} erfolgreich aktualisiert`);
    } catch (error) {
      this.logger.error(`Fehler beim Aktualisieren der Konfiguration der Trading-Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Startet den Trading-Loop
   */
  startTradingLoop() {
    this.logger.info(`Starte Trading-Loop für Instanz ${this.id}`);
    
    // Trading-Loop alle 10 Sekunden ausführen
    this.tradingLoopInterval = setInterval(async () => {
      try {
        await this.executeTradingCycle();
      } catch (error) {
        this.logger.error(`Fehler im Trading-Loop der Instanz ${this.id}: ${error.message}`);
        this.emit('error', { instanceId: this.id, error: error.message });
      }
    }, 10000);
  }

  /**
   * Stoppt den Trading-Loop
   */
  stopTradingLoop() {
    if (this.tradingLoopInterval) {
      clearInterval(this.tradingLoopInterval);
      this.tradingLoopInterval = null;
      this.logger.info(`Trading-Loop für Instanz ${this.id} gestoppt`);
    }
  }

  /**
   * Führt einen Trading-Zyklus aus
   */
  async executeTradingCycle() {
    try {
      // Marktdaten abrufen
      const marketData = await this.exchangeConnector.getMarketData(this.config.coin);
      
      // Strategie auswerten
      const signal = await this.strategyManager.evaluate(marketData);
      
      // Handelssignal verarbeiten
      if (signal) {
        await this.processTradeSignal(signal, marketData);
      }
      
      // Statistiken aktualisieren
      await this.updateStats();
    } catch (error) {
      this.logger.error(`Fehler im Trading-Zyklus der Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verarbeitet ein Handelssignal
   */
  async processTradeSignal(signal, marketData) {
    try {
      this.logger.info(`Handelssignal für Instanz ${this.id}: ${signal.type} ${this.config.coin}`);
      
      // Risikomanagement anwenden
      const riskAdjustedAmount = this.applyRiskManagement(signal.amount, marketData);
      
      // Trade ausführen
      const tradeResult = await this.exchangeConnector.executeTrade({
        coin: this.config.coin,
        type: signal.type,
        amount: riskAdjustedAmount,
        price: signal.price
      });
      
      // Erfolgreich ausgeführten Trade verarbeiten
      if (tradeResult.success) {
        this.stats.successfulTrades++;
        this.stats.lastTradeTime = new Date();
        this.stats.totalProfit += tradeResult.profit || 0;
        
        if (signal.type === 'buy') {
          this.stats.openPositions++;
        } else if (signal.type === 'sell') {
          this.stats.openPositions = Math.max(0, this.stats.openPositions - 1);
        }
        
        this.emit('trade', {
          instanceId: this.id,
          coin: this.config.coin,
          exchange: this.config.exchange,
          type: signal.type,
          amount: riskAdjustedAmount,
          price: tradeResult.price,
          profit: tradeResult.profit,
          timestamp: new Date()
        });
      } else {
        this.stats.failedTrades++;
        this.logger.error(`Trade fehlgeschlagen für Instanz ${this.id}: ${tradeResult.error}`);
        this.emit('error', { instanceId: this.id, error: tradeResult.error });
      }
    } catch (error) {
      this.logger.error(`Fehler bei der Verarbeitung des Handelssignals für Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Wendet Risikomanagement auf die Handelsmenge an
   */
  applyRiskManagement(amount, marketData) {
    // Maximale Position pro Trade (% des verfügbaren Kapitals)
    const maxPositionSize = this.config.riskParams?.maxPositionSize || 0.05; // 5% Standard
    
    // Maximale Anzahl offener Positionen
    const maxOpenPositions = this.config.riskParams?.maxOpenPositions || 3;
    
    // Maximaler täglicher Verlust
    const maxDailyLoss = this.config.riskParams?.maxDailyLoss || 0.03; // 3% Standard
    
    // Verfügbares Kapital
    const availableCapital = this.stats.balance.available || 0;
    
    // Risikoangepasste Menge berechnen
    let adjustedAmount = amount;
    
    // Maximale Positionsgröße anwenden
    const maxAmount = availableCapital * maxPositionSize;
    adjustedAmount = Math.min(adjustedAmount, maxAmount);
    
    // Maximale Anzahl offener Positionen berücksichtigen
    if (this.stats.openPositions >= maxOpenPositions) {
      this.logger.warn(`Maximale Anzahl offener Positionen (${maxOpenPositions}) erreicht für Instanz ${this.id}`);
      adjustedAmount = 0;
    }
    
    // Maximalen täglichen Verlust berücksichtigen
    const dailyLoss = this.getDailyLoss();
    const maxAllowedLoss = availableCapital * maxDailyLoss;
    
    if (dailyLoss >= maxAllowedLoss) {
      this.logger.warn(`Maximaler täglicher Verlust (${maxDailyLoss * 100}%) erreicht für Instanz ${this.id}`);
      adjustedAmount = 0;
    }
    
    return adjustedAmount;
  }

  /**
   * Berechnet den täglichen Verlust
   */
  getDailyLoss() {
    // Implementierung der Berechnung des täglichen Verlusts
    // Hier müsste eine Logik implementiert werden, die alle Trades des aktuellen Tages berücksichtigt
    // und den Gesamtverlust berechnet
    
    // Vereinfachte Implementierung für dieses Beispiel
    return Math.max(0, -this.stats.totalProfit);
  }

  /**
   * Aktualisiert die Statistiken der Trading-Instanz
   */
  async updateStats() {
    try {
      // Kontostand abrufen
      const balance = await this.exchangeConnector.getBalance(this.config.coin);
      this.stats.balance = balance;
      
      // Offene Positionen aktualisieren
      const openPositions = await this.exchangeConnector.getOpenPositions(this.config.coin);
      this.stats.openPositions = openPositions.length;
      
      return this.stats;
    } catch (error) {
      this.logger.error(`Fehler beim Aktualisieren der Statistiken der Trading-Instanz ${this.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gibt die aktuellen Statistiken zurück
   */
  getStats() {
    return this.stats;
  }
}

module.exports = TradeInstanceController;
