// Zenbot Strategy: RSI Zone Breakout (Based on OGT Zone Recovery EA v1.5.1.mq4)

module.exports = {
  name: 'rsi_zone_breakout',
  description: 'A strategy that uses RSI overbought/oversold levels and ATR-based volatility to identify high-probability reversal points. It simulates the entry logic of the Zone Recovery EA.',

  getOptions: function () {
    this.option('period', 'period length', '15m');
    this.option('min_periods', 'min. number of history periods', 50);
    this.option('rsi_periods', 'periods for RSI', 14); // RSIPeriod
    this.option('overbought', 'RSI overbought level', 70); // OverboughtLevel
    this.option('oversold', 'RSI oversold level', 30); // OversoldLevel
    this.option('atr_periods', 'periods for ATR', 14); // ATRPeriod
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate RSI
    s.tools.rsi(s, 'rsi', s.options.rsi_periods);

    // Calculate ATR for volatility filter
    s.tools.atr(s, 'atr', s.options.atr_periods);
  },

  onPeriod: function (s, cb) {
    if (!s.period.rsi || !s.period.atr || s.lookback.length < 1) {
      return cb();
    }

    let rsi = s.period.rsi;
    let rsi_prev = s.lookback[0].rsi;
    let overbought = s.options.overbought;
    let oversold = s.options.oversold;

    // Signal Logic: RSI crossing back from extreme zones
    // Buy Signal: RSI was below oversold and is now crossing above it
    if (rsi_prev <= oversold && rsi > oversold) {
      s.signal = 'buy';
    }
    // Sell Signal: RSI was above overbought and is now crossing below it
    else if (rsi_prev >= overbought && rsi < overbought) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('RSI: ' + (s.period.rsi ? s.period.rsi.toFixed(2) : 'N/A'));
    cols.push('ATR: ' + (s.period.atr ? s.period.atr.toFixed(4) : 'N/A'));
    return cols;
  }
};
