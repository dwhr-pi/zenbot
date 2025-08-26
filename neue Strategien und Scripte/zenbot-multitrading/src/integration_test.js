/**
 * Integration Test für Zenbot Multi-Trading
 * 
 * Testet die parallele Ausführung mehrerer Trading-Instanzen
 * mit verschiedenen Coins und Börsen.
 */

const path = require('path');
const MultiTradingManager = require('./multi_trading_manager');
const ConfigManager = require('./config_manager');
const Logger = require('./logger');

async function runIntegrationTest() {
  try {
    // Logger initialisieren
    const logger = new Logger('debug', path.resolve(__dirname, '../logs'));
    await logger.init();
    
    logger.info('Starte Integration Test für Zenbot Multi-Trading');
    
    // Konfigurationsmanager initialisieren
    const configPath = path.resolve(__dirname, '../config/test_config.json');
    const configManager = new ConfigManager(configPath);
    
    // Testkonfiguration erstellen
    const testConfig = {
      instances: [
        {
          exchange: 'binance',
          coin: 'BTC',
          strategy: 'macd_cross',
          apiKey: 'test_api_key_1',
          apiSecret: 'test_api_secret_1',
          strategyParams: {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            upThreshold: 0.1,
            downThreshold: -0.1
          },
          riskParams: {
            maxPositionSize: 0.05,
            maxOpenPositions: 3,
            maxDailyLoss: 0.03
          }
        },
        {
          exchange: 'kraken',
          coin: 'ETH',
          strategy: 'rsi',
          apiKey: 'test_api_key_2',
          apiSecret: 'test_api_secret_2',
          strategyParams: {
            period: 14,
            overbought: 70,
            oversold: 30
          },
          riskParams: {
            maxPositionSize: 0.03,
            maxOpenPositions: 2,
            maxDailyLoss: 0.02
          }
        },
        {
          exchange: 'coinbase',
          coin: 'LTC',
          strategy: 'bollinger_bands',
          apiKey: 'test_api_key_3',
          apiSecret: 'test_api_secret_3',
          strategyParams: {
            period: 20,
            stdDev: 2
          },
          riskParams: {
            maxPositionSize: 0.04,
            maxOpenPositions: 2,
            maxDailyLoss: 0.025
          }
        }
      ],
      globalSettings: {
        maxParallelInstances: 10,
        defaultRiskParams: {
          maxPositionSize: 0.05,
          maxOpenPositions: 3,
          maxDailyLoss: 0.03
        },
        logLevel: 'debug',
        monitoringInterval: 30000
      }
    };
    
    // Testkonfiguration speichern
    await configManager.save(testConfig);
    logger.info('Testkonfiguration erstellt');
    
    // Multi-Trading-Manager initialisieren
    const manager = new MultiTradingManager({
      configPath,
      logLevel: 'debug',
      logPath: path.resolve(__dirname, '../logs')
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
    
    // Warten, um die Ausführung zu beobachten
    logger.info('Warte 60 Sekunden, um die Ausführung zu beobachten...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Neue Instanz hinzufügen
    logger.info('Füge neue Trading-Instanz hinzu');
    await manager.addInstance({
      exchange: 'bitfinex',
      coin: 'XRP',
      strategy: 'macd_cross',
      apiKey: 'test_api_key_4',
      apiSecret: 'test_api_secret_4',
      strategyParams: {
        fastPeriod: 10,
        slowPeriod: 20,
        signalPeriod: 7,
        upThreshold: 0.05,
        downThreshold: -0.05
      },
      riskParams: {
        maxPositionSize: 0.02,
        maxOpenPositions: 1,
        maxDailyLoss: 0.01
      }
    });
    
    logger.info('Neue Trading-Instanz erfolgreich hinzugefügt');
    
    // Warten, um die Ausführung zu beobachten
    logger.info('Warte weitere 60 Sekunden, um die Ausführung zu beobachten...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Instanz entfernen
    logger.info('Entferne Trading-Instanz');
    await manager.removeInstance('binance_BTC_macd_cross');
    
    logger.info('Trading-Instanz erfolgreich entfernt');
    
    // Warten, um die Ausführung zu beobachten
    logger.info('Warte weitere 60 Sekunden, um die Ausführung zu beobachten...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Multi-Trading-Manager stoppen
    await manager.stop();
    
    logger.info('Multi-Trading-Manager erfolgreich gestoppt');
    logger.info('Integration Test erfolgreich abgeschlossen');
    
    return true;
  } catch (error) {
    console.error(`Fehler im Integration Test: ${error.message}`);
    throw error;
  }
}

// Test ausführen, wenn die Datei direkt ausgeführt wird
if (require.main === module) {
  runIntegrationTest()
    .then(() => {
      console.log('Integration Test erfolgreich abgeschlossen');
      process.exit(0);
    })
    .catch(error => {
      console.error(`Fehler im Integration Test: ${error.message}`);
      process.exit(1);
    });
}

module.exports = runIntegrationTest;
