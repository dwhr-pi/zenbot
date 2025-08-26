/**
 * Multi-Trading-Manager für Zenbot
 * 
 * Zentrale Steuerungseinheit für das parallele Trading mehrerer Coins
 * mit individuellen Strategien auf verschiedenen Börsen.
 */

const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const TradeInstanceController = require('./trade_instance_controller');
const ConfigManager = require('./config_manager');
const Logger = require('./logger');

class MultiTradingManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.configManager = new ConfigManager(options.configPath || path.resolve(__dirname, '../config/multi_trading.json'));
    this.logger = new Logger(options.logLevel || 'info', options.logPath || path.resolve(__dirname, '../logs'));
    this.instances = new Map();
    this.isRunning = false;
    this.stats = {
      totalInstances: 0,
      activeInstances: 0,
      successfulTrades: 0,
      failedTrades: 0,
      totalProfit: 0
    };
  }

  /**
   * Initialisiert den Multi-Trading-Manager
   */
  async init() {
    try {
      this.logger.info('Initialisiere Multi-Trading-Manager');
      await this.configManager.load();
      this.logger.info(`Konfiguration geladen: ${this.configManager.getConfig().instances.length} Trading-Instanzen konfiguriert`);
      return true;
    } catch (error) {
      this.logger.error(`Fehler bei der Initialisierung des Multi-Trading-Managers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Startet alle konfigurierten Trading-Instanzen
   */
  async start() {
    if (this.isRunning) {
      this.logger.warn('Multi-Trading-Manager läuft bereits');
      return;
    }

    try {
      this.logger.info('Starte Multi-Trading-Manager');
      const config = this.configManager.getConfig();
      
      // Instanzen für alle konfigurierten Coins erstellen und starten
      for (const instanceConfig of config.instances) {
        await this.createAndStartInstance(instanceConfig);
      }

      this.isRunning = true;
      this.startMonitoring();
      this.logger.info(`Multi-Trading-Manager gestartet mit ${this.instances.size} Instanzen`);
      this.emit('started', { instanceCount: this.instances.size });
    } catch (error) {
      this.logger.error(`Fehler beim Starten des Multi-Trading-Managers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Erstellt und startet eine einzelne Trading-Instanz
   */
  async createAndStartInstance(instanceConfig) {
    const instanceId = `${instanceConfig.exchange}_${instanceConfig.coin}_${instanceConfig.strategy}`;
    
    if (this.instances.has(instanceId)) {
      this.logger.warn(`Trading-Instanz ${instanceId} existiert bereits`);
      return;
    }

    try {
      this.logger.info(`Erstelle Trading-Instanz für ${instanceConfig.coin} auf ${instanceConfig.exchange} mit Strategie ${instanceConfig.strategy}`);
      
      const instance = new TradeInstanceController({
        id: instanceId,
        config: instanceConfig,
        logger: this.logger.createChildLogger(instanceId)
      });

      // Event-Handler für die Instanz registrieren
      instance.on('trade', this.handleInstanceTrade.bind(this));
      instance.on('error', this.handleInstanceError.bind(this));
      instance.on('status', this.handleInstanceStatus.bind(this));

      // Instanz initialisieren und starten
      await instance.init();
      await instance.start();

      // Instanz zur Verwaltung hinzufügen
      this.instances.set(instanceId, instance);
      this.stats.totalInstances++;
      this.stats.activeInstances++;

      this.logger.info(`Trading-Instanz ${instanceId} erfolgreich gestartet`);
      this.emit('instanceStarted', { instanceId, config: instanceConfig });
      
      return instance;
    } catch (error) {
      this.logger.error(`Fehler beim Erstellen der Trading-Instanz ${instanceId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stoppt alle laufenden Trading-Instanzen
   */
  async stop() {
    if (!this.isRunning) {
      this.logger.warn('Multi-Trading-Manager läuft nicht');
      return;
    }

    try {
      this.logger.info('Stoppe Multi-Trading-Manager');
      
      // Alle Instanzen stoppen
      const stopPromises = [];
      for (const [instanceId, instance] of this.instances.entries()) {
        this.logger.info(`Stoppe Trading-Instanz ${instanceId}`);
        stopPromises.push(instance.stop());
      }
      
      await Promise.all(stopPromises);
      
      this.isRunning = false;
      this.stopMonitoring();
      this.logger.info('Multi-Trading-Manager gestoppt');
      this.emit('stopped');
    } catch (error) {
      this.logger.error(`Fehler beim Stoppen des Multi-Trading-Managers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fügt eine neue Trading-Instanz hinzu
   */
  async addInstance(instanceConfig) {
    if (!this.isRunning) {
      this.logger.warn('Multi-Trading-Manager muss gestartet sein, um Instanzen hinzuzufügen');
      return;
    }

    try {
      const instance = await this.createAndStartInstance(instanceConfig);
      
      // Konfiguration aktualisieren
      const config = this.configManager.getConfig();
      config.instances.push(instanceConfig);
      await this.configManager.save(config);
      
      return instance;
    } catch (error) {
      this.logger.error(`Fehler beim Hinzufügen einer Trading-Instanz: ${error.message}`);
      throw error;
    }
  }

  /**
   * Entfernt eine Trading-Instanz
   */
  async removeInstance(instanceId) {
    if (!this.isRunning) {
      this.logger.warn('Multi-Trading-Manager muss gestartet sein, um Instanzen zu entfernen');
      return;
    }

    if (!this.instances.has(instanceId)) {
      this.logger.warn(`Trading-Instanz ${instanceId} existiert nicht`);
      return;
    }

    try {
      const instance = this.instances.get(instanceId);
      
      // Instanz stoppen
      await instance.stop();
      
      // Instanz aus der Verwaltung entfernen
      this.instances.delete(instanceId);
      this.stats.activeInstances--;
      
      // Konfiguration aktualisieren
      const config = this.configManager.getConfig();
      const instanceIndex = config.instances.findIndex(inst => 
        inst.exchange === instance.config.exchange && 
        inst.coin === instance.config.coin && 
        inst.strategy === instance.config.strategy
      );
      
      if (instanceIndex !== -1) {
        config.instances.splice(instanceIndex, 1);
        await this.configManager.save(config);
      }
      
      this.logger.info(`Trading-Instanz ${instanceId} erfolgreich entfernt`);
      this.emit('instanceRemoved', { instanceId });
    } catch (error) {
      this.logger.error(`Fehler beim Entfernen der Trading-Instanz ${instanceId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Aktualisiert die Konfiguration einer Trading-Instanz
   */
  async updateInstanceConfig(instanceId, newConfig) {
    if (!this.instances.has(instanceId)) {
      this.logger.warn(`Trading-Instanz ${instanceId} existiert nicht`);
      return;
    }

    try {
      const instance = this.instances.get(instanceId);
      
      // Instanz stoppen
      await instance.stop();
      
      // Konfiguration aktualisieren
      await instance.updateConfig(newConfig);
      
      // Instanz neu starten
      await instance.start();
      
      // Globale Konfiguration aktualisieren
      const config = this.configManager.getConfig();
      const instanceIndex = config.instances.findIndex(inst => 
        inst.exchange === instance.config.exchange && 
        inst.coin === instance.config.coin && 
        inst.strategy === instance.config.strategy
      );
      
      if (instanceIndex !== -1) {
        config.instances[instanceIndex] = newConfig;
        await this.configManager.save(config);
      }
      
      this.logger.info(`Konfiguration der Trading-Instanz ${instanceId} erfolgreich aktualisiert`);
      this.emit('instanceUpdated', { instanceId, config: newConfig });
    } catch (error) {
      this.logger.error(`Fehler beim Aktualisieren der Konfiguration der Trading-Instanz ${instanceId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Startet das Monitoring aller Trading-Instanzen
   */
  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.collectStats();
    }, 60000); // Alle 60 Sekunden
  }

  /**
   * Stoppt das Monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Sammelt Statistiken aller Trading-Instanzen
   */
  collectStats() {
    const stats = {
      totalInstances: this.instances.size,
      activeInstances: 0,
      successfulTrades: 0,
      failedTrades: 0,
      totalProfit: 0,
      instanceStats: {}
    };

    for (const [instanceId, instance] of this.instances.entries()) {
      const instanceStats = instance.getStats();
      stats.instanceStats[instanceId] = instanceStats;
      
      if (instanceStats.isActive) {
        stats.activeInstances++;
      }
      
      stats.successfulTrades += instanceStats.successfulTrades || 0;
      stats.failedTrades += instanceStats.failedTrades || 0;
      stats.totalProfit += instanceStats.totalProfit || 0;
    }

    this.stats = stats;
    this.emit('stats', stats);
    this.logger.debug(`Statistiken aktualisiert: ${JSON.stringify(stats)}`);
  }

  /**
   * Gibt die aktuellen Statistiken zurück
   */
  getStats() {
    return this.stats;
  }

  /**
   * Event-Handler für Trades einer Instanz
   */
  handleInstanceTrade(data) {
    this.logger.info(`Trade ausgeführt: ${data.instanceId} - ${data.type} ${data.amount} ${data.coin} @ ${data.price}`);
    this.emit('trade', data);
  }

  /**
   * Event-Handler für Fehler einer Instanz
   */
  handleInstanceError(data) {
    this.logger.error(`Fehler in Instanz ${data.instanceId}: ${data.error}`);
    this.emit('error', data);
  }

  /**
   * Event-Handler für Statusänderungen einer Instanz
   */
  handleInstanceStatus(data) {
    this.logger.info(`Statusänderung: ${data.instanceId} - ${data.status}`);
    this.emit('instanceStatus', data);
  }
}

module.exports = MultiTradingManager;
