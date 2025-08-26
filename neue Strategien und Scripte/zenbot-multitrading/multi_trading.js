/**
 * Hauptskript für Zenbot Multi-Trading
 * 
 * Stellt die Befehlszeilenschnittstelle für das Multi-Trading-System bereit.
 */

const path = require('path');
const fs = require('fs').promises;
const program = require('commander');
const MultiTradingManager = require('./src/multi_trading_manager');
const ConfigManager = require('./src/config_manager');
const Logger = require('./src/logger');

// Verzeichnisse
const CONFIG_DIR = path.resolve(__dirname, 'config');
const LOG_DIR = path.resolve(__dirname, 'logs');

// Konfigurationsdatei
const CONFIG_FILE = path.resolve(CONFIG_DIR, 'multi_trading.json');

// Logger initialisieren
const logger = new Logger('info', LOG_DIR);

// Multi-Trading-Manager
let manager = null;

/**
 * Initialisiert die Umgebung
 */
async function initEnvironment() {
  try {
    // Verzeichnisse erstellen, falls sie nicht existieren
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    await fs.mkdir(LOG_DIR, { recursive: true });
    
    // Logger initialisieren
    await logger.init();
    
    return true;
  } catch (error) {
    console.error(`Fehler bei der Initialisierung der Umgebung: ${error.message}`);
    throw error;
  }
}

/**
 * Initialisiert und startet den Multi-Trading-Manager
 */
async function startManager(options) {
  try {
    // Umgebung initialisieren
    await initEnvironment();
    
    // Konfigurationsmanager initialisieren
    const configManager = new ConfigManager(CONFIG_FILE);
    
    // Multi-Trading-Manager initialisieren
    manager = new MultiTradingManager({
      configPath: CONFIG_FILE,
      logLevel: options.logLevel || 'info',
      logPath: LOG_DIR
    });
    
    // Event-Handler registrieren
    manager.on('started', (data) => {
      logger.info(`Multi-Trading-Manager gestartet mit ${data.instanceCount} Instanzen`);
    });
    
    manager.on('instanceStarted', (data) => {
      logger.info(`Trading-Instanz ${data.instanceId} gestartet`);
    });
    
    manager.on('trade', (data) => {
      logger.info(`Trade ausgeführt: ${data.instanceId} - ${data.type} ${data.amount} ${data.coin} @ ${data.price}`);
    });
    
    manager.on('error', (data) => {
      logger.error(`Fehler in Instanz ${data.instanceId}: ${data.error}`);
    });
    
    manager.on('instanceStatus', (data) => {
      logger.info(`Statusänderung: ${data.instanceId} - ${data.status}`);
    });
    
    manager.on('stats', (data) => {
      logger.info(`Statistiken aktualisiert: ${JSON.stringify(data)}`);
    });
    
    // Multi-Trading-Manager initialisieren und starten
    await manager.init();
    await manager.start();
    
    logger.info('Multi-Trading-Manager erfolgreich gestartet');
    
    return true;
  } catch (error) {
    logger.error(`Fehler beim Starten des Multi-Trading-Managers: ${error.message}`);
    throw error;
  }
}

/**
 * Stoppt den Multi-Trading-Manager
 */
async function stopManager() {
  try {
    if (!manager) {
      logger.warn('Multi-Trading-Manager ist nicht gestartet');
      return;
    }
    
    await manager.stop();
    logger.info('Multi-Trading-Manager erfolgreich gestoppt');
    
    return true;
  } catch (error) {
    logger.error(`Fehler beim Stoppen des Multi-Trading-Managers: ${error.message}`);
    throw error;
  }
}

/**
 * Fügt eine neue Trading-Instanz hinzu
 */
async function addInstance(exchange, coin, strategy, options) {
  try {
    if (!manager) {
      logger.warn('Multi-Trading-Manager ist nicht gestartet');
      return;
    }
    
    // Strategie-Parameter parsen
    let strategyParams = {};
    if (options.strategyParams) {
      try {
        strategyParams = JSON.parse(options.strategyParams);
      } catch (error) {
        throw new Error(`Ungültige Strategie-Parameter: ${error.message}`);
      }
    }
    
    // Risiko-Parameter parsen
    let riskParams = {};
    if (options.riskParams) {
      try {
        riskParams = JSON.parse(options.riskParams);
      } catch (error) {
        throw new Error(`Ungültige Risiko-Parameter: ${error.message}`);
      }
    }
    
    // Instanz-Konfiguration erstellen
    const instanceConfig = {
      exchange,
      coin,
      strategy,
      apiKey: options.apiKey,
      apiSecret: options.apiSecret,
      strategyParams,
      riskParams
    };
    
    // Instanz hinzufügen
    await manager.addInstance(instanceConfig);
    
    logger.info(`Trading-Instanz für ${coin} auf ${exchange} mit Strategie ${strategy} erfolgreich hinzugefügt`);
    
    return true;
  } catch (error) {
    logger.error(`Fehler beim Hinzufügen der Trading-Instanz: ${error.message}`);
    throw error;
  }
}

/**
 * Entfernt eine Trading-Instanz
 */
async function removeInstance(instanceId) {
  try {
    if (!manager) {
      logger.warn('Multi-Trading-Manager ist nicht gestartet');
      return;
    }
    
    await manager.removeInstance(instanceId);
    
    logger.info(`Trading-Instanz ${instanceId} erfolgreich entfernt`);
    
    return true;
  } catch (error) {
    logger.error(`Fehler beim Entfernen der Trading-Instanz: ${error.message}`);
    throw error;
  }
}

/**
 * Zeigt die Statistiken aller Trading-Instanzen an
 */
function showStats() {
  try {
    if (!manager) {
      logger.warn('Multi-Trading-Manager ist nicht gestartet');
      return;
    }
    
    const stats = manager.getStats();
    
    console.log('\nStatistiken:');
    console.log('============');
    console.log(`Gesamtanzahl Instanzen: ${stats.totalInstances}`);
    console.log(`Aktive Instanzen: ${stats.activeInstances}`);
    console.log(`Erfolgreiche Trades: ${stats.successfulTrades}`);
    console.log(`Fehlgeschlagene Trades: ${stats.failedTrades}`);
    console.log(`Gesamtgewinn: ${stats.totalProfit}`);
    
    console.log('\nInstanz-Statistiken:');
    console.log('===================');
    for (const [instanceId, instanceStats] of Object.entries(stats.instanceStats || {})) {
      console.log(`\nInstanz: ${instanceId}`);
      console.log(`Status: ${instanceStats.isActive ? 'Aktiv' : 'Inaktiv'}`);
      console.log(`Erfolgreiche Trades: ${instanceStats.successfulTrades}`);
      console.log(`Fehlgeschlagene Trades: ${instanceStats.failedTrades}`);
      console.log(`Gesamtgewinn: ${instanceStats.totalProfit}`);
      console.log(`Letzter Trade: ${instanceStats.lastTradeTime ? new Date(instanceStats.lastTradeTime).toLocaleString() : 'Keiner'}`);
      console.log(`Offene Positionen: ${instanceStats.openPositions}`);
      
      if (instanceStats.balance) {
        console.log(`Kontostand: Verfügbar: ${instanceStats.balance.available}, In Order: ${instanceStats.balance.inOrder}, Gesamt: ${instanceStats.balance.total}`);
      }
    }
    
    return true;
  } catch (error) {
    logger.error(`Fehler beim Anzeigen der Statistiken: ${error.message}`);
    throw error;
  }
}

// Befehlszeilenschnittstelle konfigurieren
program
  .version('1.0.0')
  .description('Zenbot Multi-Trading - Handeln Sie mehrere Coins mit individuellen Strategien auf verschiedenen Börsen');

// Start-Befehl
program
  .command('start')
  .description('Startet den Multi-Trading-Manager')
  .option('-l, --log-level <level>', 'Log-Level (debug, info, warn, error)', 'info')
  .action(async (options) => {
    try {
      await startManager(options);
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Stop-Befehl
program
  .command('stop')
  .description('Stoppt den Multi-Trading-Manager')
  .action(async () => {
    try {
      await stopManager();
      process.exit(0);
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Add-Befehl
program
  .command('add <exchange> <coin> <strategy>')
  .description('Fügt eine neue Trading-Instanz hinzu')
  .option('-k, --api-key <key>', 'API-Schlüssel für die Börse')
  .option('-s, --api-secret <secret>', 'API-Secret für die Börse')
  .option('-p, --strategy-params <params>', 'Strategie-Parameter als JSON-String')
  .option('-r, --risk-params <params>', 'Risiko-Parameter als JSON-String')
  .action(async (exchange, coin, strategy, options) => {
    try {
      await addInstance(exchange, coin, strategy, options);
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Remove-Befehl
program
  .command('remove <instanceId>')
  .description('Entfernt eine Trading-Instanz')
  .action(async (instanceId) => {
    try {
      await removeInstance(instanceId);
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Stats-Befehl
program
  .command('stats')
  .description('Zeigt die Statistiken aller Trading-Instanzen an')
  .action(() => {
    try {
      showStats();
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Test-Befehl
program
  .command('test')
  .description('Führt den Integrationstest aus')
  .action(async () => {
    try {
      const runIntegrationTest = require('./src/integration_test');
      await runIntegrationTest();
      process.exit(0);
    } catch (error) {
      console.error(`Fehler: ${error.message}`);
      process.exit(1);
    }
  });

// Hilfe anzeigen, wenn kein Befehl angegeben wurde
if (process.argv.length === 2) {
  program.help();
}

// Befehlszeilenschnittstelle parsen
program.parse(process.argv);
