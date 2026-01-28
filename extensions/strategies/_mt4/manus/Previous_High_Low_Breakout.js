// Zenbot Strategy: Previous High/Low Breakout (Based on Price Action and MM idea from MT4 script)

module.exports = {
  name: 'prev_high_low_breakout',
  description: 'A simple Price Action strategy that enters a trade when the current price breaks the high or low of the previous N candles. The strategy is designed to be used with Zenbots native profit_target and stop_loss options, simulating the MT4 scripts Money Management.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 2);
    this.option('breakout_periods', 'number of previous candles to check for high/low', 1);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
    this.option('profit_target', 'Zenbot native option for profit taking (e.g., 0.5 for 0.5% profit)', 0.5);
    this.option('stop_loss', 'Zenbot native option for stop loss (e.g., 0.2 for 0.2% loss)', 0.2);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < s.options.breakout_periods) {
      return cb();
    }

    let current_close = s.period.close;
    let breakout_periods = s.options.breakout_periods;
    let lookback_slice = s.lookback.slice(0, breakout_periods);

    // Find the highest high and lowest low in the lookback period
    let highest_high = 0;
    let lowest_low = Infinity;

    lookback_slice.forEach(period => {
      if (period.high > highest_high) {
        highest_high = period.high;
      }
      if (period.low < lowest_low) {
        lowest_low = period.low;
      }
    });

    // Buy Signal: Current price breaks above the highest high of the last N candles
    if (current_close > highest_high) {
      s.signal = 'buy';
    }
    // Sell Signal: Current price breaks below the lowest low of the last N candles
    else if (current_close < lowest_low) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('Breakout Periods: ' + s.options.breakout_periods);
    cols.push('Highest High: ' + (s.lookback.length > 0 ? s.lookback.slice(0, s.options.breakout_periods).reduce((max, p) => Math.max(max, p.high), 0).toFixed(2) : 'N/A'));
    cols.push('Lowest Low: ' + (s.lookback.length > 0 ? s.lookback.slice(0, s.options.breakout_periods).reduce((min, p) => Math.min(min, p.low), Infinity).toFixed(2) : 'N/A'));
    return cols;
  }
};
