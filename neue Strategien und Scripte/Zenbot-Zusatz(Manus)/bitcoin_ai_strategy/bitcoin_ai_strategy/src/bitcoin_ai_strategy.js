// Bitcoin AI Strategy for Zenbot
// Combines technical indicators with machine learning for Bitcoin trading

var z = require('zero-fill')
var n = require('numbro')
var stats = require('../../lib/stats')
var ema = require('../../lib/ema')
var rsi = require('../../lib/rsi')
var Phenotypes = require('../../lib/phenotype')
var bollingerBands = require('../../lib/bollinger')
var vwap = require('../../lib/vwap')

// Simulated ML model for demonstration purposes
// In a real implementation, this would be replaced with a proper ML library
var MLModel = {
  predict: function(features) {
    // Simple weighted average of features as a placeholder for ML prediction
    var prediction = 0
    var weights = [0.3, 0.2, 0.15, 0.15, 0.1, 0.1]
    
    if (features.rsi < 30) prediction += weights[0] * 1
    else if (features.rsi > 70) prediction += weights[0] * -1
    
    if (features.macd > 0) prediction += weights[1] * 1
    else if (features.macd < 0) prediction += weights[1] * -1
    
    if (features.price > features.upper_band) prediction += weights[2] * -1
    else if (features.price < features.lower_band) prediction += weights[2] * 1
    
    if (features.ema_short > features.ema_long) prediction += weights[3] * 1
    else if (features.ema_short < features.ema_long) prediction += weights[3] * -1
    
    if (features.volume_change > 0) prediction += weights[4] * 1
    else if (features.volume_change < 0) prediction += weights[4] * -1
    
    if (features.price_change > 0) prediction += weights[5] * 1
    else if (features.price_change < 0) prediction += weights[5] * -1
    
    return {
      signal: prediction > 0.2 ? 'buy' : (prediction < -0.2 ? 'sell' : 'hold'),
      confidence: Math.abs(prediction)
    }
  }
}

// Pattern recognition module for chart patterns
var PatternRecognition = {
  findPatterns: function(lookback) {
    if (!lookback || lookback.length < 5) return { pattern: 'none', confidence: 0 }
    
    // Simple pattern detection logic (placeholder)
    // In a real implementation, this would be more sophisticated
    
    // Check for potential double bottom (W pattern)
    var doubleBottom = this.checkDoubleBottom(lookback)
    if (doubleBottom.confidence > 0.5) return doubleBottom
    
    // Check for potential double top (M pattern)
    var doubleTop = this.checkDoubleTop(lookback)
    if (doubleTop.confidence > 0.5) return doubleTop
    
    // Check for potential breakout
    var breakout = this.checkBreakout(lookback)
    if (breakout.confidence > 0.5) return breakout
    
    return { pattern: 'none', confidence: 0 }
  },
  
  checkDoubleBottom: function(lookback) {
    // Simplified double bottom detection
    if (lookback.length < 5) return { pattern: 'none', confidence: 0 }
    
    var prices = lookback.map(period => period.close)
    var lowestIdx = prices.indexOf(Math.min(...prices))
    
    // Look for another low point
    var secondLowest = Infinity
    var secondLowestIdx = -1
    
    for (var i = 0; i < prices.length; i++) {
      if (i !== lowestIdx && prices[i] < secondLowest && Math.abs(i - lowestIdx) > 1) {
        secondLowest = prices[i]
        secondLowestIdx = i
      }
    }
    
    // Check if the two lows are similar and there's a peak between them
    if (secondLowestIdx !== -1 && Math.abs(prices[lowestIdx] - secondLowest) / prices[lowestIdx] < 0.03) {
      var minIdx = Math.min(lowestIdx, secondLowestIdx)
      var maxIdx = Math.max(lowestIdx, secondLowestIdx)
      
      // Check for a peak between the two lows
      var hasPeak = false
      for (var j = minIdx + 1; j < maxIdx; j++) {
        if (prices[j] > prices[minIdx] * 1.02 && prices[j] > prices[maxIdx] * 1.02) {
          hasPeak = true
          break
        }
      }
      
      if (hasPeak) {
        return { 
          pattern: 'double_bottom', 
          confidence: 0.7,
          signal: 'buy'
        }
      }
    }
    
    return { pattern: 'none', confidence: 0 }
  },
  
  checkDoubleTop: function(lookback) {
    // Simplified double top detection
    if (lookback.length < 5) return { pattern: 'none', confidence: 0 }
    
    var prices = lookback.map(period => period.close)
    var highestIdx = prices.indexOf(Math.max(...prices))
    
    // Look for another high point
    var secondHighest = -Infinity
    var secondHighestIdx = -1
    
    for (var i = 0; i < prices.length; i++) {
      if (i !== highestIdx && prices[i] > secondHighest && Math.abs(i - highestIdx) > 1) {
        secondHighest = prices[i]
        secondHighestIdx = i
      }
    }
    
    // Check if the two highs are similar and there's a trough between them
    if (secondHighestIdx !== -1 && Math.abs(prices[highestIdx] - secondHighest) / prices[highestIdx] < 0.03) {
      var minIdx = Math.min(highestIdx, secondHighestIdx)
      var maxIdx = Math.max(highestIdx, secondHighestIdx)
      
      // Check for a trough between the two highs
      var hasTrough = false
      for (var j = minIdx + 1; j < maxIdx; j++) {
        if (prices[j] < prices[minIdx] * 0.98 && prices[j] < prices[maxIdx] * 0.98) {
          hasTrough = true
          break
        }
      }
      
      if (hasTrough) {
        return { 
          pattern: 'double_top', 
          confidence: 0.7,
          signal: 'sell'
        }
      }
    }
    
    return { pattern: 'none', confidence: 0 }
  },
  
  checkBreakout: function(lookback) {
    // Simplified breakout detection
    if (lookback.length < 5) return { pattern: 'none', confidence: 0 }
    
    var prices = lookback.map(period => period.close)
    var volumes = lookback.map(period => period.volume)
    
    // Check for price breakout with volume confirmation
    var recentPriceChange = (prices[0] - prices[1]) / prices[1]
    var recentVolumeChange = (volumes[0] - volumes[1]) / volumes[1]
    
    if (Math.abs(recentPriceChange) > 0.03 && recentVolumeChange > 0.5) {
      return { 
        pattern: recentPriceChange > 0 ? 'bullish_breakout' : 'bearish_breakout', 
        confidence: 0.6,
        signal: recentPriceChange > 0 ? 'buy' : 'sell'
      }
    }
    
    return { pattern: 'none', confidence: 0 }
  }
}

// Main strategy module
module.exports = {
  name: 'bitcoin_ai_strategy',
  description: 'Bitcoin AI Strategy that combines technical indicators with machine learning for optimal trading decisions',
  
  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '1h')
    this.option('period_length', 'period length, same as --period', String, '1h')
    this.option('min_periods', 'min. number of history periods', Number, 200)
    this.option('max_slippage_pct', 'max slippage pct', Number, 0.5)
    this.option('keep_lookback_periods', 'number of historical periods to keep for pattern recognition', Number, 500)
    
    // Technical indicators parameters
    this.option('rsi_periods', 'number of periods for RSI calculation', Number, 14)
    this.option('oversold_rsi', 'oversold RSI level', Number, 30)
    this.option('overbought_rsi', 'overbought RSI level', Number, 70)
    this.option('ema_short_period', 'number of periods for short EMA', Number, 12)
    this.option('ema_long_period', 'number of periods for long EMA', Number, 26)
    this.option('signal_period', 'number of periods for MACD signal', Number, 9)
    this.option('bollinger_size', 'bollinger size in standard deviations', Number, 2)
    this.option('bollinger_period', 'bollinger period', Number, 20)
    
    // ML model parameters
    this.option('prediction_horizon', 'number of periods for prediction', Number, 3)
    this.option('confidence_threshold', 'minimum confidence for trading signals', Number, 0.7)
    
    // Risk management parameters
    this.option('stop_loss_pct', 'stop loss percentage', Number, 2)
    this.option('profit_target_pct', 'profit target percentage', Number, 4)
    this.option('trailing_stop_pct', 'trailing stop percentage', Number, 1)
    this.option('max_position_size', 'maximum position size in percentage of portfolio', Number, 10)
  },
  
  calculate: function (s) {
    // Calculate technical indicators
    
    // RSI
    rsi(s, 'rsi', s.options.rsi_periods)
    
    // EMAs for MACD
    ema(s, 'ema_short', s.options.ema_short_period)
    ema(s, 'ema_long', s.options.ema_long_period)
    
    // MACD
    if (s.period.ema_short && s.period.ema_long) {
      s.period.macd = (s.period.ema_short - s.period.ema_long)
      ema(s, 'signal', s.options.signal_period, 'macd')
      if (s.period.signal) {
        s.period.macd_histogram = s.period.macd - s.period.signal
      }
    }
    
    // Bollinger Bands
    bollingerBands(s, 'bollinger', s.options.bollinger_period, s.options.bollinger_size)
    
    // VWAP
    vwap(s, 'vwap')
    
    // Calculate volume and price changes
    if (s.lookback[0]) {
      s.period.volume_change = ((s.period.volume - s.lookback[0].volume) / s.lookback[0].volume) * 100
      s.period.price_change = ((s.period.close - s.lookback[0].close) / s.lookback[0].close) * 100
    } else {
      s.period.volume_change = 0
      s.period.price_change = 0
    }
    
    // Prepare features for ML model
    if (s.period.rsi && s.period.macd && s.period.bollinger && s.period.ema_short && s.period.ema_long) {
      s.period.features = {
        rsi: s.period.rsi,
        macd: s.period.macd,
        macd_histogram: s.period.macd_histogram,
        price: s.period.close,
        upper_band: s.period.bollinger.upper,
        lower_band: s.period.bollinger.lower,
        ema_short: s.period.ema_short,
        ema_long: s.period.ema_long,
        volume_change: s.period.volume_change,
        price_change: s.period.price_change
      }
      
      // Get ML prediction
      s.period.ml_prediction = MLModel.predict(s.period.features)
    }
    
    // Pattern recognition
    if (s.lookback.length >= 5) {
      s.period.pattern = PatternRecognition.findPatterns(s.lookback.slice(0, 5))
    } else {
      s.period.pattern = { pattern: 'none', confidence: 0 }
    }
  },
  
  onPeriod: function (s, cb) {
    // Skip if not enough data
    if (!s.period.rsi || !s.period.macd || !s.period.bollinger || !s.period.ml_prediction) {
      return cb()
    }
    
    // Default to hold
    s.signal = null
    
    // Ensemble decision making
    var signals = {
      buy: 0,
      sell: 0,
      hold: 0
    }
    
    // Technical indicators signals
    if (s.period.rsi <= s.options.oversold_rsi) {
      signals.buy += 0.3
    } else if (s.period.rsi >= s.options.overbought_rsi) {
      signals.sell += 0.3
    } else {
      signals.hold += 0.3
    }
    
    if (s.period.macd_histogram > 0 && s.period.macd_histogram > s.lookback[0].macd_histogram) {
      signals.buy += 0.2
    } else if (s.period.macd_histogram < 0 && s.period.macd_histogram < s.lookback[0].macd_histogram) {
      signals.sell += 0.2
    } else {
      signals.hold += 0.2
    }
    
    if (s.period.close < s.period.bollinger.lower) {
      signals.buy += 0.15
    } else if (s.period.close > s.period.bollinger.upper) {
      signals.sell += 0.15
    } else {
      signals.hold += 0.15
    }
    
    // ML model signal
    if (s.period.ml_prediction.signal === 'buy' && s.period.ml_prediction.confidence >= s.options.confidence_threshold) {
      signals.buy += 0.25
    } else if (s.period.ml_prediction.signal === 'sell' && s.period.ml_prediction.confidence >= s.options.confidence_threshold) {
      signals.sell += 0.25
    } else {
      signals.hold += 0.25
    }
    
    // Pattern recognition signal
    if (s.period.pattern.confidence >= 0.5) {
      if (s.period.pattern.signal === 'buy') {
        signals.buy += 0.1
      } else if (s.period.pattern.signal === 'sell') {
        signals.sell += 0.1
      } else {
        signals.hold += 0.1
      }
    } else {
      signals.hold += 0.1
    }
    
    // Make final decision
    if (signals.buy > signals.sell && signals.buy > signals.hold) {
      s.signal = 'buy'
    } else if (signals.sell > signals.buy && signals.sell > signals.hold) {
      s.signal = 'sell'
    }
    
    // Risk management
    if (s.signal === 'buy' && s.balance.asset > 0) {
      // Already in position, don't buy more
      s.signal = null
    } else if (s.signal === 'sell' && s.balance.asset === 0) {
      // No position to sell
      s.signal = null
    }
    
    // Apply stop loss and take profit if in position
    if (s.balance.asset > 0) {
      var buyPrice = s.balance.asset_capital / s.balance.asset
      var currentProfit = (s.period.close - buyPrice) / buyPrice * 100
      
      // Stop loss
      if (currentProfit <= -s.options.stop_loss_pct) {
        s.signal = 'sell'
      }
      
      // Take profit
      if (currentProfit >= s.options.profit_target_pct) {
        s.signal = 'sell'
      }
      
      // Trailing stop
      if (s.period.high > s.balance.asset_capital / s.balance.asset) {
        s.balance.highest_seen = s.period.high
      }
      
      if (s.balance.highest_seen && s.period.close <= s.balance.highest_seen * (1 - s.options.trailing_stop_pct / 100)) {
        s.signal = 'sell'
      }
    }
    
    // Position sizing
    if (s.signal === 'buy') {
      s.balance.currency_limit = s.balance.currency * (s.options.max_position_size / 100)
    }
    
    cb()
  },
  
  onReport: function (s) {
    var cols = []
    
    // RSI
    if (typeof s.period.rsi === 'number') {
      var color = 'grey'
      if (s.period.rsi <= s.options.oversold_rsi) {
        color = 'green'
      }
      if (s.period.rsi >= s.options.overbought_rsi) {
        color = 'red'
      }
      cols.push(z(5, n(s.period.rsi).format('0.0'), ' ')[color] + ' RSI')
    }
    
    // MACD
    if (typeof s.period.macd === 'number') {
      var color = 'grey'
      if (s.period.macd > 0) {
        color = 'green'
      }
      if (s.period.macd < 0) {
        color = 'red'
      }
      cols.push(z(8, n(s.period.macd).format('0.000'), ' ')[color] + ' MACD')
    }
    
    // Bollinger Bands
    if (s.period.bollinger) {
      cols.push(z(8, n(s.period.bollinger.upper).format('0.000'), ' ') + ' BB Upper')
      cols.push(z(8, n(s.period.bollinger.lower).format('0.000'), ' ') + ' BB Lower')
    }
    
    // ML Prediction
    if (s.period.ml_prediction) {
      var color = 'grey'
      if (s.period.ml_prediction.signal === 'buy') {
        color = 'green'
      }
      if (s.period.ml_prediction.signal === 'sell') {
        color = 'red'
      }
      cols.push(z(8, n(s.period.ml_prediction.confidence).format('0.000'), ' ')[color] + ' ML ' + s.period.ml_prediction.signal)
    }
    
    // Pattern
    if (s.period.pattern && s.period.pattern.pattern !== 'none') {
      var color = 'grey'
      if (s.period.pattern.signal === 'buy') {
        color = 'green'
      }
      if (s.period.pattern.signal === 'sell') {
        color = 'red'
      }
      cols.push(z(15, s.period.pattern.pattern, ' ')[color] + ' ' + n(s.period.pattern.confidence).format('0.0'))
    }
    
    return cols
  },
  
  phenotypes: {
    // General
    period_length: Phenotypes.RangePeriod(1, 120, 'm'),
    min_periods: Phenotypes.Range(10, 300),
    max_slippage_pct: Phenotypes.Range(0.1, 1.0, 0.1),
    keep_lookback_periods: Phenotypes.Range(100, 1000, 100),
    
    // Technical indicators
    rsi_periods: Phenotypes.Range(10, 30),
    oversold_rsi: Phenotypes.Range(20, 40),
    overbought_rsi: Phenotypes.Range(60, 80),
    ema_short_period: Phenotypes.Range(8, 20),
    ema_long_period: Phenotypes.Range(20, 40),
    signal_period: Phenotypes.Range(6, 15),
    bollinger_size: Phenotypes.Range(1.5, 3.0, 0.1),
    bollinger_period: Phenotypes.Range(10, 30),
    
    // ML model
    prediction_horizon: Phenotypes.Range(1, 10),
    confidence_threshold: Phenotypes.Range(0.5, 0.9, 0.05),
    
    // Risk management
    stop_loss_pct: Phenotypes.Range(0.5, 5, 0.5),
    profit_target_pct: Phenotypes.Range(1, 10, 0.5),
    trailing_stop_pct: Phenotypes.Range(0.5, 3, 0.1),
    max_position_size: Phenotypes.Range(5, 30, 5)
  }
}
