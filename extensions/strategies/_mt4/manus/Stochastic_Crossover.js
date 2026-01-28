// Zenbot Strategy: Stochastic Crossover (Based on Stochastic divergence_mtfalerts.mq4)

module.exports = {
  name: 'stochastic_crossover',
  description: 'A strategy based on the Stochastic Oscillator, trading on the crossover of %K and %D lines, confirmed by overbought/oversold zones.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 14);
    this.option('stoch_k_periods', 'periods for %K (StoKPeriod)', 14);
    this.option('stoch_d_periods', 'periods for %D (StoDPeriod)', 3);
    this.option('stoch_slowing', 'slowing period (StoSlowing)', 3);
    this.option('stoch_buy_level', 'Stochastic level to trigger buy signal (oversold)', 20);
    this.option('stoch_sell_level', 'Stochastic level to trigger sell signal (overbought)', 80);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate Stochastic Oscillator
    s.tools.stoch(s, 'stoch', s.options.stoch_k_periods, s.options.stoch_d_periods, s.options.stoch_slowing);
  },

  onPeriod: function (s, cb) {
    if (!s.period.stoch_k || !s.period.stoch_d || s.lookback.length < 1) {
      return cb();
    }

    let k = s.period.stoch_k;
    let d = s.period.stoch_d;
    let k_prev = s.lookback[0].stoch_k;
    let d_prev = s.lookback[0].stoch_d;

    // Buy Signal: %K crosses above %D AND is in the oversold zone
    let is_buy_crossover = k > d && k_prev <= d_prev;
    let is_oversold = k < s.options.stoch_buy_level;

    // Sell Signal: %K crosses below %D AND is in the overbought zone
    let is_sell_crossover = k < d && k_prev >= d_prev;
    let is_overbought = k > s.options.stoch_sell_level;

    if (is_buy_crossover && is_oversold) {
      s.signal = 'buy';
    } else if (is_sell_crossover && is_overbought) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('%K: ' + (s.period.stoch_k ? s.period.stoch_k.toFixed(2) : 'N/A'));
    cols.push('%D: ' + (s.period.stoch_d ? s.period.stoch_d.toFixed(2) : 'N/A'));
    return cols;
  }
};
