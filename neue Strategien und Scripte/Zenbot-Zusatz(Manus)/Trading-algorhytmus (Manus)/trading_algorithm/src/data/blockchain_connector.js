// Blockchain.com API Connector für den Trading-Algorithmus
// Verantwortlich für die Erfassung von On-Chain-Metriken

class BlockchainConnector {
  constructor(config = {}) {
    this.baseUrl = 'https://api.blockchain.info';
    this.chartUrl = `${this.baseUrl}/charts`;
    this.statsUrl = `${this.baseUrl}/stats`;
    this.corsEnabled = config.corsEnabled || false;
    this.cacheTime = config.cacheTime || 300000; // 5 Minuten Cache-Zeit
    this.cache = new Map();
  }

  /**
   * Sendet eine Anfrage an die Blockchain.com API
   * @param {string} url - API-URL
   * @param {Object} params - Anfrageparameter
   * @returns {Promise<Object>} - API-Antwort
   */
  async makeRequest(url, params = {}) {
    try {
      // Parameter zur URL hinzufügen
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        queryParams.append(key, params[key]);
      });

      // CORS-Header hinzufügen, falls aktiviert
      const headers = {};
      if (this.corsEnabled) {
        headers['X-Cors-True'] = 'true';
      }

      const fullUrl = `${url}?${queryParams.toString()}`;
      
      // Cache-Prüfung
      const cacheKey = fullUrl;
      const cachedData = this.cache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp < this.cacheTime)) {
        console.log(`Using cached data for ${cacheKey}`);
        return cachedData.data;
      }

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Daten im Cache speichern
      this.cache.set(cacheKey, {
        timestamp: now,
        data
      });
      
      return data;
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  /**
   * Holt Chartdaten von der Blockchain.com API
   * @param {string} chartName - Name des Charts
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Chartdaten
   */
  async getChartData(chartName, options = {}) {
    const defaultOptions = {
      timespan: '1year',
      rollingAverage: '8hours',
      format: 'json',
      sampled: true
    };

    const params = { ...defaultOptions, ...options };
    const url = `${this.chartUrl}/${chartName}`;

    return this.makeRequest(url, params);
  }

  /**
   * Holt aktuelle Blockchain-Statistiken
   * @returns {Promise<Object>} - Blockchain-Statistiken
   */
  async getStats() {
    return this.makeRequest(this.statsUrl);
  }

  /**
   * Holt Mining-Pool-Verteilung
   * @param {string} timespan - Zeitspanne (z.B. '4days')
   * @returns {Promise<Object>} - Mining-Pool-Verteilung
   */
  async getPoolDistribution(timespan = '4days') {
    const url = `${this.baseUrl}/pools`;
    return this.makeRequest(url, { timespan });
  }

  /**
   * Holt Transaktionen pro Tag
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Transaktionen pro Tag
   */
  async getTransactionsPerDay(options = {}) {
    return this.getChartData('n-transactions', options);
  }

  /**
   * Holt Hashrate
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Hashrate
   */
  async getHashRate(options = {}) {
    return this.getChartData('hash-rate', options);
  }

  /**
   * Holt Schwierigkeitsgrad
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Schwierigkeitsgrad
   */
  async getDifficulty(options = {}) {
    return this.getChartData('difficulty', options);
  }

  /**
   * Holt Transaktionsgebühren
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Transaktionsgebühren
   */
  async getTransactionFees(options = {}) {
    return this.getChartData('fees', options);
  }

  /**
   * Holt Marktpreis
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Marktpreis
   */
  async getMarketPrice(options = {}) {
    return this.getChartData('market-price', options);
  }

  /**
   * Holt Mempool-Größe
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Mempool-Größe
   */
  async getMempoolSize(options = {}) {
    return this.getChartData('mempool-size', options);
  }

  /**
   * Holt mehrere On-Chain-Metriken gleichzeitig
   * @param {Array<string>} metrics - Liste der gewünschten Metriken
   * @param {Object} options - Optionen für die Anfrage
   * @returns {Promise<Object>} - Objekt mit allen angeforderten Metriken
   */
  async getMultipleMetrics(metrics, options = {}) {
    try {
      const promises = metrics.map(metric => {
        switch (metric) {
          case 'transactions':
            return this.getTransactionsPerDay(options);
          case 'hashrate':
            return this.getHashRate(options);
          case 'difficulty':
            return this.getDifficulty(options);
          case 'fees':
            return this.getTransactionFees(options);
          case 'price':
            return this.getMarketPrice(options);
          case 'mempool':
            return this.getMempoolSize(options);
          case 'stats':
            return this.getStats();
          case 'pools':
            return this.getPoolDistribution(options.timespan);
          default:
            throw new Error(`Unknown metric: ${metric}`);
        }
      });

      const results = await Promise.all(promises);
      
      // Ergebnisse in ein Objekt mit Metrik-Namen als Schlüssel umwandeln
      const metricsData = {};
      metrics.forEach((metric, index) => {
        metricsData[metric] = results[index];
      });

      return metricsData;
    } catch (error) {
      console.error('Error fetching multiple metrics:', error);
      throw error;
    }
  }

  /**
   * Extrahiert die neuesten Werte aus Chartdaten
   * @param {Object} chartData - Chartdaten von der API
   * @param {number} count - Anzahl der neuesten Werte
   * @returns {Array} - Array der neuesten Werte
   */
  extractLatestValues(chartData, count = 1) {
    if (!chartData || !chartData.values || !Array.isArray(chartData.values)) {
      throw new Error('Invalid chart data format');
    }

    const values = chartData.values;
    const latestValues = values.slice(Math.max(0, values.length - count));
    
    return latestValues.map(item => ({
      timestamp: item.x * 1000, // Umwandlung in Millisekunden
      value: item.y
    }));
  }

  /**
   * Berechnet prozentuale Veränderung zwischen aktuellen und früheren Werten
   * @param {Object} chartData - Chartdaten von der API
   * @param {number} periods - Anzahl der Perioden für die Berechnung
   * @returns {number} - Prozentuale Veränderung
   */
  calculatePercentageChange(chartData, periods = 7) {
    if (!chartData || !chartData.values || !Array.isArray(chartData.values)) {
      throw new Error('Invalid chart data format');
    }

    const values = chartData.values;
    if (values.length < periods + 1) {
      throw new Error(`Not enough data points. Need at least ${periods + 1}`);
    }

    const currentValue = values[values.length - 1].y;
    const previousValue = values[values.length - 1 - periods].y;
    
    if (previousValue === 0) {
      return 0; // Vermeidung von Division durch Null
    }
    
    return ((currentValue - previousValue) / previousValue) * 100;
  }
}

module.exports = BlockchainConnector;
