// Zenbot Strategy: Extreme High/Low Reversal (Based on super_signal.mq4)

module.exports = {
  name: 'extreme_high_low_reversal',
  description: 'A reversal strategy that enters a trade when the price reaches a new high or low within a specific lookback window, anticipating a trend exhaustion.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 50);
    this.option('window_size', 'number of candles to look back for high/low', 24); // Gi_84
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    // No complex indicators needed, we use raw price data
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < s.options.window_size) {
      return cb();
    }

    let window_size = s.options.window_size;
    let current_high = s.period.high;
    let current_low = s.period.low;

    let is_highest = true;
    let is_lowest = true;

    // Check if current high/low is the extreme in the window
    for (let i = 0; i < window_size; i++) {
      if (s.lookback[i].high > current_high) {
        is_highest = false;
      }
      if (s.lookback[i].low < current_low) {
        is_lowest = false;
      }
    }

    // Signal Logic (Reversal)
    // Buy Signal: Current candle is the lowest in the window (anticipating upward reversal)
    if (is_lowest) {
      s.signal = 'buy';
    }
    // Sell Signal: Current candle is the highest in the window (anticipating downward reversal)
    else if (is_highest) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    return cols;
  }
};
