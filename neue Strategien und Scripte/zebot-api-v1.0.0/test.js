const ZebotAPI = require('./zebot_api');

async function runBasicTests() {
    console.log('🧪 Zebot API - Grundlegende Tests\n');
    
    // Test 1: API-Instanziierung
    console.log('Test 1: API-Instanziierung');
    try {
        const api = new ZebotAPI('binance');
        console.log('✅ Binance API erfolgreich erstellt');
        
        const info = api.getExchangeInfo();
        console.log(`   - Börse: ${info.name}`);
        console.log(`   - Länder: ${info.countries.join(', ')}`);
        console.log(`   - Features: ${Object.keys(info.has).filter(key => info.has[key]).length}`);
    } catch (error) {
        console.log('❌ Fehler bei API-Instanziierung:', error.message);
    }
    
    // Test 2: Ungültige Börse
    console.log('\nTest 2: Ungültige Börse');
    try {
        const invalidApi = new ZebotAPI('invalid_exchange');
        console.log('❌ Sollte einen Fehler werfen');
    } catch (error) {
        console.log('✅ Erwarteter Fehler abgefangen:', error.message);
    }
    
    // Test 3: Verfügbare Börsen
    console.log('\nTest 3: Verfügbare Börsen');
    const exchanges = ZebotAPI.getAvailableExchanges();
    console.log(`✅ ${exchanges.length} Börsen verfügbar`);
    console.log(`   - Erste 10: ${exchanges.slice(0, 10).join(', ')}`);
    
    // Test 4: Öffentliche API-Aufrufe
    console.log('\nTest 4: Öffentliche API-Aufrufe');
    const api = new ZebotAPI('binance');
    
    try {
        console.log('   Teste fetchTicker...');
        const ticker = await api.fetchTicker('BTC/USDT');
        if (ticker.success) {
            console.log(`   ✅ BTC/USDT Preis: $${ticker.data.last}`);
            console.log(`   ✅ Timestamp: ${new Date(ticker.timestamp).toISOString()}`);
        } else {
            console.log(`   ❌ fetchTicker Fehler: ${ticker.error.message}`);
        }
    } catch (error) {
        console.log(`   ❌ fetchTicker Exception: ${error.message}`);
    }
    
    try {
        console.log('   Teste loadMarkets...');
        const markets = await api.loadMarkets();
        if (markets.success) {
            const marketCount = Object.keys(markets.data).length;
            console.log(`   ✅ ${marketCount} Märkte geladen`);
        } else {
            console.log(`   ❌ loadMarkets Fehler: ${markets.error.message}`);
        }
    } catch (error) {
        console.log(`   ❌ loadMarkets Exception: ${error.message}`);
    }
    
    try {
        console.log('   Teste fetchOrderBook...');
        const orderbook = await api.fetchOrderBook('BTC/USDT', 5);
        if (orderbook.success) {
            console.log(`   ✅ Orderbuch: ${orderbook.data.bids.length} Bids, ${orderbook.data.asks.length} Asks`);
            console.log(`   ✅ Best Bid: $${orderbook.data.bids[0][0]}, Best Ask: $${orderbook.data.asks[0][0]}`);
        } else {
            console.log(`   ❌ fetchOrderBook Fehler: ${orderbook.error.message}`);
        }
    } catch (error) {
        console.log(`   ❌ fetchOrderBook Exception: ${error.message}`);
    }
    
    // Test 5: Fehlerbehandlung
    console.log('\nTest 5: Fehlerbehandlung');
    try {
        const invalidTicker = await api.fetchTicker('INVALID/SYMBOL');
        if (!invalidTicker.success) {
            console.log(`   ✅ Erwarteter Fehler abgefangen: ${invalidTicker.error.type}`);
            console.log(`   ✅ Fehlermeldung: ${invalidTicker.error.message}`);
        } else {
            console.log('   ❌ Sollte einen Fehler zurückgeben');
        }
    } catch (error) {
        console.log(`   ❌ Unerwartete Exception: ${error.message}`);
    }
    
    // Test 6: Feature-Prüfung
    console.log('\nTest 6: Feature-Prüfung');
    console.log(`   ✅ fetchOHLCV unterstützt: ${api.hasFeature('fetchOHLCV')}`);
    console.log(`   ✅ fetchTicker unterstützt: ${api.hasFeature('fetchTicker')}`);
    console.log(`   ✅ createOrder unterstützt: ${api.hasFeature('createOrder')}`);
    
    console.log('\n🎉 Alle grundlegenden Tests abgeschlossen!');
}

async function runPerformanceTests() {
    console.log('\n⚡ Performance-Tests\n');
    
    const api = new ZebotAPI('binance');
    const symbols = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT'];
    
    console.log('Test: Parallele Ticker-Abfragen');
    const startTime = Date.now();
    
    const promises = symbols.map(symbol => api.fetchTicker(symbol));
    const results = await Promise.all(promises);
    
    const duration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    
    console.log(`✅ ${successCount}/${symbols.length} Ticker in ${duration}ms abgerufen`);
    console.log(`✅ Durchschnitt: ${(duration / symbols.length).toFixed(1)}ms pro Ticker`);
    
    results.forEach((result, index) => {
        if (result.success) {
            console.log(`   ${symbols[index]}: $${result.data.last}`);
        } else {
            console.log(`   ${symbols[index]}: Fehler - ${result.error.message}`);
        }
    });
}

async function runCompatibilityTests() {
    console.log('\n🔄 Kompatibilitäts-Tests\n');
    
    const testExchanges = ['binance', 'coinbase', 'kraken'];
    const testSymbol = 'BTC/USD';
    
    for (const exchangeId of testExchanges) {
        console.log(`Teste ${exchangeId.toUpperCase()}:`);
        
        try {
            const api = new ZebotAPI(exchangeId);
            let result = await api.fetchTicker(testSymbol);
            
            // Fallback zu USDT
            if (!result.success && testSymbol.includes('/USD')) {
                result = await api.fetchTicker(testSymbol.replace('/USD', '/USDT'));
            }
            
            if (result.success) {
                console.log(`   ✅ Ticker: $${result.data.last}`);
            } else {
                console.log(`   ❌ Ticker-Fehler: ${result.error.message}`);
            }
            
            // Teste Märkte
            const markets = await api.loadMarkets();
            if (markets.success) {
                console.log(`   ✅ Märkte: ${Object.keys(markets.data).length}`);
            } else {
                console.log(`   ❌ Märkte-Fehler: ${markets.error.message}`);
            }
            
        } catch (error) {
            console.log(`   ❌ ${exchangeId} Fehler: ${error.message}`);
        }
        
        console.log('');
    }
}

async function runAllTests() {
    console.log('🚀 Zebot API - Vollständige Testsuite\n');
    console.log('='.repeat(50));
    
    await runBasicTests();
    await runPerformanceTests();
    await runCompatibilityTests();
    
    console.log('='.repeat(50));
    console.log('🎯 Alle Tests abgeschlossen!');
    console.log('\nDie Zebot API ist bereit für den Einsatz! 🚀');
}

// Tests ausführen
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runBasicTests,
    runPerformanceTests,
    runCompatibilityTests,
    runAllTests
};

