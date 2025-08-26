# Beispiele - Zebot API

Diese Sammlung von Beispielen zeigt die praktische Verwendung der Zebot API für verschiedene Anwendungsfälle.

## Inhaltsverzeichnis

1. [Grundlegende Beispiele](#grundlegende-beispiele)
2. [Marktdaten-Beispiele](#marktdaten-beispiele)
3. [Trading-Beispiele](#trading-beispiele)
4. [Portfolio-Management](#portfolio-management)
5. [Erweiterte Beispiele](#erweiterte-beispiele)
6. [Fehlerbehandlung](#fehlerbehandlung)
7. [Produktionsbeispiele](#produktionsbeispiele)

## Grundlegende Beispiele

### Einfache Preisabfrage

```javascript
const ZebotAPI = require('./zebot_api');

async function getPrice() {
    const api = new ZebotAPI('binance');
    
    const result = await api.fetchTicker('BTC/USDT');
    if (result.success) {
        console.log(`BTC Preis: $${result.data.last}`);
    } else {
        console.error('Fehler:', result.error.message);
    }
}

getPrice();
```

### Mehrere Börsen vergleichen

```javascript
const ZebotAPI = require('./zebot_api');

async function comparePrices() {
    const exchanges = ['binance', 'coinbase', 'kraken'];
    const symbol = 'BTC/USD';
    
    console.log(`Preisvergleich für ${symbol}:`);
    
    for (const exchangeId of exchanges) {
        try {
            const api = new ZebotAPI(exchangeId);
            let result = await api.fetchTicker(symbol);
            
            // Fallback zu USDT falls USD nicht verfügbar
            if (!result.success && symbol.includes('/USD')) {
                result = await api.fetchTicker(symbol.replace('/USD', '/USDT'));
            }
            
            if (result.success) {
                console.log(`${exchangeId.toUpperCase()}: $${result.data.last}`);
            } else {
                console.log(`${exchangeId.toUpperCase()}: Nicht verfügbar`);
            }
        } catch (error) {
            console.log(`${exchangeId.toUpperCase()}: Fehler - ${error.message}`);
        }
    }
}

comparePrices();
```

### Verfügbare Märkte anzeigen

```javascript
const ZebotAPI = require('./zebot_api');

async function showMarkets() {
    const api = new ZebotAPI('binance');
    
    const result = await api.loadMarkets();
    if (result.success) {
        const markets = Object.keys(result.data);
        console.log(`Verfügbare Märkte: ${markets.length}`);
        
        // Zeige BTC-Märkte
        const btcMarkets = markets.filter(market => market.startsWith('BTC/'));
        console.log('BTC Märkte:', btcMarkets.slice(0, 10));
        
        // Zeige USDT-Märkte
        const usdtMarkets = markets.filter(market => market.endsWith('/USDT'));
        console.log('USDT Märkte (erste 10):', usdtMarkets.slice(0, 10));
    }
}

showMarkets();
```

## Marktdaten-Beispiele

### Orderbuch analysieren

```javascript
const ZebotAPI = require('./zebot_api');

async function analyzeOrderbook() {
    const api = new ZebotAPI('binance');
    const symbol = 'BTC/USDT';
    
    const result = await api.fetchOrderBook(symbol, 10);
    if (result.success) {
        const orderbook = result.data;
        
        console.log(`Orderbuch für ${symbol}:`);
        console.log('\nTop 5 Bids (Kauforders):');
        orderbook.bids.slice(0, 5).forEach(([price, amount], index) => {
            console.log(`${index + 1}. $${price} - ${amount} BTC`);
        });
        
        console.log('\nTop 5 Asks (Verkaufsorders):');
        orderbook.asks.slice(0, 5).forEach(([price, amount], index) => {
            console.log(`${index + 1}. $${price} - ${amount} BTC`);
        });
        
        // Spread berechnen
        const bestBid = orderbook.bids[0][0];
        const bestAsk = orderbook.asks[0][0];
        const spread = bestAsk - bestBid;
        const spreadPercent = (spread / bestBid * 100).toFixed(4);
        
        console.log(`\nSpread: $${spread.toFixed(2)} (${spreadPercent}%)`);
    }
}

analyzeOrderbook();
```

### Historische Daten abrufen

```javascript
const ZebotAPI = require('./zebot_api');

async function getHistoricalData() {
    const api = new ZebotAPI('binance');
    const symbol = 'BTC/USDT';
    const timeframe = '1d';
    const limit = 30; // Letzte 30 Tage
    
    const result = await api.fetchOHLCV(symbol, timeframe, undefined, limit);
    if (result.success) {
        const candles = result.data;
        
        console.log(`Historische Daten für ${symbol} (${timeframe}):`);
        console.log('Datum\t\tOpen\tHigh\tLow\tClose\tVolume');
        
        candles.forEach(([timestamp, open, high, low, close, volume]) => {
            const date = new Date(timestamp).toISOString().split('T')[0];
            console.log(`${date}\t${open}\t${high}\t${low}\t${close}\t${volume.toFixed(2)}`);
        });
        
        // Einfache Statistiken
        const prices = candles.map(candle => candle[4]); // Close prices
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        console.log(`\nStatistiken (${limit} Tage):`);
        console.log(`Minimum: $${minPrice}`);
        console.log(`Maximum: $${maxPrice}`);
        console.log(`Durchschnitt: $${avgPrice.toFixed(2)}`);
    }
}

getHistoricalData();
```

### Live-Ticker mit Updates

```javascript
const ZebotAPI = require('./zebot_api');

class LiveTicker {
    constructor(exchangeId, symbols) {
        this.api = new ZebotAPI(exchangeId);
        this.symbols = symbols;
        this.isRunning = false;
        this.interval = null;
    }
    
    async start(updateInterval = 5000) {
        this.isRunning = true;
        console.log('Live-Ticker gestartet...\n');
        
        this.interval = setInterval(async () => {
            if (!this.isRunning) return;
            
            console.clear();
            console.log(`Live-Ticker (${new Date().toLocaleTimeString()})`);
            console.log('='.repeat(50));
            
            for (const symbol of this.symbols) {
                const result = await this.api.fetchTicker(symbol);
                if (result.success) {
                    const ticker = result.data;
                    const change = ticker.percentage || 0;
                    const changeColor = change >= 0 ? '🟢' : '🔴';
                    
                    console.log(`${changeColor} ${symbol}: $${ticker.last} (${change.toFixed(2)}%)`);
                } else {
                    console.log(`❌ ${symbol}: Fehler beim Laden`);
                }
            }
        }, updateInterval);
    }
    
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        console.log('\nLive-Ticker gestoppt.');
    }
}

// Verwendung
const ticker = new LiveTicker('binance', ['BTC/USDT', 'ETH/USDT', 'ADA/USDT']);
ticker.start(3000); // Update alle 3 Sekunden

// Nach 30 Sekunden stoppen
setTimeout(() => ticker.stop(), 30000);
```

## Trading-Beispiele

### Einfache Market Order

```javascript
const ZebotAPI = require('./zebot_api');

async function placeMarketOrder() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true } // Sandbox für Tests
    );
    
    const symbol = 'BTC/USDT';
    const side = 'buy';
    const amount = 0.001; // 0.001 BTC
    
    console.log(`Platziere Market ${side} Order für ${amount} ${symbol}...`);
    
    const result = await api.createOrder(symbol, 'market', side, amount);
    if (result.success) {
        const order = result.data;
        console.log('Order erfolgreich erstellt:');
        console.log(`Order ID: ${order.id}`);
        console.log(`Status: ${order.status}`);
        console.log(`Ausgeführte Menge: ${order.filled}`);
        console.log(`Durchschnittspreis: $${order.average || 'N/A'}`);
    } else {
        console.error('Fehler beim Erstellen der Order:', result.error.message);
    }
}

// Nur ausführen wenn API-Schlüssel verfügbar
if (process.env.BINANCE_API_KEY) {
    placeMarketOrder();
} else {
    console.log('API-Schlüssel nicht gefunden. Setzen Sie BINANCE_API_KEY und BINANCE_SECRET.');
}
```

### Limit Order mit Überwachung

```javascript
const ZebotAPI = require('./zebot_api');

class OrderManager {
    constructor(api) {
        this.api = api;
    }
    
    async placeLimitOrder(symbol, side, amount, price) {
        console.log(`Platziere Limit ${side} Order: ${amount} ${symbol} @ $${price}`);
        
        const result = await this.api.createOrder(symbol, 'limit', side, amount, price);
        if (result.success) {
            const order = result.data;
            console.log(`Order erstellt: ${order.id}`);
            
            // Überwache Order-Status
            await this.monitorOrder(order.id, symbol);
            return order;
        } else {
            console.error('Fehler:', result.error.message);
            return null;
        }
    }
    
    async monitorOrder(orderId, symbol) {
        console.log(`Überwache Order ${orderId}...`);
        
        const checkInterval = setInterval(async () => {
            const orders = await this.api.fetchOpenOrders(symbol);
            if (orders.success) {
                const order = orders.data.find(o => o.id === orderId);
                
                if (!order) {
                    console.log(`Order ${orderId} wurde ausgeführt oder storniert.`);
                    clearInterval(checkInterval);
                } else {
                    console.log(`Order ${orderId}: ${order.filled}/${order.amount} ausgeführt`);
                }
            }
        }, 5000); // Prüfe alle 5 Sekunden
        
        // Stoppe Überwachung nach 5 Minuten
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('Überwachung beendet.');
        }, 300000);
    }
    
    async cancelAllOrders(symbol) {
        console.log(`Storniere alle Orders für ${symbol}...`);
        
        const result = await this.api.cancelAllOrders(symbol);
        if (result.success) {
            console.log(`${result.data.length} Orders storniert.`);
        } else {
            console.error('Fehler beim Stornieren:', result.error.message);
        }
    }
}

// Verwendung
async function tradingExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true }
    );
    
    const orderManager = new OrderManager(api);
    
    // Platziere Limit-Order unter dem aktuellen Preis
    const ticker = await api.fetchTicker('BTC/USDT');
    if (ticker.success) {
        const currentPrice = ticker.data.last;
        const buyPrice = currentPrice * 0.99; // 1% unter aktuellem Preis
        
        await orderManager.placeLimitOrder('BTC/USDT', 'buy', 0.001, buyPrice);
    }
}

if (process.env.BINANCE_API_KEY) {
    tradingExample();
}
```

### Stop-Loss Implementation

```javascript
const ZebotAPI = require('./zebot_api');

class StopLossManager {
    constructor(api) {
        this.api = api;
        this.stopLossOrders = new Map();
        this.isMonitoring = false;
    }
    
    async addStopLoss(symbol, amount, stopPrice, limitPrice = null) {
        const stopLoss = {
            symbol,
            amount,
            stopPrice,
            limitPrice: limitPrice || stopPrice * 0.99, // 1% unter Stop-Preis
            isTriggered: false
        };
        
        this.stopLossOrders.set(symbol, stopLoss);
        console.log(`Stop-Loss hinzugefügt: ${symbol} @ $${stopPrice}`);
        
        if (!this.isMonitoring) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        console.log('Stop-Loss Überwachung gestartet...');
        
        this.monitoringInterval = setInterval(async () => {
            for (const [symbol, stopLoss] of this.stopLossOrders) {
                if (stopLoss.isTriggered) continue;
                
                const ticker = await this.api.fetchTicker(symbol);
                if (ticker.success) {
                    const currentPrice = ticker.data.last;
                    
                    if (currentPrice <= stopLoss.stopPrice) {
                        console.log(`🚨 Stop-Loss ausgelöst für ${symbol}! Preis: $${currentPrice}`);
                        await this.executeStopLoss(stopLoss);
                    }
                }
            }
        }, 2000); // Prüfe alle 2 Sekunden
    }
    
    async executeStopLoss(stopLoss) {
        stopLoss.isTriggered = true;
        
        const result = await this.api.createOrder(
            stopLoss.symbol,
            'limit',
            'sell',
            stopLoss.amount,
            stopLoss.limitPrice
        );
        
        if (result.success) {
            console.log(`Stop-Loss Order erstellt: ${result.data.id}`);
        } else {
            console.error(`Fehler bei Stop-Loss Ausführung: ${result.error.message}`);
        }
    }
    
    removeStopLoss(symbol) {
        this.stopLossOrders.delete(symbol);
        console.log(`Stop-Loss für ${symbol} entfernt.`);
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        console.log('Stop-Loss Überwachung gestoppt.');
    }
}

// Verwendung
async function stopLossExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true }
    );
    
    const stopLossManager = new StopLossManager(api);
    
    // Füge Stop-Loss hinzu (verkaufe 0.001 BTC wenn Preis unter $45000 fällt)
    await stopLossManager.addStopLoss('BTC/USDT', 0.001, 45000);
    
    // Stoppe nach 1 Minute
    setTimeout(() => {
        stopLossManager.stopMonitoring();
    }, 60000);
}

if (process.env.BINANCE_API_KEY) {
    stopLossExample();
}
```

## Portfolio-Management

### Portfolio-Übersicht

```javascript
const ZebotAPI = require('./zebot_api');

class PortfolioManager {
    constructor(api) {
        this.api = api;
    }
    
    async getPortfolioOverview() {
        const balance = await this.api.fetchBalance();
        if (!balance.success) {
            console.error('Fehler beim Laden des Guthabens:', balance.error.message);
            return;
        }
        
        const portfolio = [];
        let totalValueUSD = 0;
        
        for (const [currency, amounts] of Object.entries(balance.data)) {
            if (currency === 'info' || currency === 'free' || currency === 'used' || currency === 'total') {
                continue;
            }
            
            if (amounts.total > 0) {
                let valueUSD = 0;
                
                // Versuche USD-Wert zu ermitteln
                if (currency === 'USDT' || currency === 'USD') {
                    valueUSD = amounts.total;
                } else {
                    // Hole Preis in USDT
                    const ticker = await this.api.fetchTicker(`${currency}/USDT`);
                    if (ticker.success) {
                        valueUSD = amounts.total * ticker.data.last;
                    }
                }
                
                portfolio.push({
                    currency,
                    amount: amounts.total,
                    free: amounts.free,
                    used: amounts.used,
                    valueUSD
                });
                
                totalValueUSD += valueUSD;
            }
        }
        
        // Sortiere nach USD-Wert
        portfolio.sort((a, b) => b.valueUSD - a.valueUSD);
        
        console.log('Portfolio-Übersicht:');
        console.log('='.repeat(80));
        console.log('Währung\tMenge\t\tFrei\t\tVerwendet\tWert (USD)\tAnteil');
        console.log('-'.repeat(80));
        
        portfolio.forEach(item => {
            const percentage = totalValueUSD > 0 ? (item.valueUSD / totalValueUSD * 100).toFixed(1) : 0;
            console.log(`${item.currency}\t${item.amount.toFixed(6)}\t${item.free.toFixed(6)}\t${item.used.toFixed(6)}\t$${item.valueUSD.toFixed(2)}\t${percentage}%`);
        });
        
        console.log('-'.repeat(80));
        console.log(`Gesamt:\t\t\t\t\t\t\t$${totalValueUSD.toFixed(2)}\t100%`);
        
        return portfolio;
    }
    
    async getPortfolioPerformance(days = 7) {
        const portfolio = await this.getPortfolioOverview();
        if (!portfolio) return;
        
        console.log(`\nPerformance-Analyse (${days} Tage):`);
        console.log('='.repeat(50));
        
        for (const item of portfolio) {
            if (item.currency === 'USDT' || item.currency === 'USD') continue;
            
            const symbol = `${item.currency}/USDT`;
            const ohlcv = await this.api.fetchOHLCV(symbol, '1d', undefined, days + 1);
            
            if (ohlcv.success && ohlcv.data.length >= 2) {
                const oldPrice = ohlcv.data[0][4]; // Close price vor X Tagen
                const currentPrice = ohlcv.data[ohlcv.data.length - 1][4]; // Aktueller Close
                
                const change = ((currentPrice - oldPrice) / oldPrice * 100);
                const changeIcon = change >= 0 ? '🟢' : '🔴';
                
                console.log(`${changeIcon} ${item.currency}: ${change.toFixed(2)}% (${days}d)`);
            }
        }
    }
}

// Verwendung
async function portfolioExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET
    );
    
    const portfolioManager = new PortfolioManager(api);
    
    await portfolioManager.getPortfolioOverview();
    await portfolioManager.getPortfolioPerformance(7);
}

if (process.env.BINANCE_API_KEY) {
    portfolioExample();
}
```

### Rebalancing-Strategie

```javascript
const ZebotAPI = require('./zebot_api');

class RebalancingBot {
    constructor(api, targetAllocations) {
        this.api = api;
        this.targetAllocations = targetAllocations; // z.B. { 'BTC': 50, 'ETH': 30, 'ADA': 20 }
        this.rebalanceThreshold = 5; // 5% Abweichung löst Rebalancing aus
    }
    
    async checkRebalancing() {
        console.log('Prüfe Rebalancing-Bedarf...');
        
        const portfolio = await this.getCurrentAllocations();
        if (!portfolio) return;
        
        const rebalanceNeeded = this.isRebalancingNeeded(portfolio);
        
        if (rebalanceNeeded) {
            console.log('🔄 Rebalancing erforderlich!');
            await this.executeRebalancing(portfolio);
        } else {
            console.log('✅ Portfolio ist ausgewogen.');
        }
    }
    
    async getCurrentAllocations() {
        const balance = await this.api.fetchBalance();
        if (!balance.success) return null;
        
        const allocations = {};
        let totalValue = 0;
        
        for (const currency of Object.keys(this.targetAllocations)) {
            const amount = balance.data[currency]?.total || 0;
            
            if (amount > 0) {
                let valueUSD = 0;
                
                if (currency === 'USDT') {
                    valueUSD = amount;
                } else {
                    const ticker = await this.api.fetchTicker(`${currency}/USDT`);
                    if (ticker.success) {
                        valueUSD = amount * ticker.data.last;
                    }
                }
                
                allocations[currency] = {
                    amount,
                    valueUSD,
                    currentPercent: 0 // Wird später berechnet
                };
                totalValue += valueUSD;
            }
        }
        
        // Berechne aktuelle Prozentsätze
        for (const currency in allocations) {
            allocations[currency].currentPercent = (allocations[currency].valueUSD / totalValue) * 100;
        }
        
        return { allocations, totalValue };
    }
    
    isRebalancingNeeded(portfolio) {
        for (const currency in this.targetAllocations) {
            const targetPercent = this.targetAllocations[currency];
            const currentPercent = portfolio.allocations[currency]?.currentPercent || 0;
            const deviation = Math.abs(targetPercent - currentPercent);
            
            console.log(`${currency}: Ziel ${targetPercent}%, Aktuell ${currentPercent.toFixed(1)}%, Abweichung ${deviation.toFixed(1)}%`);
            
            if (deviation > this.rebalanceThreshold) {
                return true;
            }
        }
        return false;
    }
    
    async executeRebalancing(portfolio) {
        console.log('Führe Rebalancing durch...');
        
        // Vereinfachte Rebalancing-Logik
        for (const currency in this.targetAllocations) {
            const targetPercent = this.targetAllocations[currency];
            const currentPercent = portfolio.allocations[currency]?.currentPercent || 0;
            const targetValue = (portfolio.totalValue * targetPercent) / 100;
            const currentValue = portfolio.allocations[currency]?.valueUSD || 0;
            const difference = targetValue - currentValue;
            
            if (Math.abs(difference) > 10) { // Nur bei Unterschieden > $10
                if (difference > 0) {
                    console.log(`Kaufe ${currency} im Wert von $${difference.toFixed(2)}`);
                    // Hier würde die Kauf-Order implementiert
                } else {
                    console.log(`Verkaufe ${currency} im Wert von $${Math.abs(difference).toFixed(2)}`);
                    // Hier würde die Verkauf-Order implementiert
                }
            }
        }
    }
}

// Verwendung
async function rebalancingExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true }
    );
    
    const targetAllocations = {
        'BTC': 50,  // 50%
        'ETH': 30,  // 30%
        'ADA': 20   // 20%
    };
    
    const rebalancer = new RebalancingBot(api, targetAllocations);
    await rebalancer.checkRebalancing();
}

if (process.env.BINANCE_API_KEY) {
    rebalancingExample();
}
```

## Erweiterte Beispiele

### Arbitrage-Scanner

```javascript
const ZebotAPI = require('./zebot_api');

class ArbitrageScanner {
    constructor(exchanges, symbols) {
        this.apis = {};
        this.symbols = symbols;
        
        // Initialisiere APIs für alle Börsen
        exchanges.forEach(exchange => {
            this.apis[exchange] = new ZebotAPI(exchange);
        });
    }
    
    async scanArbitrageOpportunities() {
        console.log('Scanne Arbitrage-Möglichkeiten...\n');
        
        const opportunities = [];
        
        for (const symbol of this.symbols) {
            const prices = await this.getPricesFromAllExchanges(symbol);
            const opportunity = this.findArbitrageOpportunity(symbol, prices);
            
            if (opportunity) {
                opportunities.push(opportunity);
            }
        }
        
        // Sortiere nach Gewinnpotential
        opportunities.sort((a, b) => b.profitPercent - a.profitPercent);
        
        console.log('Arbitrage-Möglichkeiten:');
        console.log('='.repeat(80));
        
        if (opportunities.length === 0) {
            console.log('Keine profitablen Arbitrage-Möglichkeiten gefunden.');
        } else {
            opportunities.forEach(opp => {
                console.log(`${opp.symbol}: Kaufe bei ${opp.buyExchange} ($${opp.buyPrice}), verkaufe bei ${opp.sellExchange} ($${opp.sellPrice})`);
                console.log(`Gewinn: ${opp.profitPercent.toFixed(2)}% (${opp.profitAmount.toFixed(2)} pro Einheit)\n`);
            });
        }
        
        return opportunities;
    }
    
    async getPricesFromAllExchanges(symbol) {
        const prices = {};
        
        for (const [exchange, api] of Object.entries(this.apis)) {
            try {
                let result = await api.fetchTicker(symbol);
                
                // Fallback zu USDT falls USD nicht verfügbar
                if (!result.success && symbol.includes('/USD')) {
                    result = await api.fetchTicker(symbol.replace('/USD', '/USDT'));
                }
                
                if (result.success) {
                    prices[exchange] = {
                        bid: result.data.bid,
                        ask: result.data.ask,
                        last: result.data.last
                    };
                }
            } catch (error) {
                console.log(`Fehler bei ${exchange}: ${error.message}`);
            }
        }
        
        return prices;
    }
    
    findArbitrageOpportunity(symbol, prices) {
        const exchanges = Object.keys(prices);
        if (exchanges.length < 2) return null;
        
        let bestBuy = null;
        let bestSell = null;
        
        // Finde niedrigsten Ask (Kaufpreis) und höchsten Bid (Verkaufspreis)
        exchanges.forEach(exchange => {
            const price = prices[exchange];
            
            if (!bestBuy || price.ask < bestBuy.price) {
                bestBuy = { exchange, price: price.ask };
            }
            
            if (!bestSell || price.bid > bestSell.price) {
                bestSell = { exchange, price: price.bid };
            }
        });
        
        if (bestBuy && bestSell && bestBuy.exchange !== bestSell.exchange) {
            const profitAmount = bestSell.price - bestBuy.price;
            const profitPercent = (profitAmount / bestBuy.price) * 100;
            
            // Nur profitable Möglichkeiten (> 0.5% nach Gebühren)
            if (profitPercent > 0.5) {
                return {
                    symbol,
                    buyExchange: bestBuy.exchange,
                    sellExchange: bestSell.exchange,
                    buyPrice: bestBuy.price,
                    sellPrice: bestSell.price,
                    profitAmount,
                    profitPercent
                };
            }
        }
        
        return null;
    }
}

// Verwendung
async function arbitrageExample() {
    const exchanges = ['binance', 'coinbase', 'kraken'];
    const symbols = ['BTC/USD', 'ETH/USD', 'ADA/USD'];
    
    const scanner = new ArbitrageScanner(exchanges, symbols);
    await scanner.scanArbitrageOpportunities();
}

arbitrageExample();
```

### DCA (Dollar Cost Averaging) Bot

```javascript
const ZebotAPI = require('./zebot_api');

class DCABot {
    constructor(api, config) {
        this.api = api;
        this.config = config; // { symbol, amount, interval, maxInvestment }
        this.totalInvested = 0;
        this.totalTokens = 0;
        this.isRunning = false;
    }
    
    start() {
        console.log(`DCA Bot gestartet für ${this.config.symbol}`);
        console.log(`Investition: $${this.config.amount} alle ${this.config.interval}ms`);
        console.log(`Maximum: $${this.config.maxInvestment}\n`);
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.executeDCA();
        }, this.config.interval);
    }
    
    async executeDCA() {
        if (!this.isRunning || this.totalInvested >= this.config.maxInvestment) {
            this.stop();
            return;
        }
        
        console.log(`Führe DCA-Kauf aus... (${new Date().toLocaleTimeString()})`);
        
        // Hole aktuellen Preis
        const ticker = await this.api.fetchTicker(this.config.symbol);
        if (!ticker.success) {
            console.error('Fehler beim Abrufen des Preises:', ticker.error.message);
            return;
        }
        
        const currentPrice = ticker.data.last;
        const tokensToBuy = this.config.amount / currentPrice;
        
        // Simuliere Kauf (in Produktion würde hier eine echte Order erstellt)
        console.log(`Kaufe ${tokensToBy.toFixed(6)} ${this.config.symbol.split('/')[0]} @ $${currentPrice}`);
        
        this.totalInvested += this.config.amount;
        this.totalTokens += tokensToBy;
        
        const averagePrice = this.totalInvested / this.totalTokens;
        const currentValue = this.totalTokens * currentPrice;
        const profit = currentValue - this.totalInvested;
        const profitPercent = (profit / this.totalInvested) * 100;
        
        console.log(`Gesamt investiert: $${this.totalInvested.toFixed(2)}`);
        console.log(`Gesamt Tokens: ${this.totalTokens.toFixed(6)}`);
        console.log(`Durchschnittspreis: $${averagePrice.toFixed(2)}`);
        console.log(`Aktueller Wert: $${currentValue.toFixed(2)}`);
        console.log(`Gewinn/Verlust: $${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)\n`);
    }
    
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        console.log('DCA Bot gestoppt.');
        this.printFinalReport();
    }
    
    printFinalReport() {
        console.log('\n' + '='.repeat(50));
        console.log('DCA Bot - Abschlussbericht');
        console.log('='.repeat(50));
        console.log(`Symbol: ${this.config.symbol}`);
        console.log(`Gesamt investiert: $${this.totalInvested.toFixed(2)}`);
        console.log(`Gesamt Tokens: ${this.totalTokens.toFixed(6)}`);
        console.log(`Durchschnittspreis: $${(this.totalInvested / this.totalTokens).toFixed(2)}`);
    }
}

// Verwendung
async function dcaExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true }
    );
    
    const dcaConfig = {
        symbol: 'BTC/USDT',
        amount: 10,        // $10 pro Kauf
        interval: 10000,   // Alle 10 Sekunden (für Demo)
        maxInvestment: 100 // Maximum $100
    };
    
    const dcaBot = new DCABot(api, dcaConfig);
    dcaBot.start();
    
    // Stoppe nach 2 Minuten
    setTimeout(() => dcaBot.stop(), 120000);
}

if (process.env.BINANCE_API_KEY) {
    dcaExample();
}
```

## Fehlerbehandlung

### Robuste Fehlerbehandlung

```javascript
const ZebotAPI = require('./zebot_api');

class RobustTrader {
    constructor(api) {
        this.api = api;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 Sekunde
    }
    
    async executeWithRetry(operation, ...args) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const result = await operation.apply(this.api, args);
                
                if (result.success) {
                    return result;
                } else {
                    console.log(`Versuch ${attempt} fehlgeschlagen: ${result.error.message}`);
                    
                    // Spezielle Behandlung für verschiedene Fehlertypen
                    switch (result.error.type) {
                        case 'RateLimitExceeded':
                            console.log('Rate-Limit erreicht, warte länger...');
                            await this.sleep(5000); // 5 Sekunden warten
                            break;
                            
                        case 'NetworkError':
                            console.log('Netzwerkfehler, versuche erneut...');
                            await this.sleep(this.retryDelay * attempt);
                            break;
                            
                        case 'ExchangeNotAvailable':
                            console.log('Börse nicht verfügbar, breche ab.');
                            return result; // Nicht wiederholen
                            
                        default:
                            if (attempt < this.maxRetries) {
                                await this.sleep(this.retryDelay * attempt);
                            }
                    }
                }
            } catch (error) {
                console.log(`Unerwarteter Fehler in Versuch ${attempt}: ${error.message}`);
                if (attempt < this.maxRetries) {
                    await this.sleep(this.retryDelay * attempt);
                }
            }
        }
        
        console.log(`Alle ${this.maxRetries} Versuche fehlgeschlagen.`);
        return { success: false, error: { message: 'Max retries exceeded' } };
    }
    
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async safeCreateOrder(symbol, type, side, amount, price) {
        console.log(`Versuche Order zu erstellen: ${side} ${amount} ${symbol}`);
        
        // Validiere Parameter vor dem Senden
        if (!this.validateOrderParams(symbol, type, side, amount, price)) {
            return { success: false, error: { message: 'Invalid order parameters' } };
        }
        
        return await this.executeWithRetry(this.api.createOrder, symbol, type, side, amount, price);
    }
    
    validateOrderParams(symbol, type, side, amount, price) {
        if (!symbol || !type || !side || !amount) {
            console.error('Fehlende erforderliche Parameter');
            return false;
        }
        
        if (amount <= 0) {
            console.error('Menge muss positiv sein');
            return false;
        }
        
        if (type === 'limit' && (!price || price <= 0)) {
            console.error('Limit-Orders benötigen einen gültigen Preis');
            return false;
        }
        
        if (!['buy', 'sell'].includes(side)) {
            console.error('Seite muss "buy" oder "sell" sein');
            return false;
        }
        
        return true;
    }
}

// Verwendung
async function robustTradingExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET,
        { sandbox: true }
    );
    
    const trader = new RobustTrader(api);
    
    // Versuche Order mit automatischen Wiederholungen
    const result = await trader.safeCreateOrder('BTC/USDT', 'limit', 'buy', 0.001, 50000);
    
    if (result.success) {
        console.log('Order erfolgreich erstellt:', result.data.id);
    } else {
        console.log('Order konnte nicht erstellt werden:', result.error.message);
    }
}

if (process.env.BINANCE_API_KEY) {
    robustTradingExample();
}
```

## Produktionsbeispiele

### Logging und Monitoring

```javascript
const ZebotAPI = require('./zebot_api');
const fs = require('fs');

class ProductionTrader {
    constructor(api) {
        this.api = api;
        this.logFile = `trading_log_${new Date().toISOString().split('T')[0]}.txt`;
    }
    
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        console.log(logEntry);
        
        // Schreibe in Datei
        const fileEntry = data ? `${logEntry} | Data: ${JSON.stringify(data)}\n` : `${logEntry}\n`;
        fs.appendFileSync(this.logFile, fileEntry);
        
        // Bei Fehlern zusätzlich in Error-Log
        if (level === 'error') {
            fs.appendFileSync('error.log', fileEntry);
        }
    }
    
    async monitoredCreateOrder(symbol, type, side, amount, price) {
        this.log('info', `Erstelle Order: ${side} ${amount} ${symbol} @ ${price || 'market'}`);
        
        const startTime = Date.now();
        const result = await this.api.createOrder(symbol, type, side, amount, price);
        const duration = Date.now() - startTime;
        
        if (result.success) {
            this.log('info', `Order erfolgreich erstellt in ${duration}ms`, {
                orderId: result.data.id,
                symbol,
                type,
                side,
                amount,
                price,
                status: result.data.status
            });
        } else {
            this.log('error', `Order-Erstellung fehlgeschlagen nach ${duration}ms`, {
                symbol,
                type,
                side,
                amount,
                price,
                error: result.error
            });
        }
        
        return result;
    }
    
    async healthCheck() {
        this.log('info', 'Führe Gesundheitscheck durch...');
        
        const checks = [
            { name: 'API-Verbindung', test: () => this.api.fetchStatus() },
            { name: 'Marktdaten', test: () => this.api.fetchTicker('BTC/USDT') },
            { name: 'Kontoguthaben', test: () => this.api.fetchBalance() }
        ];
        
        const results = {};
        
        for (const check of checks) {
            try {
                const result = await check.test();
                results[check.name] = result.success;
                
                if (result.success) {
                    this.log('info', `${check.name}: OK`);
                } else {
                    this.log('error', `${check.name}: FEHLER`, result.error);
                }
            } catch (error) {
                results[check.name] = false;
                this.log('error', `${check.name}: EXCEPTION`, { message: error.message });
            }
        }
        
        const allHealthy = Object.values(results).every(status => status);
        this.log('info', `Gesundheitscheck abgeschlossen: ${allHealthy ? 'GESUND' : 'PROBLEME'}`, results);
        
        return results;
    }
    
    async startPerformanceMonitoring() {
        this.log('info', 'Performance-Monitoring gestartet');
        
        setInterval(async () => {
            const startTime = Date.now();
            const ticker = await this.api.fetchTicker('BTC/USDT');
            const responseTime = Date.now() - startTime;
            
            this.log('info', `API Response Time: ${responseTime}ms`, {
                success: ticker.success,
                responseTime
            });
            
            // Warnung bei langsamen Antworten
            if (responseTime > 5000) {
                this.log('warning', 'Langsame API-Antwort erkannt');
            }
        }, 60000); // Jede Minute
    }
}

// Verwendung
async function productionExample() {
    const api = new ZebotAPI('binance', 
        process.env.BINANCE_API_KEY, 
        process.env.BINANCE_SECRET
    );
    
    const trader = new ProductionTrader(api);
    
    // Gesundheitscheck
    await trader.healthCheck();
    
    // Performance-Monitoring starten
    trader.startPerformanceMonitoring();
    
    // Beispiel-Order mit Logging
    await trader.monitoredCreateOrder('BTC/USDT', 'limit', 'buy', 0.001, 50000);
}

if (process.env.BINANCE_API_KEY) {
    productionExample();
}
```

---

Diese Beispielsammlung zeigt die vielseitigen Einsatzmöglichkeiten der Zebot API. Von einfachen Preisabfragen bis hin zu komplexen Trading-Bots und Portfolio-Management-Tools - die API bietet die Flexibilität für alle Arten von Kryptowährungs-Anwendungen.

Für weitere Informationen siehe die [API-Referenz](api-reference.md) und die [Installationsanleitung](installation.md).

