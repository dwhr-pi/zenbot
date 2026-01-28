// Zenbot Strategy: Volatility Breakout (Based on forex cash cow - mm.mq4)

module.exports = {
  name: 'volatility_breakout',
  description: 'A trend-following strategy that enters a trade after a significant volatility expansion (breakout) in the previous candle, confirmed by a short-term EMA trend.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 20);
    this.option('volatility_threshold', 'Minimum percentage change in candle range (High-Low) to trigger a signal', 0.5); // 0.5% as a starting point
    this.option('ema_periods', 'periods for EMA trend confirmation', 10);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate EMA for trend confirmation
    s.period.ema = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.ema || s.lookback.length < 1) {
      return cb();
    }

    let current = s.period;
    let previous = s.lookback[0];

    // 1. Calculate Volatility (Range of the previous candle)
    let range = previous.high - previous.low;
    let midpoint = (previous.high + previous.low) / 2;
    let volatility_pct = (range / midpoint) * 100;

    // 2. Check for Volatility Breakout
    let is_breakout = volatility_pct >= s.options.volatility_threshold;

    // 3. Determine Direction (based on previous candle close relative to open)
    let is_bullish_explosion = previous.close > previous.open;
    let is_bearish_explosion = previous.close < previous.open;

    // 4. Trend Confirmation (EMA)
    let is_uptrend = current.close > current.ema;
    let is_downtrend = current.close < current.ema;

    // Buy Signal: Volatility Breakout (Bullish) AND Price is above EMA
    if (is_breakout && is_bullish_explosion && is_uptrend) {
      s.signal = 'buy';
    }
    // Sell Signal: Volatility Breakout (Bearish) AND Price is below EMA
    else if (is_breakout && is_bearish_explosion && is_downtrend) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('EMA: ' + (s.period.ema ? s.period.ema.toFixed(2) : 'N/A'));
    return cols;
  }
};
