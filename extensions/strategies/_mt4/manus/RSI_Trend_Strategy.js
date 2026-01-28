// Zenbot Strategy: RSI Trend Strategy (Based on CM_Strength_TF_M_V1.0.mq4 idea)

module.exports = {
  name: 'rsi_trend_strategy',
  description: 'A strategy that uses RSI as a measure of relative strength and a simple EMA for trend filtering. Trades are taken when RSI crosses a center line (e.g., 50) in the direction of the EMA trend.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 30);
    this.option('rsi_periods', 'periods for RSI', 14);
    this.option('ema_periods', 'periods for EMA trend filter', 50);
    this.option('rsi_center_line', 'RSI level to cross for signal', 50);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate RSI
    s.tools.rsi(s, 'rsi', s.options.rsi_periods);

    // Calculate EMA for trend filter
    s.period.ema = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.rsi || !s.period.ema || s.lookback.length < 1) {
      return cb();
    }

    let rsi = s.period.rsi;
    let rsi_prev = s.lookback[0].rsi;
    let ema = s.period.ema;
    let price = s.period.close;
    let center = s.options.rsi_center_line;

    // 1. Trend Filter (Price relative to EMA)
    let is_uptrend = price > ema;
    let is_downtrend = price < ema;

    // 2. RSI Crossover Signal
    let is_rsi_buy_crossover = rsi > center && rsi_prev <= center;
    let is_rsi_sell_crossover = rsi < center && rsi_prev >= center;

    // Buy Signal: RSI crosses above center line AND price is in an uptrend
    if (is_rsi_buy_crossover && is_uptrend) {
      s.signal = 'buy';
    }
    // Sell Signal: RSI crosses below center line AND price is in a downtrend
    else if (is_rsi_sell_crossover && is_downtrend) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('RSI: ' + (s.period.rsi ? s.period.rsi.toFixed(2) : 'N/A'));
    cols.push('EMA: ' + (s.period.ema ? s.period.ema.toFixed(2) : 'N/A'));
    return cols;
  }
};
