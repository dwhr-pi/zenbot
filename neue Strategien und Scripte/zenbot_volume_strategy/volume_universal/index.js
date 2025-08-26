var z = require('zero-fill')
var n = require('numbro')
var rsi = require('../../../lib/rsi')
var ema = require('../../../lib/ema')
var vwap = require('../../../lib/vwap')
var Phenotypes = require('../../../lib/phenotype')

module.exports = {
  name: 'volume_universal',
  description: 'Universal volume-based trading strategy for all currencies. Analyzes volume patterns, price-volume divergence, and relative volume to identify potential entry and exit points.',

  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '30m')
    this.option('period_length', 'period length, same as --period', String, '30m')
    this.option('min_periods', 'min. number of history periods', Number, 52)
    this.option('rsi_periods', 'number of RSI periods', Number, 14)
    this.option('oversold_rsi', 'buy when RSI reaches or drops below this value', Number, 30)
    this.option('overbought_rsi', 'sell when RSI reaches or goes above this value', Number, 70)
    this.option('ema_short', 'number of periods for the shorter EMA', Number, 5)
    this.option('ema_long', 'number of periods for the longer EMA', Number, 20)
    this.option('signal_length', 'signal periods length', Number, 9)
    this.option('up_trend_threshold', 'threshold to trigger a buy signal', Number, 0)
    this.option('down_trend_threshold', 'threshold to trigger a sell signal', Number, 0)
    this.option('volume_threshold', 'minimum volume threshold as a multiplier of average volume', Number, 1.5)
    this.option('volume_persistence', 'number of periods to check for persistent volume', Number, 3)
    this.option('price_volume_threshold', 'threshold for price-volume divergence', Number, 0.3)
    this.option('vwap_length', 'length of VWAP calculation', Number, 20)
    this.option('profit_stop_enable', 'enable trailing profit stop', Boolean, true)
    this.option('profit_stop_percent', 'profit stop percentage', Number, 1.0)
  },

  calculate: function (s) {
    // Calculate RSI
    rsi(s, 'rsi', s.options.rsi_periods)
    
    // Calculate EMAs
    ema(s, 'ema_short', s.options.ema_short)
    ema(s, 'ema_long', s.options.ema_long)
    
    // Calculate VWAP
    vwap(s, 'vwap', s.options.vwap_length)
    
    // Calculate volume metrics
    if (s.lookback.length > s.options.min_periods) {
      // Calculate average volume over the last 20 periods
      let volumeSum = 0
      for (let i = 0; i < 20 && i < s.lookback.length; i++) {
        volumeSum += s.lookback[i].volume
      }
      s.period.avg_volume = volumeSum / Math.min(20, s.lookback.length)
      
      // Calculate volume ratio (current volume / average volume)
      s.period.volume_ratio = s.period.volume / s.period.avg_volume
      
      // Check for persistent volume increase
      let persistentVolume = true
      for (let i = 0; i < s.options.volume_persistence && i < s.lookback.length; i++) {
        if (s.lookback[i].volume < s.options.volume_threshold * s.period.avg_volume) {
          persistentVolume = false
          break
        }
      }
      s.period.persistent_volume = persistentVolume
      
      // Calculate price-volume divergence
      // Price going up but volume decreasing = bearish divergence
      // Price going down but volume increasing = bullish divergence
      let priceChange = (s.period.close - s.lookback[0].close) / s.lookback[0].close
      let volumeChange = (s.period.volume - s.lookback[0].volume) / s.lookback[0].volume
      
      s.period.price_volume_divergence = priceChange * -1 * volumeChange
      s.period.bullish_divergence = priceChange < 0 && volumeChange > 0 && 
                                   Math.abs(s.period.price_volume_divergence) > s.options.price_volume_threshold
      s.period.bearish_divergence = priceChange > 0 && volumeChange < 0 && 
                                   Math.abs(s.period.price_volume_divergence) > s.options.price_volume_threshold
    }
  },

  onPeriod: function (s, cb) {
    if (!s.period.avg_volume) {
      return cb()
    }
    
    // Buy signal conditions
    let buySignal = false
    if (
      s.period.rsi <= s.options.oversold_rsi && 
      s.period.ema_short > s.period.ema_long && 
      s.period.volume_ratio >= s.options.volume_threshold &&
      (s.period.persistent_volume || s.period.bullish_divergence) &&
      s.period.close > s.period.vwap
    ) {
      buySignal = true
    }
    
    // Sell signal conditions
    let sellSignal = false
    if (
      (s.period.rsi >= s.options.overbought_rsi || 
      s.period.ema_short < s.period.ema_long || 
      s.period.bearish_divergence) &&
      s.period.close < s.period.vwap
    ) {
      sellSignal = true
    }
    
    // Execute trading logic
    if (s.signal === 'buy' && sellSignal) {
      s.signal = 'sell'
    } else if (s.signal === 'sell' && buySignal) {
      s.signal = 'buy'
    } else if (s.signal === undefined) {
      if (buySignal) {
        s.signal = 'buy'
      } else if (sellSignal) {
        s.signal = 'sell'
      }
    }
    
    // Implement profit stop if enabled
    if (s.options.profit_stop_enable && s.period.close && s.signal !== 'buy' && s.signal !== 'sell') {
      let profitPercentage = 0
      if (s.position.side === 'long') {
        profitPercentage = (s.period.close - s.position.price) / s.position.price * 100
      } else if (s.position.side === 'short') {
        profitPercentage = (s.position.price - s.period.close) / s.position.price * 100
      }
      
      if (profitPercentage >= s.options.profit_stop_percent) {
        s.signal = 'sell'
      }
    }
    
    // Add custom logging
    if (s.period.volume_ratio && s.period.avg_volume) {
      s.period.volume_ratio_text = n(s.period.volume_ratio).format('0.00')
      s.period.avg_volume_text = n(s.period.avg_volume).format('0.00')
    }
    
    cb()
  },

  onReport: function (s) {
    var cols = []
    if (s.period.volume_ratio) {
      cols.push(' Vol Ratio: ' + s.period.volume_ratio_text)
    }
    if (s.period.avg_volume) {
      cols.push(' Avg Vol: ' + s.period.avg_volume_text)
    }
    if (s.period.rsi) {
      cols.push(' RSI: ' + n(s.period.rsi).format('0.00'))
    }
    if (s.period.vwap) {
      cols.push(' VWAP: ' + n(s.period.vwap).format('0.00'))
    }
    if (s.period.price_volume_divergence) {
      cols.push(' P/V Div: ' + n(s.period.price_volume_divergence).format('0.000'))
    }
    return cols
  },

  phenotypes: {
    period_length: Phenotypes.RangePeriod(5, 120, 'm'),
    min_periods: Phenotypes.Range(10, 100),
    rsi_periods: Phenotypes.Range(10, 30),
    oversold_rsi: Phenotypes.Range(20, 40),
    overbought_rsi: Phenotypes.Range(60, 80),
    ema_short: Phenotypes.Range(2, 12),
    ema_long: Phenotypes.Range(15, 40),
    signal_length: Phenotypes.Range(5, 15),
    up_trend_threshold: Phenotypes.Range(0, 50),
    down_trend_threshold: Phenotypes.Range(0, 50),
    volume_threshold: Phenotypes.Range(1, 5, 0.1),
    volume_persistence: Phenotypes.Range(1, 10),
    price_volume_threshold: Phenotypes.Range(0.1, 1.0, 0.1),
    vwap_length: Phenotypes.Range(10, 50),
    profit_stop_percent: Phenotypes.Range(0.5, 5, 0.5)
  }
}
