// Zenbot Strategy: Triple Confirmation (Based on Super-arrow-indicator.mq4 idea)

module.exports = {
  name: 'triple_confirmation',
  description: 'A highly filtered trend-following strategy that requires confirmation from three indicators: EMA Crossover (Trend), RSI Crossover (Momentum), and Bollinger Bands (Volatility/Reversal).',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 30);
    this.option('ema_fast', 'periods for the faster EMA', 5); // FasterMovingAverage
    this.option('ema_slow', 'periods for the slower EMA', 12); // SlowerMovingAverage
    this.option('rsi_periods', 'periods for RSI', 12); // RSIPeriod
    this.option('bb_periods', 'periods for Bollinger Bands', 10); // BollingerbandsPeriod
    this.option('bb_devs', 'standard deviations for Bollinger Bands', 0.5); // BollingerbandsDeviation
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate EMAs
    s.period.ema_fast = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_fast);
    s.period.ema_slow = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_slow);

    // Calculate RSI
    s.tools.rsi(s, 'rsi', s.options.rsi_periods);

    // Calculate Bollinger Bands
    s.tools.bb(s, 'bb', s.options.bb_periods, s.options.bb_devs);
  },

  onPeriod: function (s, cb) {
    if (!s.period.ema_fast || !s.period.ema_slow || !s.period.rsi || !s.period.bb || s.lookback.length < 1) {
      return cb();
    }

    let fast = s.period.ema_fast;
    let slow = s.period.ema_slow;
    let fast_prev = s.lookback[0].ema_fast;
    let slow_prev = s.lookback[0].ema_slow;
    let rsi = s.period.rsi;
    let rsi_prev = s.lookback[0].rsi;
    let close = s.period.close;
    let bb_upper = s.period.bb.upper;
    let bb_lower = s.period.bb.lower;

    // 1. EMA Crossover (Trend Confirmation)
    let is_ema_buy = fast > slow && fast_prev <= slow_prev;
    let is_ema_sell = fast < slow && fast_prev >= slow_prev;

    // 2. RSI Crossover (Momentum Confirmation)
    let is_rsi_buy = rsi > 50 && rsi_prev <= 50;
    let is_rsi_sell = rsi < 50 && rsi_prev >= 50;

    // 3. Bollinger Band Filter (Volatility/Reversal Confirmation)
    // Buy signal is stronger if price is near or below the lower band (oversold)
    let is_bb_buy_filter = close <= bb_lower;
    // Sell signal is stronger if price is near or above the upper band (overbought)
    let is_bb_sell_filter = close >= bb_upper;

    // Combined Buy Signal: All three conditions must be met
    if (is_ema_buy && is_rsi_buy && is_bb_buy_filter) {
      s.signal = 'buy';
    }
    // Combined Sell Signal: All three conditions must be met
    else if (is_ema_sell && is_rsi_sell && is_bb_sell_filter) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('EMA Crossover: ' + (s.period.ema_fast > s.period.ema_slow ? 'UP' : 'DOWN'));
    cols.push('RSI: ' + (s.period.rsi ? s.period.rsi.toFixed(2) : 'N/A'));
    cols.push('BB Filter: ' + (s.period.close >= s.period.bb.upper ? 'OVERBOUGHT' : s.period.close <= s.period.bb.lower ? 'OVERSOLD' : 'NEUTRAL'));
    return cols;
  }
};
