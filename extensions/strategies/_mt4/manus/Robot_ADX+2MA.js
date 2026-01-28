// Zenbot Strategy: ADX-EMA Crossover (Based on Robot_ADX+2MA.mq4)

module.exports = {
  name: 'adx_ema_crossover',
  description: 'A trend-following strategy using two Exponential Moving Averages (EMA) and the Average Directional Index (ADX) for confirmation.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 52);
    this.option('adx_periods', 'periods for ADX', 6);
    this.option('ema_short_periods', 'periods for short EMA', 5);
    this.option('ema_long_periods', 'periods for long EMA', 12);
    this.option('adx_threshold', 'ADX value to confirm trend strength', 20);
    this.option('di_threshold', 'Difference between +DI and -DI to confirm direction', 5);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    // Ensure we have enough data
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate EMAs
    s.period.ema_short = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_short_periods);
    s.period.ema_long = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_long_periods);

    // Calculate ADX, +DI, -DI
    s.tools.adx(s.lookback, s.period, s.options.adx_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.ema_short || !s.period.ema_long || !s.period.adx) {
      return cb();
    }

    let is_long_trend = s.period.ema_short > s.period.ema_long;
    let is_short_trend = s.period.ema_short < s.period.ema_long;
    let is_strong_trend = s.period.adx > s.options.adx_threshold;

    // Buy signal: Short EMA crosses above Long EMA AND ADX confirms a strong trend
    if (is_long_trend && is_strong_trend && s.period['+di'] > s.period['-di'] + s.options.di_threshold) {
      s.signal = 'buy';
    }
    // Sell signal: Short EMA crosses below Long EMA AND ADX confirms a strong trend
    else if (is_short_trend && is_strong_trend && s.period['-di'] > s.period['+di'] + s.options.di_threshold) {
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
    cols.push('ADX: ' + (s.period.adx ? s.period.adx.toFixed(2) : 'N/A'));
    cols.push('+DI: ' + (s.period['+di'] ? s.period['+di'].toFixed(2) : 'N/A'));
    cols.push('-DI: ' + (s.period['-di'] ? s.period['-di'].toFixed(2) : 'N/A'));
    return cols;
  }
};
