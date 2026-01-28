// Zenbot Strategy: Impulse Trend Follower (Based on NAS KILLER_PRO_EA 3.0.mq4)

module.exports = {
  name: 'impulse_trend_follower',
  description: 'A strategy that enters a trade after a series of consecutive candles in the same direction with a minimum body size, capturing strong market impulses.',

  getOptions: function () {
    this.option('period', 'period length', '15m');
    this.option('min_periods', 'min. number of history periods', 10);
    this.option('row_size', 'number of consecutive candles in the same direction', 2); // inp2_RowSize / inp3_RowSize
    this.option('min_body_size', 'minimum body size as percentage of price', 0.05); // inp2_MinBodySize (adapted for crypto/percentage)
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    // No complex indicators needed for this price-action strategy
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < s.options.row_size) {
      return cb();
    }

    let row_size = s.options.row_size;
    let min_body_pct = s.options.min_body_size / 100;
    
    let consecutive_bullish = 0;
    let consecutive_bearish = 0;

    // Check current candle and lookback candles
    let candles = [s.period].concat(s.lookback.slice(0, row_size - 1));

    for (let i = 0; i < row_size; i++) {
      let candle = candles[i];
      let body_size = Math.abs(candle.close - candle.open);
      let body_pct = body_size / candle.open;

      if (candle.close > candle.open && body_pct >= min_body_pct) {
        consecutive_bullish++;
      } else if (candle.close < candle.open && body_pct >= min_body_pct) {
        consecutive_bearish++;
      }
    }

    // Signal Logic
    if (consecutive_bullish === row_size) {
      s.signal = 'buy';
    } else if (consecutive_bearish === row_size) {
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
