// Zenbot Strategy: Engulfing Candlestick Pattern (Based on engulfing EA.mq4)

module.exports = {
  name: 'engulfing_candlestick',
  description: 'A strategy that trades based on the Bullish and Bearish Engulfing Candlestick patterns.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 2);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    // We need at least 2 periods (current and previous)
    if (s.lookback.length < s.options.min_periods - 1) {
      return;
    }
  },

  onPeriod: function (s, cb) {
    // Current bar is s.period, previous bar is s.lookback[0]
    let current = s.period;
    let previous = s.lookback[0];

    // Bullish Engulfing Pattern (Buy Signal)
    // 1. Current bar is bullish (close > open)
    // 2. Previous bar is bearish (close < open)
    // 3. Current bar's body/range engulfs the previous bar's body/range
    let is_bullish_engulfing =
      current.close > current.open &&
      previous.close < previous.open &&
      current.low < previous.low &&
      current.high > previous.high;

    // Bearish Engulfing Pattern (Sell Signal)
    // 1. Current bar is bearish (close < open)
    // 2. Previous bar is bullish (close > open)
    // 3. Current bar's body/range engulfs the previous bar's body/range
    let is_bearish_engulfing =
      current.close < current.open &&
      previous.close > previous.open &&
      current.low < previous.low &&
      current.high > previous.high;

    if (is_bullish_engulfing) {
      s.signal = 'buy';
    } else if (is_bearish_engulfing) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    return [];
  }
};
