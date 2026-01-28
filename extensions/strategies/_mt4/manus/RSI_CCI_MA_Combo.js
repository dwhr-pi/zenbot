// Zenbot Strategy: RSI/CCI/MA Combo (Based on RSI&CCI DIVERGENCE V1.mq4)

module.exports = {
  name: 'rsi_cci_ma_combo',
  description: 'A multi-indicator strategy combining RSI, CCI, and a fast/slow Moving Average Crossover for trend confirmation and overbought/oversold conditions.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 85); // Based on SlowMA period
    this.option('rsi_periods', 'periods for RSI', 14);
    this.option('cci_periods', 'periods for CCI', 14);
    this.option('rsi_buy_level', 'RSI level to trigger buy signal (oversold)', 30);
    this.option('rsi_sell_level', 'RSI level to trigger sell signal (overbought)', 70);
    this.option('cci_buy_level', 'CCI level to trigger buy signal (oversold)', -100);
    this.option('cci_sell_level', 'CCI level to trigger sell signal (overbought)', 100);
    this.option('ma_fast_periods', 'periods for fast MA (LWMA in original)', 6);
    this.option('ma_slow_periods', 'periods for slow MA (LWMA in original)', 85);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate RSI
    s.tools.rsi(s, 'rsi', s.options.rsi_periods);

    // Calculate CCI
    s.tools.cci(s, 'cci', s.options.cci_periods);

    // Calculate Moving Averages (Zenbot uses EMA by default, which is a good proxy for LWMA in this context)
    s.period.ma_fast = s.tools.ma(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ma_fast_periods);
    s.period.ma_slow = s.tools.ma(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ma_slow_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.rsi || !s.period.cci || !s.period.ma_fast || !s.period.ma_slow) {
      return cb();
    }

    let is_oversold = s.period.rsi < s.options.rsi_buy_level && s.period.cci < s.options.cci_buy_level;
    let is_overbought = s.period.rsi > s.options.rsi_sell_level && s.period.cci > s.options.cci_sell_level;
    let is_uptrend = s.period.ma_fast > s.period.ma_slow;
    let is_downtrend = s.period.ma_fast < s.period.ma_slow;

    // Buy Signal: Oversold condition AND Uptrend confirmation
    if (is_oversold && is_uptrend) {
      s.signal = 'buy';
    }
    // Sell Signal: Overbought condition AND Downtrend confirmation
    else if (is_overbought && is_downtrend) {
      s.signal = 'sell';
    } else {
      s.signal = null; // Hold
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('RSI: ' + (s.period.rsi ? s.period.rsi.toFixed(2) : 'N/A'));
    cols.push('CCI: ' + (s.period.cci ? s.period.cci.toFixed(2) : 'N/A'));
    cols.push('MA Fast: ' + (s.period.ma_fast ? s.period.ma_fast.toFixed(2) : 'N/A'));
    cols.push('MA Slow: ' + (s.period.ma_slow ? s.period.ma_slow.toFixed(2) : 'N/A'));
    return cols;
  }
};
