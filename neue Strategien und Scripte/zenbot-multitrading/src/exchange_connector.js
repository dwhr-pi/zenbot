/**
 * Exchange-Connector für Zenbot Multi-Trading
 * 
 * Stellt die Verbindung zu verschiedenen Kryptobörsen her und
 * verwaltet die API-Kommunikation für Trading-Operationen.
 */

const ccxt = require('ccxt');

class ExchangeConnector {
  constructor(options = {}) {
    this.exchange = options.exchange;
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
    this.logger = options.logger;
    this.exchangeInstance = null;
    this.isConnected = false;
    this.marketCache = new Map();
    this.lastApiCall = 0;
    this.rateLimitMs = 1000; // Mindestabstand zwischen API-Aufrufen in ms
  }

  /**
   * Initialisiert den Exchange-Connector
   */
  async init() {
    try {
      this.logger.info(`Initialisiere Exchange-Connector für ${this.exchange}`);
      
      // Prüfen, ob die Börse unterstützt wird
      if (!ccxt.exchanges.includes(this.exchange)) {
        throw new Error(`Börse ${this.exchange} wird nicht unterstützt`);
      }
      
      // Exchange-Instanz erstellen
      const ExchangeClass = ccxt[this.exchange];
      this.exchangeInstance = new ExchangeClass({
        apiKey: this.apiKey,
        secret: this.apiSecret,
        enableRateLimit: true,
        timeout: 30000
      });
      
      this.logger.info(`Exchange-Connector für ${this.exchange} erfolgreich initialisiert`);
      return true;
    } catch (error) {
      this.logger.error(`Fehler bei der Initialisierung des Exchange-Connectors für ${this.exchange}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Stellt die Verbindung zur Börse her
   */
  async connect() {
    if (this.isConnected) {
      this.logger.warn(`Bereits mit ${this.exchange} verbunden`);
      return;
    }

    try {
      this.logger.info(`Verbinde mit ${this.exchange}`);
      
      // Verbindung testen durch Abruf der Märkte
      await this.exchangeInstance.loadMarkets();
      
      this.isConnected = true;
      this.logger.info(`Erfolgreich mit ${this.exchange} verbunden`);
    } catch (error) {
      this.logger.error(`Fehler beim Verbinden mit ${this.exchange}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Trennt die Verbindung zur Börse
   */
  async disconnect() {
    if (!this.isConnected) {
      this.logger.warn(`Nicht mit ${this.exchange} verbunden`);
      return;
    }

    try {
      this.logger.info(`Trenne Verbindung zu ${this.exchange}`);
      
      // In CCXT gibt es keine explizite Methode zum Trennen der Verbindung,
      // daher setzen wir nur den Status zurück
      this.isConnected = false;
      
      this.logger.info(`Verbindung zu ${this.exchange} erfolgreich getrennt`);
    } catch (error) {
      this.logger.error(`Fehler beim Trennen der Verbindung zu ${this.exchange}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Aktualisiert die Konfiguration des Exchange-Connectors
   */
  async updateConfig(newConfig) {
    try {
      this.logger.info(`Aktualisiere Konfiguration des Exchange-Connectors für ${this.exchange}`);
      
      const needsReconnect = newConfig.exchange && newConfig.exchange !== this.exchange;
      
      // Verbindung trennen, falls notwendig
      if (this.isConnected && needsReconnect) {
        await this.disconnect();
      }
      
      // Konfiguration aktualisieren
      if (newConfig.exchange) this.exchange = newConfig.exchange;
      if (newConfig.apiKey) this.apiKey = newConfig.apiKey;
      if (newConfig.apiSecret) this.apiSecret = newConfig.apiSecret;
      
      // Exchange-Instanz neu erstellen, falls notwendig
      if (needsReconnect) {
        await this.init();
        
        // Verbindung wiederherstellen, falls zuvor verbunden
        if (this.isConnected) {
          await this.connect();
        }
      } else if (newConfig.apiKey || newConfig.apiSecret) {
        // API-Schlüssel aktualisieren
        this.exchangeInstance.apiKey = this.apiKey;
        this.exchangeInstance.secret = this.apiSecret;
      }
      
      this.logger.info(`Konfiguration des Exchange-Connectors für ${this.exchange} erfolgreich aktualisiert`);
    } catch (error) {
      this.logger.error(`Fehler beim Aktualisieren der Konfiguration des Exchange-Connectors für ${this.exchange}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ruft Marktdaten für einen bestimmten Coin ab
   */
  async getMarketData(coin, timeframe = '1h', limit = 100) {
    await this.checkConnection();
    await this.throttleApiCall();

    try {
      const symbol = this.getSymbol(coin);
      
      // Prüfen, ob Daten im Cache vorhanden sind und nicht älter als 1 Minute
      const cacheKey = `${symbol}_${timeframe}_${limit}`;
      const cachedData = this.marketCache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < 60000) {
        return cachedData.data;
      }
      
      this.logger.debug(`Rufe Marktdaten für ${symbol} ab (${timeframe}, ${limit} Einträge)`);
      
      // OHLCV-Daten abrufen
      const ohlcv = await this.exchangeInstance.fetchOHLCV(symbol, timeframe, undefined, limit);
      
      // Ticker-Daten abrufen
      const ticker = await this.exchangeInstance.fetchTicker(symbol);
      
      // Orderbuch abrufen
      const orderbook = await this.exchangeInstance.fetchOrderBook(symbol);
      
      // Marktdaten zusammenstellen
      const marketData = {
        symbol,
        timeframe,
        ohlcv,
        ticker,
        orderbook,
        timestamp: Date.now()
      };
      
      // Daten im Cache speichern
      this.marketCache.set(cacheKey, {
        data: marketData,
        timestamp: Date.now()
      });
      
      return marketData;
    } catch (error) {
      this.logger.error(`Fehler beim Abrufen der Marktdaten für ${coin}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Führt einen Trade aus
   */
  async executeTrade(tradeParams) {
    await this.checkConnection();
    await this.throttleApiCall();

    try {
      const { coin, type, amount, price } = tradeParams;
      const symbol = this.getSymbol(coin);
      
      this.logger.info(`Führe Trade aus: ${type} ${amount} ${coin} @ ${price}`);
      
      let order;
      
      // Trade ausführen
      if (type === 'buy') {
        order = await this.exchangeInstance.createLimitBuyOrder(symbol, amount, price);
      } else if (type === 'sell') {
        order = await this.exchangeInstance.createLimitSellOrder(symbol, amount, price);
      } else {
        throw new Error(`Ungültiger Trade-Typ: ${type}`);
      }
      
      // Auf Ausführung warten
      const completedOrder = await this.waitForOrderCompletion(order.id, symbol);
      
      // Profit berechnen (vereinfacht)
      let profit = 0;
      if (type === 'sell') {
        // Für eine vollständige Implementierung müsste hier der Einkaufspreis
        // aus einer Datenbank abgerufen werden
        profit = (completedOrder.price - price) * amount;
      }
      
      return {
        success: true,
        orderId: completedOrder.id,
        price: completedOrder.price,
        amount: completedOrder.amount,
        cost: completedOrder.cost,
        profit
      };
    } catch (error) {
      this.logger.error(`Fehler beim Ausführen des Trades für ${coin}: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Wartet auf die Ausführung einer Order
   */
  async waitForOrderCompletion(orderId, symbol, maxWaitTime = 60000) {
    const startTime = Date.now();
    let order;
    
    while (Date.now() - startTime < maxWaitTime) {
      await this.throttleApiCall();
      
      order = await this.exchangeInstance.fetchOrder(orderId, symbol);
      
      if (order.status === 'closed') {
        return order;
      }
      
      // Kurz warten, bevor erneut geprüft wird
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Wenn die Order nach der maximalen Wartezeit nicht ausgeführt wurde,
    // versuchen wir, sie zu stornieren
    await this.throttleApiCall();
    await this.exchangeInstance.cancelOrder(orderId, symbol);
    
    throw new Error(`Order ${orderId} wurde nicht innerhalb der maximalen Wartezeit ausgeführt`);
  }

  /**
   * Ruft den Kontostand ab
   */
  async getBalance(coin) {
    await this.checkConnection();
    await this.throttleApiCall();

    try {
      this.logger.debug(`Rufe Kontostand für ${coin} ab`);
      
      const balance = await this.exchangeInstance.fetchBalance();
      const coinBalance = balance[coin] || { free: 0, used: 0, total: 0 };
      
      return {
        available: coinBalance.free,
        inOrder: coinBalance.used,
        total: coinBalance.total
      };
    } catch (error) {
      this.logger.error(`Fehler beim Abrufen des Kontostands für ${coin}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ruft offene Positionen ab
   */
  async getOpenPositions(coin) {
    await this.checkConnection();
    await this.throttleApiCall();

    try {
      const symbol = this.getSymbol(coin);
      
      this.logger.debug(`Rufe offene Positionen für ${symbol} ab`);
      
      const openOrders = await this.exchangeInstance.fetchOpenOrders(symbol);
      
      return openOrders.map(order => ({
        id: order.id,
        symbol: order.symbol,
        type: order.side,
        amount: order.amount,
        price: order.price,
        timestamp: order.timestamp
      }));
    } catch (error) {
      this.logger.error(`Fehler beim Abrufen der offenen Positionen für ${coin}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Prüft, ob eine Verbindung zur Börse besteht
   */
  async checkConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * Drosselt API-Aufrufe, um Rate-Limits einzuhalten
   */
  async throttleApiCall() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.rateLimitMs) {
      const waitTime = this.rateLimitMs - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastApiCall = Date.now();
  }

  /**
   * Erstellt ein Symbol aus einem Coin
   */
  getSymbol(coin) {
    // Standard-Basiswährung (kann je nach Börse angepasst werden)
    const base = 'USDT';
    return `${coin}/${base}`;
  }
}

module.exports = ExchangeConnector;
