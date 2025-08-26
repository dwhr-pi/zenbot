// Risikomanagement-Modul für den Trading-Algorithmus
// Verantwortlich für die Anwendung von Stop-Loss, Take-Profit und Position Sizing

class RiskManager {
  constructor(config = {}) {
    // Stop-Loss und Take-Profit Einstellungen
    this.stopLossPercentage = config.stopLossPercentage || 2.0; // Prozent unter Einstiegspreis
    this.takeProfitPercentage = config.takeProfitPercentage || 3.0; // Prozent über Einstiegspreis
    this.trailingStopPercentage = config.trailingStopPercentage || 1.5; // Prozent unter Höchstpreis
    
    // Position Sizing
    this.maxPositionSize = config.maxPositionSize || 0.1; // Maximaler Anteil des Portfolios pro Position
    this.basePositionSize = config.basePositionSize || 0.05; // Standardanteil des Portfolios pro Position
    this.riskPerTrade = config.riskPerTrade || 0.01; // Maximaler Verlust pro Trade (1% des Portfolios)
    
    // Volatilitätsanpassung
    this.volatilityAdjustment = config.volatilityAdjustment || true; // Positionsgröße an Volatilität anpassen
    this.volatilityWindow = config.volatilityWindow || 14; // Zeitfenster für Volatilitätsberechnung
    
    // Offene Positionen
    this.positions = [];
  }

  /**
   * Berechnet die optimale Positionsgröße basierend auf Risikomanagement
   * @param {number} accountBalance - Kontostand
   * @param {number} entryPrice - Einstiegspreis
   * @param {number} stopLossPrice - Stop-Loss-Preis
   * @param {number} volatility - Aktuelle Volatilität (optional)
   * @returns {number} - Optimale Positionsgröße in der Basiswährung
   */
  calculatePositionSize(accountBalance, entryPrice, stopLossPrice, volatility = null) {
    // Risikobetrag berechnen (maximaler Verlust in Geldeinheiten)
    const riskAmount = accountBalance * this.riskPerTrade;
    
    // Preisdifferenz zwischen Einstieg und Stop-Loss
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    
    // Wenn keine Preisdifferenz, Standardpositionsgröße verwenden
    if (priceDifference === 0) {
      return accountBalance * this.basePositionSize;
    }
    
    // Positionsgröße basierend auf Risiko berechnen
    let positionSize = riskAmount / priceDifference;
    
    // In Geldeinheiten umrechnen
    const positionValue = positionSize * entryPrice;
    
    // Volatilitätsanpassung
    if (this.volatilityAdjustment && volatility !== null) {
      // Referenzvolatilität (z.B. durchschnittliche Volatilität)
      const referenceVolatility = 2.0; // 2% als Referenz
      
      // Anpassungsfaktor berechnen
      const adjustmentFactor = referenceVolatility / Math.max(volatility, 0.1);
      
      // Positionsgröße anpassen (höhere Volatilität = kleinere Position)
      positionValue *= Math.min(Math.max(adjustmentFactor, 0.5), 2.0);
    }
    
    // Maximale Positionsgröße begrenzen
    const maxPositionValue = accountBalance * this.maxPositionSize;
    
    // Kleinere der beiden Werte verwenden
    const finalPositionValue = Math.min(positionValue, maxPositionValue);
    
    // Zurück in Einheiten der Kryptowährung umrechnen
    return finalPositionValue / entryPrice;
  }

  /**
   * Berechnet den Stop-Loss-Preis für eine Position
   * @param {number} entryPrice - Einstiegspreis
   * @param {string} direction - Handelsrichtung ('long' oder 'short')
   * @returns {number} - Stop-Loss-Preis
   */
  calculateStopLoss(entryPrice, direction) {
    if (direction === 'long') {
      return entryPrice * (1 - this.stopLossPercentage / 100);
    } else {
      return entryPrice * (1 + this.stopLossPercentage / 100);
    }
  }

  /**
   * Berechnet den Take-Profit-Preis für eine Position
   * @param {number} entryPrice - Einstiegspreis
   * @param {string} direction - Handelsrichtung ('long' oder 'short')
   * @returns {number} - Take-Profit-Preis
   */
  calculateTakeProfit(entryPrice, direction) {
    if (direction === 'long') {
      return entryPrice * (1 + this.takeProfitPercentage / 100);
    } else {
      return entryPrice * (1 - this.takeProfitPercentage / 100);
    }
  }

  /**
   * Aktualisiert den Trailing-Stop für eine Position
   * @param {Object} position - Positionsobjekt
   * @param {number} currentPrice - Aktueller Preis
   * @returns {number} - Neuer Stop-Loss-Preis
   */
  updateTrailingStop(position, currentPrice) {
    if (!position.useTrailingStop) {
      return position.stopLossPrice;
    }
    
    if (position.direction === 'long') {
      // Für Long-Positionen: Trailing-Stop nach oben anpassen, wenn Preis steigt
      if (currentPrice > position.highestPrice) {
        position.highestPrice = currentPrice;
        const newStopLoss = currentPrice * (1 - this.trailingStopPercentage / 100);
        
        // Nur anpassen, wenn der neue Stop-Loss höher ist als der aktuelle
        if (newStopLoss > position.stopLossPrice) {
          position.stopLossPrice = newStopLoss;
          return newStopLoss;
        }
      }
    } else {
      // Für Short-Positionen: Trailing-Stop nach unten anpassen, wenn Preis fällt
      if (currentPrice < position.lowestPrice) {
        position.lowestPrice = currentPrice;
        const newStopLoss = currentPrice * (1 + this.trailingStopPercentage / 100);
        
        // Nur anpassen, wenn der neue Stop-Loss niedriger ist als der aktuelle
        if (newStopLoss < position.stopLossPrice) {
          position.stopLossPrice = newStopLoss;
          return newStopLoss;
        }
      }
    }
    
    return position.stopLossPrice;
  }

  /**
   * Öffnet eine neue Position
   * @param {string} symbol - Handelssymbol
   * @param {string} direction - Handelsrichtung ('long' oder 'short')
   * @param {number} entryPrice - Einstiegspreis
   * @param {number} size - Positionsgröße
   * @param {Object} options - Zusätzliche Optionen
   * @returns {Object} - Positionsobjekt
   */
  openPosition(symbol, direction, entryPrice, size, options = {}) {
    const stopLossPrice = options.stopLossPrice || this.calculateStopLoss(entryPrice, direction);
    const takeProfitPrice = options.takeProfitPrice || this.calculateTakeProfit(entryPrice, direction);
    
    const position = {
      id: Date.now().toString(),
      symbol,
      direction,
      entryPrice,
      size,
      entryTime: Date.now(),
      stopLossPrice,
      takeProfitPrice,
      useTrailingStop: options.useTrailingStop !== undefined ? options.useTrailingStop : true,
      highestPrice: direction === 'long' ? entryPrice : Infinity,
      lowestPrice: direction === 'short' ? entryPrice : 0,
      status: 'open'
    };
    
    this.positions.push(position);
    return position;
  }

  /**
   * Schließt eine Position
   * @param {string} positionId - ID der Position
   * @param {number} exitPrice - Ausstiegspreis
   * @param {string} reason - Grund für das Schließen
   * @returns {Object} - Geschlossene Position mit P&L
   */
  closePosition(positionId, exitPrice, reason = 'manual') {
    const positionIndex = this.positions.findIndex(p => p.id === positionId);
    
    if (positionIndex === -1) {
      throw new Error(`Position with ID ${positionId} not found`);
    }
    
    const position = this.positions[positionIndex];
    
    // P&L berechnen
    let profitLoss;
    if (position.direction === 'long') {
      profitLoss = (exitPrice - position.entryPrice) * position.size;
    } else {
      profitLoss = (position.entryPrice - exitPrice) * position.size;
    }
    
    // Prozentuale Rendite berechnen
    const percentReturn = position.direction === 'long' 
      ? ((exitPrice / position.entryPrice) - 1) * 100
      : ((position.entryPrice / exitPrice) - 1) * 100;
    
    // Position aktualisieren
    position.exitPrice = exitPrice;
    position.exitTime = Date.now();
    position.profitLoss = profitLoss;
    position.percentReturn = percentReturn;
    position.status = 'closed';
    position.closeReason = reason;
    
    // Position aus der aktiven Liste entfernen
    this.positions.splice(positionIndex, 1);
    
    return position;
  }

  /**
   * Überprüft alle offenen Positionen auf Stop-Loss und Take-Profit
   * @param {Object} marketData - Aktuelle Marktdaten
   * @returns {Array} - Liste der geschlossenen Positionen
   */
  checkPositions(marketData) {
    if (!marketData || typeof marketData !== 'object') {
      throw new Error('Market data is required');
    }
    
    const closedPositions = [];
    
    // Alle offenen Positionen überprüfen
    this.positions.forEach(position => {
      // Aktuellen Preis für das Symbol abrufen
      const currentPrice = marketData[position.symbol]?.price;
      
      if (!currentPrice) {
        console.warn(`No price data for ${position.symbol}`);
        return;
      }
      
      // Trailing-Stop aktualisieren
      this.updateTrailingStop(position, currentPrice);
      
      // Stop-Loss und Take-Profit überprüfen
      if (position.direction === 'long') {
        // Long-Position
        if (currentPrice <= position.stopLossPrice) {
          // Stop-Loss ausgelöst
          const closedPosition = this.closePosition(position.id, currentPrice, 'stop_loss');
          closedPositions.push(closedPosition);
        } else if (currentPrice >= position.takeProfitPrice) {
          // Take-Profit ausgelöst
          const closedPosition = this.closePosition(position.id, currentPrice, 'take_profit');
          closedPositions.push(closedPosition);
        }
      } else {
        // Short-Position
        if (currentPrice >= position.stopLossPrice) {
          // Stop-Loss ausgelöst
          const closedPosition = this.closePosition(position.id, currentPrice, 'stop_loss');
          closedPositions.push(closedPosition);
        } else if (currentPrice <= position.takeProfitPrice) {
          // Take-Profit ausgelöst
          const closedPosition = this.closePosition(position.id, currentPrice, 'take_profit');
          closedPositions.push(closedPosition);
        }
      }
    });
    
    return closedPositions;
  }

  /**
   * Berechnet die Volatilität eines Preisdatensatzes
   * @param {Array<number>} prices - Preisdaten
   * @param {number} window - Zeitfenster für die Berechnung
   * @returns {number} - Volatilität (Standardabweichung der prozentualen Änderungen)
   */
  calculateVolatility(prices, window = this.volatilityWindow) {
    if (!Array.isArray(prices) || prices.length < window) {
      return null;
    }
    
    // Letzte n Preise verwenden
    const recentPrices = prices.slice(-window);
    
    // Prozentuale Änderungen berechnen
    const returns = [];
    for (let i = 1; i < recentPrices.length; i++) {
      const percentChange = ((recentPrices[i] - recentPrices[i - 1]) / recentPrices[i - 1]) * 100;
      returns.push(percentChange);
    }
    
    // Mittelwert berechnen
    const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    
    // Standardabweichung berechnen
    const squaredDiffs = returns.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / returns.length;
    const volatility = Math.sqrt(variance);
    
    return volatility;
  }

  /**
   * Wendet Risikomanagement auf ein Handelssignal an
   * @param {Object} signal - Handelssignal
   * @param {Object} marketData - Aktuelle Marktdaten
   * @param {Object} accountData - Kontodaten
   * @returns {Object} - Handelsaktion mit Risikomanagement
   */
  applyRiskManagement(signal, marketData, accountData) {
    if (!signal || !marketData || !accountData) {
      throw new Error('Signal, market data, and account data are required');
    }
    
    // Aktuelle Position für das Symbol finden
    const existingPosition = this.positions.find(p => p.symbol === marketData.symbol);
    
    // Volatilität berechnen
    const prices = marketData.recentPrices || [];
    const volatility = this.calculateVolatility(prices);
    
    // Handelsaktion basierend auf Signal und existierender Position
    let action = {
      type: 'none',
      symbol: marketData.symbol,
      price: marketData.price,
      timestamp: Date.now(),
      reason: 'no_signal'
    };
    
    if (signal.signal === 1) {
      // Kaufsignal
      if (!existingPosition) {
        // Keine existierende Position, neue Long-Position eröffnen
        const stopLossPrice = this.calculateStopLoss(marketData.price, 'long');
        const positionSize = this.calculatePositionSize(
          accountData.balance,
          marketData.price,
          stopLossPrice,
          volatility
        );
        
        action = {
          type: 'buy',
          symbol: marketData.symbol,
          price: marketData.price,
          size: positionSize,
          stopLoss: stopLossPrice,
          takeProfit: this.calculateTakeProfit(marketData.price, 'long'),
          timestamp: Date.now(),
          reason: 'signal',
          confidence: signal.confidence
        };
      } else if (existingPosition.direction === 'short') {
        // Existierende Short-Position schließen
        action = {
          type: 'close',
          symbol: marketData.symbol,
          price: marketData.price,
          positionId: existingPosition.id,
          timestamp: Date.now(),
          reason: 'signal_reversal'
        };
      }
    } else if (signal.signal === -1) {
      // Verkaufssignal
      if (!existingPosition) {
        // Keine existierende Position, neue Short-Position eröffnen
        const stopLossPrice = this.calculateStopLoss(marketData.price, 'short');
        const positionSize = this.calculatePositionSize(
          accountData.balance,
          marketData.price,
          stopLossPrice,
          volatility
        );
        
        action = {
          type: 'sell',
          symbol: marketData.symbol,
          price: marketData.price,
          size: positionSize,
          stopLoss: stopLossPrice,
          takeProfit: this.calculateTakeProfit(marketData.price, 'short'),
          timestamp: Date.now(),
          reason: 'signal',
          confidence: signal.confidence
        };
      } else if (existingPosition.direction === 'long') {
        // Existierende Long-Position schließen
        action = {
          type: 'close',
          symbol: marketData.symbol,
          price: marketData.price,
          positionId: existingPosition.id,
          timestamp: Date.now(),
          reason: 'signal_reversal'
        };
      }
    } else {
      // Neutrales Signal, keine Aktion
      action.reason = 'neutral_signal';
    }
    
    return action;
  }

  /**
   * Gibt alle offenen Positionen zurück
   * @returns {Array} - Liste der offenen Positionen
   */
  getOpenPositions() {
    return [...this.positions];
  }

  /**
   * Berechnet die Gesamtperformance aller geschlossenen Positionen
   * @param {Array} closedPositions - Liste der geschlossenen Positionen
   * @returns {Object} - Performance-Metriken
   */
  calculatePerformance(closedPositions) {
    if (!Array.isArray(closedPositions) || closedPositions.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        averageReturn: 0,
        totalReturn: 0
      };
    }
    
    const totalTrades = closedPositions.length;
    const winningTrades = closedPositions.filter(p => p.profitLoss > 0).length;
    const winRate = (winningTrades / totalTrades) * 100;
    
    const totalReturn = closedPositions.reduce((sum, p) => sum + p.percentReturn, 0);
    const averageReturn = totalReturn / totalTrades;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      winRate,
      averageReturn,
      totalReturn
    };
  }
}

module.exports = RiskManager;
