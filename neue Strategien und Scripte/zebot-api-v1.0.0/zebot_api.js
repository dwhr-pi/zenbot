const ccxt = require('ccxt');

/**
 * Zebot API - Eine umfassende Wrapper-Klasse für CCXT-kompatible Börsen
 * Bietet vereinfachte Methoden für Kryptowährungs-Trading und Marktdaten
 */
class ZebotAPI {
    /**
     * Konstruktor für die ZebotAPI
     * @param {string} exchangeId - ID der Börse (z.B. 'binance', 'coinbase', 'kraken')
     * @param {string} apiKey - API-Schlüssel der Börse
     * @param {string} secret - Secret-Schlüssel der Börse
     * @param {object} options - Zusätzliche Optionen für die Börse
     */
    constructor(exchangeId, apiKey = '', secret = '', options = {}) {
        if (!ccxt.exchanges.includes(exchangeId)) {
            throw new Error(`Börse '${exchangeId}' wird nicht unterstützt. Verfügbare Börsen: ${ccxt.exchanges.join(', ')}`);
        }

        const defaultOptions = {
            apiKey: apiKey,
            secret: secret,
            timeout: 30000,
            enableRateLimit: true,
            sandbox: false,
            ...options
        };

        this.exchangeId = exchangeId;
        this.exchange = new ccxt[exchangeId](defaultOptions);
    }

    /**
     * Hilfsmethode für einheitliche Fehlerbehandlung
     * @param {Function} operation - Die auszuführende Operation
     * @param {string} operationName - Name der Operation für Logging
     */
    async executeWithErrorHandling(operation, operationName) {
        try {
            const result = await operation();
            return { 
                success: true, 
                data: result,
                timestamp: Date.now(),
                exchange: this.exchangeId
            };
        } catch (error) {
            let errorType = 'UnknownError';
            let errorMessage = error.message;

            // CCXT-spezifische Fehlertypen
            if (error instanceof ccxt.NetworkError) {
                errorType = 'NetworkError';
            } else if (error instanceof ccxt.ExchangeError) {
                errorType = 'ExchangeError';
            } else if (error instanceof ccxt.AuthenticationError) {
                errorType = 'AuthenticationError';
            } else if (error instanceof ccxt.PermissionDenied) {
                errorType = 'PermissionDenied';
            } else if (error instanceof ccxt.InsufficientFunds) {
                errorType = 'InsufficientFunds';
            } else if (error instanceof ccxt.InvalidOrder) {
                errorType = 'InvalidOrder';
            } else if (error instanceof ccxt.OrderNotFound) {
                errorType = 'OrderNotFound';
            } else if (error instanceof ccxt.RateLimitExceeded) {
                errorType = 'RateLimitExceeded';
            }

            return {
                success: false,
                error: {
                    type: errorType,
                    message: errorMessage,
                    operation: operationName,
                    exchange: this.exchangeId,
                    timestamp: Date.now()
                }
            };
        }
    }

    /**
     * Lädt die verfügbaren Märkte der Börse
     * @param {boolean} reload - Erzwingt das Neuladen der Märkte
     */
    async loadMarkets(reload = false) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.loadMarkets(reload);
        }, 'loadMarkets');
    }

    /**
     * Holt das Kontoguthaben
     */
    async fetchBalance() {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchBalance();
        }, 'fetchBalance');
    }

    /**
     * Erstellt eine neue Order
     * @param {string} symbol - Handelspaar (z.B. 'BTC/USDT')
     * @param {string} type - Order-Typ ('market', 'limit')
     * @param {string} side - Seite ('buy', 'sell')
     * @param {number} amount - Menge
     * @param {number} price - Preis (nur bei Limit-Orders)
     * @param {object} params - Zusätzliche Parameter
     */
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.createOrder(symbol, type, side, amount, price, params);
        }, 'createOrder');
    }

    /**
     * Holt offene Orders
     * @param {string} symbol - Handelspaar (optional)
     * @param {number} since - Zeitstempel ab wann (optional)
     * @param {number} limit - Maximale Anzahl (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchOpenOrders(symbol, since, limit, params);
        }, 'fetchOpenOrders');
    }

    /**
     * Holt geschlossene Orders
     * @param {string} symbol - Handelspaar (optional)
     * @param {number} since - Zeitstempel ab wann (optional)
     * @param {number} limit - Maximale Anzahl (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchClosedOrders(symbol, since, limit, params);
        }, 'fetchClosedOrders');
    }

    /**
     * Storniert eine Order
     * @param {string} id - Order-ID
     * @param {string} symbol - Handelspaar (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async cancelOrder(id, symbol = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.cancelOrder(id, symbol, params);
        }, 'cancelOrder');
    }

    /**
     * Storniert alle offenen Orders
     * @param {string} symbol - Handelspaar (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async cancelAllOrders(symbol = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            if (this.exchange.has['cancelAllOrders']) {
                return await this.exchange.cancelAllOrders(symbol, params);
            } else {
                // Fallback: Alle offenen Orders einzeln stornieren
                const openOrders = await this.exchange.fetchOpenOrders(symbol);
                const cancelPromises = openOrders.map(order => 
                    this.exchange.cancelOrder(order.id, order.symbol)
                );
                return await Promise.all(cancelPromises);
            }
        }, 'cancelAllOrders');
    }

    /**
     * Holt OHLCV-Daten (Kerzen)
     * @param {string} symbol - Handelspaar
     * @param {string} timeframe - Zeitrahmen ('1m', '5m', '1h', '1d', etc.)
     * @param {number} since - Zeitstempel ab wann (optional)
     * @param {number} limit - Maximale Anzahl (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchOHLCV(symbol, timeframe, since, limit, params);
        }, 'fetchOHLCV');
    }

    /**
     * Holt Ticker-Daten für ein Symbol
     * @param {string} symbol - Handelspaar
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchTicker(symbol, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchTicker(symbol, params);
        }, 'fetchTicker');
    }

    /**
     * Holt Ticker-Daten für alle Symbole
     * @param {array} symbols - Array von Handelspaaren (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchTickers(symbols = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchTickers(symbols, params);
        }, 'fetchTickers');
    }

    /**
     * Holt das Orderbuch
     * @param {string} symbol - Handelspaar
     * @param {number} limit - Maximale Anzahl von Bids/Asks (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchOrderBook(symbol, limit, params);
        }, 'fetchOrderBook');
    }

    /**
     * Holt die letzten Trades
     * @param {string} symbol - Handelspaar
     * @param {number} since - Zeitstempel ab wann (optional)
     * @param {number} limit - Maximale Anzahl (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchTrades(symbol, since, limit, params);
        }, 'fetchTrades');
    }

    /**
     * Holt eigene Trades
     * @param {string} symbol - Handelspaar (optional)
     * @param {number} since - Zeitstempel ab wann (optional)
     * @param {number} limit - Maximale Anzahl (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchMyTrades(symbol, since, limit, params);
        }, 'fetchMyTrades');
    }

    /**
     * Holt Informationen über verfügbare Währungen
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchCurrencies(params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchCurrencies(params);
        }, 'fetchCurrencies');
    }

    /**
     * Holt den Status der Börse
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchStatus(params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchStatus(params);
        }, 'fetchStatus');
    }

    /**
     * Holt Einzahlungsadresse für eine Währung
     * @param {string} code - Währungscode (z.B. 'BTC', 'ETH')
     * @param {object} params - Zusätzliche Parameter
     */
    async fetchDepositAddress(code, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.fetchDepositAddress(code, params);
        }, 'fetchDepositAddress');
    }

    /**
     * Erstellt eine Auszahlungsanfrage
     * @param {string} code - Währungscode
     * @param {number} amount - Auszahlungsbetrag
     * @param {string} address - Zieladresse
     * @param {string} tag - Tag/Memo (optional)
     * @param {object} params - Zusätzliche Parameter
     */
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        return this.executeWithErrorHandling(async () => {
            return await this.exchange.withdraw(code, amount, address, tag, params);
        }, 'withdraw');
    }

    /**
     * Gibt Informationen über die Börse zurück
     */
    getExchangeInfo() {
        return {
            id: this.exchange.id,
            name: this.exchange.name,
            countries: this.exchange.countries,
            urls: this.exchange.urls,
            version: this.exchange.version,
            has: this.exchange.has,
            timeframes: this.exchange.timeframes,
            fees: this.exchange.fees,
            limits: this.exchange.limits,
            precision: this.exchange.precision
        };
    }

    /**
     * Gibt alle verfügbaren Börsen zurück
     */
    static getAvailableExchanges() {
        return ccxt.exchanges;
    }

    /**
     * Prüft ob eine bestimmte Funktion von der Börse unterstützt wird
     * @param {string} feature - Name der Funktion
     */
    hasFeature(feature) {
        return this.exchange.has[feature] || false;
    }

    /**
     * Setzt Sandbox-Modus (falls unterstützt)
     * @param {boolean} enabled - Sandbox aktivieren/deaktivieren
     */
    setSandboxMode(enabled) {
        if (this.exchange.urls.test) {
            this.exchange.sandbox = enabled;
            this.exchange.urls.api = enabled ? this.exchange.urls.test : this.exchange.urls.api;
        }
    }
}

module.exports = ZebotAPI;

