// Zenbot Strategy: Dual EMA Channel Breakout (Based on ProFx02.mq4 indicator logic)

module.exports = {
  name: 'dual_ema_channel_breakout',
  description: 'A trend-following strategy that uses two EMAs to define a channel and generates signals when the price breaks out of this channel in the direction of the trend.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 30);
    this.option('ema_short_periods', 'periods for the faster EMA', 15); // Based on g_period_80 = 15
    this.option('ema_long_periods', 'periods for the slower EMA (Channel Base)', 30);
    this.option('channel_width_factor', 'Factor to multiply the channel width (e.g., 0.001 for 0.1%)', 0.001);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate EMAs
    s.period.ema_short = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_short_periods);
    s.period.ema_long = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_long_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.ema_short || !s.period.ema_long) {
      return cb();
    }

    let short = s.period.ema_short;
    let long = s.period.ema_long;
    let price = s.period.close;

    // 1. Determine Trend Direction (EMA Crossover)
    let is_uptrend = short > long;
    let is_downtrend = short < long;

    // 2. Define Channel (using the slower EMA as the center and a factor for width)
    // The channel width is dynamically calculated based on the price and a factor
    let channel_width = price * s.options.channel_width_factor;
    let upper_channel = long + channel_width;
    let lower_channel = long - channel_width;

    // Buy Signal: Price breaks above the upper channel AND short EMA confirms uptrend
    if (price > upper_channel && is_uptrend) {
      s.signal = 'buy';
    }
    // Sell Signal: Price breaks below the lower channel AND short EMA confirms downtrend
    else if (price < lower_channel && is_downtrend) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('EMA Short: ' + (s.period.ema_short ? s.period.ema_short.toFixed(2) : 'N/A'));
    cols.push('EMA Long: ' + (s.period.ema_long ? s.period.ema_long.toFixed(2) : 'N/A'));
    return cols;
  }
};
