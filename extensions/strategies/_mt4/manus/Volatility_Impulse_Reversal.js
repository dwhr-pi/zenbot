// Zenbot Strategy: Volatility Impulse Reversal (Based on SkyUp EA.mq4)

module.exports = {
  name: 'volatility_impulse_reversal',
  description: 'A mean-reversion strategy that enters a trade when a single candle shows extreme volatility compared to the average, betting on a reversal.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 100);
    this.option('avg_bars', 'number of bars to calculate average candle size', 100); // HowBar
    this.option('exp_factor', 'multiplier for the average bar size to trigger a signal', 4.1); // ExpBar
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.avg_bars) {
      return;
    }

    // Calculate average candle size (High - Low)
    let total_size = 0;
    for (let i = 0; i < s.options.avg_bars; i++) {
      total_size += Math.abs(s.lookback[i].high - s.lookback[i].low);
    }
    s.period.avg_candle_size = total_size / s.options.avg_bars;
  },

  onPeriod: function (s, cb) {
    if (!s.period.avg_candle_size) {
      return cb();
    }

    let current_open = s.period.open;
    let current_close = s.period.close;
    let impulse = Math.abs(current_close - current_open);
    let threshold = s.period.avg_candle_size * s.options.exp_factor;

    // Signal Logic (Anticyclical / Mean Reversion)
    // Buy Signal: Large bearish candle (Open > Close) exceeds threshold
    if (current_open > current_close && impulse > threshold) {
      s.signal = 'buy';
    }
    // Sell Signal: Large bullish candle (Close > Open) exceeds threshold
    else if (current_close > current_open && impulse > threshold) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('Avg Size: ' + (s.period.avg_candle_size ? s.period.avg_candle_size.toFixed(2) : 'N/A'));
    return cols;
  }
};
