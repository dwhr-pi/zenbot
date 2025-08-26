// Beispiel-Skript für Backtesting des Trading-Algorithmus
// Führt Backtesting mit historischen Daten durch und visualisiert die Ergebnisse

// Trading-Algorithmus importieren
const TradingAlgorithm = require('./trading_algorithm');

// Konfiguration für den Algorithmus
const config = {
  // Handelspaar
  symbol: 'BTCUSDT',
  timeframe: '1h',
  
  // Modelleinstellungen
  windowSize: 50,
  features: ['close', 'volume', 'high', 'low'],
  learningRate: 0.001,
  epochs: 100,
  batchSize: 32,
  
  // Signalgenerator-Einstellungen
  buyThreshold: 1.5,
  sellThreshold: -1.0,
  priceWeight: 0.6,
  onChainWeight: 0.4,
  
  // Risikomanagement-Einstellungen
  stopLossPercentage: 2.0,
  takeProfitPercentage: 3.0,
  trailingStopPercentage: 1.5,
  maxPositionSize: 0.1,
  riskPerTrade: 0.01
};

// Funktion zum Ausführen des Backtests
async function runBacktest() {
  try {
    console.log('Starting backtesting process...');
    
    // Trading-Algorithmus initialisieren
    const tradingAlgorithm = new TradingAlgorithm(config);
    await tradingAlgorithm.initialize();
    
    // Historische Daten laden
    console.log(`Loading historical data for ${config.symbol}...`);
    await tradingAlgorithm.loadHistoricalData(config.symbol, config.timeframe, 1000);
    
    // Modell trainieren
    console.log('Training model with historical data...');
    await tradingAlgorithm.trainModel();
    
    // Backtesting durchführen
    console.log('Running backtest...');
    const results = await tradingAlgorithm.runBacktest();
    
    // Ergebnisse ausgeben
    console.log('\n===== BACKTEST RESULTS =====');
    console.log(`Total trades: ${results.performance.totalTrades}`);
    console.log(`Winning trades: ${results.performance.winningTrades}`);
    console.log(`Losing trades: ${results.performance.losingTrades}`);
    console.log(`Win rate: ${results.performance.winRate.toFixed(2)}%`);
    console.log(`Total return: ${results.performance.totalReturnPercent.toFixed(2)}%`);
    console.log(`Average return per trade: ${results.performance.averageReturn.toFixed(2)}%`);
    console.log(`Total profit: $${results.performance.totalProfit.toFixed(2)}`);
    
    // Modell speichern
    await tradingAlgorithm.saveModel('./models/btc_model');
    
    // Zenbot-Konfiguration erstellen
    const zenbotConfig = tradingAlgorithm.createZenbotConfig(config.symbol);
    console.log('\n===== ZENBOT CONFIGURATION =====');
    console.log(zenbotConfig);
    
    // Zenbot-Kommandos erstellen
    const backtestCommand = tradingAlgorithm.createBacktestCommand(config.symbol, '90');
    const liveCommand = tradingAlgorithm.createLiveCommand(config.symbol, true);
    
    console.log('\n===== ZENBOT COMMANDS =====');
    console.log('Backtest command:');
    console.log(backtestCommand);
    console.log('\nLive trading command:');
    console.log(liveCommand);
    
    return results;
  } catch (error) {
    console.error('Error during backtesting:', error);
    throw error;
  }
}

// Funktion zum Testen verschiedener Parameter
async function optimizeParameters() {
  const results = [];
  
  // Verschiedene Parameterkombinationen testen
  const buyThresholds = [1.0, 1.5, 2.0];
  const sellThresholds = [-0.5, -1.0, -1.5];
  const stopLossValues = [1.5, 2.0, 2.5];
  const takeProfitValues = [2.0, 3.0, 4.0];
  
  for (const buyThreshold of buyThresholds) {
    for (const sellThreshold of sellThresholds) {
      for (const stopLoss of stopLossValues) {
        for (const takeProfit of takeProfitValues) {
          // Parameter aktualisieren
          config.buyThreshold = buyThreshold;
          config.sellThreshold = sellThreshold;
          config.stopLossPercentage = stopLoss;
          config.takeProfitPercentage = takeProfit;
          
          console.log(`\nTesting parameters: buyThreshold=${buyThreshold}, sellThreshold=${sellThreshold}, stopLoss=${stopLoss}, takeProfit=${takeProfit}`);
          
          // Backtest mit aktuellen Parametern durchführen
          const tradingAlgorithm = new TradingAlgorithm(config);
          await tradingAlgorithm.initialize();
          await tradingAlgorithm.loadHistoricalData(config.symbol, config.timeframe, 1000);
          await tradingAlgorithm.trainModel();
          const result = await tradingAlgorithm.runBacktest();
          
          // Ergebnis speichern
          results.push({
            parameters: {
              buyThreshold,
              sellThreshold,
              stopLoss,
              takeProfit
            },
            performance: result.performance
          });
          
          console.log(`Win rate: ${result.performance.winRate.toFixed(2)}%, Total return: ${result.performance.totalReturnPercent.toFixed(2)}%`);
        }
      }
    }
  }
  
  // Ergebnisse nach Gesamtrendite sortieren
  results.sort((a, b) => b.performance.totalReturnPercent - a.performance.totalReturnPercent);
  
  // Beste Parameter ausgeben
  console.log('\n===== OPTIMIZATION RESULTS =====');
  console.log('Top 5 parameter combinations:');
  
  for (let i = 0; i < Math.min(5, results.length); i++) {
    const result = results[i];
    console.log(`\n#${i + 1}:`);
    console.log(`Parameters: buyThreshold=${result.parameters.buyThreshold}, sellThreshold=${result.parameters.sellThreshold}, stopLoss=${result.parameters.stopLoss}, takeProfit=${result.parameters.takeProfit}`);
    console.log(`Win rate: ${result.performance.winRate.toFixed(2)}%`);
    console.log(`Total return: ${result.performance.totalReturnPercent.toFixed(2)}%`);
    console.log(`Average return per trade: ${result.performance.averageReturn.toFixed(2)}%`);
    console.log(`Total trades: ${result.performance.totalTrades}`);
  }
  
  return results;
}

// Hauptfunktion
async function main() {
  try {
    // Einfaches Backtesting durchführen
    const backtestResults = await runBacktest();
    
    // Parameteroptimierung (optional, auskommentiert wegen Laufzeit)
    // console.log('\nStarting parameter optimization...');
    // const optimizationResults = await optimizeParameters();
    
    console.log('\nBacktesting completed successfully!');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Skript ausführen
main();
