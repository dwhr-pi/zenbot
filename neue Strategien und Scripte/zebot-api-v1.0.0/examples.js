const ZebotAPI = require('./zebot_api');

// Beispiel 1: Grundlegende Verwendung mit Binance
async function basicExample() {
    console.log('=== Grundlegendes Beispiel ===');
    
    // API ohne Authentifizierung für öffentliche Daten
    const api = new ZebotAPI('binance');
    
    try {
        // Märkte laden
        const marketsResult = await api.loadMarkets();
        if (marketsResult.success) {
            console.log('Märkte erfolgreich geladen:', Object.keys(marketsResult.data).length, 'Märkte');
        }
        
        // Ticker für BTC/USDT abrufen
        const tickerResult = await api.fetchTicker('BTC/USDT');
        if (tickerResult.success) {
            console.log('BTC/USDT Ticker:', {
                symbol: tickerResult.data.symbol,
                last: tickerResult.data.last,
                bid: tickerResult.data.bid,
                ask: tickerResult.data.ask,
                volume: tickerResult.data.baseVolume
            });
        }
        
        // OHLCV-Daten abrufen
        const ohlcvResult = await api.fetchOHLCV('BTC/USDT', '1h', undefined, 10);
        if (ohlcvResult.success) {
            console.log('OHLCV-Daten (letzte 10 Stunden):', ohlcvResult.data.length, 'Kerzen');
            console.log('Letzte Kerze:', ohlcvResult.data[ohlcvResult.data.length - 1]);
        }
        
    } catch (error) {
        console.error('Fehler im grundlegenden Beispiel:', error);
    }
}

// Beispiel 2: Authentifizierte Operationen (benötigt echte API-Schlüssel)
async function authenticatedExample() {
    console.log('\n=== Authentifiziertes Beispiel ===');
    
    // WARNUNG: Verwenden Sie echte API-Schlüssel nur in sicherer Umgebung
    const apiKey = 'YOUR_API_KEY';
    const secret = 'YOUR_SECRET';
    
    if (apiKey === 'YOUR_API_KEY') {
        console.log('Überspringe authentifiziertes Beispiel - keine echten API-Schlüssel bereitgestellt');
        return;
    }
    
    const api = new ZebotAPI('binance', apiKey, secret, { sandbox: true });
    
    try {
        // Kontoguthaben abrufen
        const balanceResult = await api.fetchBalance();
        if (balanceResult.success) {
            console.log('Kontoguthaben:', balanceResult.data.total);
        } else {
            console.log('Fehler beim Abrufen des Guthabens:', balanceResult.error);
        }
        
        // Offene Orders abrufen
        const ordersResult = await api.fetchOpenOrders();
        if (ordersResult.success) {
            console.log('Offene Orders:', ordersResult.data.length);
        }
        
    } catch (error) {
        console.error('Fehler im authentifizierten Beispiel:', error);
    }
}

// Beispiel 3: Fehlerbehandlung
async function errorHandlingExample() {
    console.log('\n=== Fehlerbehandlungs-Beispiel ===');
    
    const api = new ZebotAPI('binance');
    
    // Versuche, ein ungültiges Symbol abzurufen
    const result = await api.fetchTicker('INVALID/SYMBOL');
    
    if (!result.success) {
        console.log('Erwarteter Fehler aufgetreten:');
        console.log('Fehlertyp:', result.error.type);
        console.log('Fehlermeldung:', result.error.message);
        console.log('Operation:', result.error.operation);
        console.log('Börse:', result.error.exchange);
    }
}

// Beispiel 4: Mehrere Börsen verwenden
async function multiExchangeExample() {
    console.log('\n=== Multi-Börsen-Beispiel ===');
    
    const exchanges = ['binance', 'coinbase', 'kraken'];
    
    for (const exchangeId of exchanges) {
        try {
            const api = new ZebotAPI(exchangeId);
            const tickerResult = await api.fetchTicker('BTC/USD');
            
            if (tickerResult.success) {
                console.log(`${exchangeId.toUpperCase()} BTC/USD:`, tickerResult.data.last);
            } else {
                // Versuche BTC/USDT falls BTC/USD nicht verfügbar
                const usdtResult = await api.fetchTicker('BTC/USDT');
                if (usdtResult.success) {
                    console.log(`${exchangeId.toUpperCase()} BTC/USDT:`, usdtResult.data.last);
                } else {
                    console.log(`${exchangeId.toUpperCase()}: Kein BTC-Ticker verfügbar`);
                }
            }
        } catch (error) {
            console.log(`${exchangeId.toUpperCase()}: Fehler -`, error.message);
        }
    }
}

// Beispiel 5: Börsen-Informationen
async function exchangeInfoExample() {
    console.log('\n=== Börsen-Informationen ===');
    
    console.log('Verfügbare Börsen:', ZebotAPI.getAvailableExchanges().length);
    
    const api = new ZebotAPI('binance');
    const info = api.getExchangeInfo();
    
    console.log('Binance Informationen:');
    console.log('- Name:', info.name);
    console.log('- Länder:', info.countries);
    console.log('- Version:', info.version);
    console.log('- Unterstützte Features:', Object.keys(info.has).filter(key => info.has[key]).length);
    console.log('- Verfügbare Zeitrahmen:', Object.keys(info.timeframes || {}));
}

// Hauptfunktion zum Ausführen aller Beispiele
async function runAllExamples() {
    console.log('Zebot API Beispiele\n');
    
    await basicExample();
    await authenticatedExample();
    await errorHandlingExample();
    await multiExchangeExample();
    await exchangeInfoExample();
    
    console.log('\n=== Alle Beispiele abgeschlossen ===');
}

// Beispiele ausführen, wenn Datei direkt aufgerufen wird
if (require.main === module) {
    runAllExamples().catch(console.error);
}

module.exports = {
    basicExample,
    authenticatedExample,
    errorHandlingExample,
    multiExchangeExample,
    exchangeInfoExample,
    runAllExamples
};

