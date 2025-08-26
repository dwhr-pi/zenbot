// Binance API Connector für den Trading-Algorithmus
// Verantwortlich für die Kommunikation mit der Binance API

class BinanceConnector {
  constructor(config) {
    this.apiKey = config.apiKey || '';
    this.apiSecret = config.apiSecret || '';
    this.baseUrl = 'https://api.binance.com';
    this.testMode = config.testMode || false;
    
    if (this.testMode) {
      this.baseUrl = 'https://testnet.binance.vision';
    }
    
    this.defaultOptions = {
      recvWindow: 60000, // Maximale Zeit für Anfragen
      timestamp: Date.now(),
      useServerTime: true
    };
  }

  /**
   * Initialisiert die Verbindung und synchronisiert die Serverzeit
   */
  async initialize() {
    try {
      if (this.defaultOptions.useServerTime) {
        await this.syncServerTime();
      }
      console.log('Binance Connector initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Binance connector:', error);
      throw error;
    }
  }

  /**
   * Synchronisiert die lokale Zeit mit der Binance-Serverzeit
   */
  async syncServerTime() {
    try {
      const response = await this.publicRequest('/api/v3/time');
      const serverTime = response.serverTime;
      this.timeOffset = serverTime - Date.now();
      console.log(`Server time synchronized. Offset: ${this.timeOffset}ms`);
      return serverTime;
    } catch (error) {
      console.error('Error syncing server time:', error);
      throw error;
    }
  }

  /**
   * Sendet eine öffentliche Anfrage an die Binance API
   * @param {string} endpoint - API-Endpunkt
   * @param {Object} params - Anfrageparameter
   * @returns {Promise<Object>} - API-Antwort
   */
  async publicRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      // Parameter zur URL hinzufügen
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in public request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Sendet eine authentifizierte Anfrage an die Binance API
   * @param {string} endpoint - API-Endpunkt
   * @param {Object} params - Anfrageparameter
   * @param {string} method - HTTP-Methode (GET, POST, DELETE)
   * @returns {Promise<Object>} - API-Antwort
   */
  async privateRequest(endpoint, params = {}, method = 'GET') {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API key and secret are required for private requests');
    }
    
    try {
      // Timestamp hinzufügen und mit Serverzeit synchronisieren
      const timestamp = Date.now() + (this.timeOffset || 0);
      const queryParams = {
        ...params,
        timestamp
      };
      
      // Signatur erstellen
      const signature = this.createSignature(queryParams);
      queryParams.signature = signature;
      
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      let options = {
        method,
        headers: {
          'X-MBX-APIKEY': this.apiKey,
          'Content-Type': 'application/json'
        }
      };
      
      if (method === 'GET') {
        // Parameter zur URL hinzufügen
        Object.keys(queryParams).forEach(key => {
          url.searchParams.append(key, queryParams[key]);
        });
      } else {
        // Parameter im Body senden
        options.body = JSON.stringify(queryParams);
      }
      
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in private request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Erstellt eine HMAC-SHA256-Signatur für die Authentifizierung
   * @param {Object} params - Parameter, die signiert werden sollen
   * @returns {string} - Signatur
   */
  createSignature(params) {
    // In einer echten Implementierung würde hier die HMAC-SHA256-Signatur erstellt
    // Für dieses Beispiel verwenden wir einen Platzhalter
    console.log('Creating signature for params:', params);
    return 'signature_placeholder';
  }

  /**
   * Holt Kurshistorie von Binance
   * @param {string} symbol - Handelspaar (z.B. 'BTCUSDT')
   * @param {string} interval - Kerzenzeitintervall (z.B. '1h', '1d')
   * @param {number} limit - Anzahl der Kerzen
   * @returns {Promise<Array>} - Kurshistorie
   */
  async getCandles(symbol, interval, limit = 500) {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        interval,
        limit
      };
      
      const response = await this.publicRequest('/api/v3/klines', params);
      
      // Daten in ein benutzerfreundliches Format umwandeln
      return response.map(candle => ({
        timestamp: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        closeTime: candle[6],
        quoteAssetVolume: parseFloat(candle[7]),
        trades: candle[8],
        takerBuyBaseAssetVolume: parseFloat(candle[9]),
        takerBuyQuoteAssetVolume: parseFloat(candle[10])
      }));
    } catch (error) {
      console.error(`Error fetching candles for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Holt aktuelle Marktpreise für alle Symbole
   * @returns {Promise<Object>} - Aktuelle Preise
   */
  async getTicker() {
    try {
      return await this.publicRequest('/api/v3/ticker/price');
    } catch (error) {
      console.error('Error fetching ticker:', error);
      throw error;
    }
  }

  /**
   * Holt Kontoinformationen
   * @returns {Promise<Object>} - Kontoinformationen
   */
  async getAccountInfo() {
    try {
      return await this.privateRequest('/api/v3/account');
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Erstellt eine neue Order
   * @param {Object} orderParams - Order-Parameter
   * @returns {Promise<Object>} - Order-Informationen
   */
  async createOrder(orderParams) {
    try {
      return await this.privateRequest('/api/v3/order', orderParams, 'POST');
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Storniert eine bestehende Order
   * @param {string} symbol - Handelspaar
   * @param {string} orderId - Order-ID
   * @returns {Promise<Object>} - Stornierungsbestätigung
   */
  async cancelOrder(symbol, orderId) {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        orderId
      };
      
      return await this.privateRequest('/api/v3/order', params, 'DELETE');
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Initialisiert einen WebSocket-Stream für Kerzendaten
   * @param {string} symbol - Handelspaar
   * @param {string} interval - Kerzenzeitintervall
   * @param {Function} callback - Callback-Funktion für eingehende Daten
   */
  subscribeToKlineStream(symbol, interval, callback) {
    // In einer echten Implementierung würde hier die WebSocket-Verbindung hergestellt
    console.log(`Subscribing to kline stream for ${symbol} with interval ${interval}`);
    
    // Simulierte WebSocket-Verbindung
    const intervalId = setInterval(() => {
      const mockData = {
        eventType: 'kline',
        eventTime: Date.now(),
        symbol: symbol.toUpperCase(),
        kline: {
          startTime: Date.now() - 60000,
          endTime: Date.now(),
          symbol: symbol.toUpperCase(),
          interval,
          firstTradeId: 123456,
          lastTradeId: 123457,
          open: '50000.00',
          close: '50050.00',
          high: '50100.00',
          low: '49900.00',
          volume: '10.5',
          trades: 100,
          final: true,
          quoteVolume: '525000.00',
          volumeActive: '8.5',
          quoteVolumeActive: '425000.00'
        }
      };
      
      callback(mockData);
    }, 5000); // Alle 5 Sekunden simulierte Daten senden
    
    // Funktion zum Beenden des Streams zurückgeben
    return () => {
      clearInterval(intervalId);
      console.log(`Unsubscribed from kline stream for ${symbol}`);
    };
  }
}

module.exports = BinanceConnector;
