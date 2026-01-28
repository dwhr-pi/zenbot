// Zenbot Strategy: Dual EMA Scalper (Based on EA17-Scalping Grid.mq4)

module.exports = {
  name: 'dual_ema_scalper',
  description: 'A high-frequency scalping strategy that uses a fast EMA for signals and a slow EMA for trend filtering. It aims for small, quick profits in the direction of the main trend.',

  getOptions: function () {
    this.option('period', 'period length', '5m');
    this.option('min_periods', 'min. number of history periods', 200);
    this.option('ema_signal', 'period for the fast signal EMA', 15); // EMA_Signal
    this.option('ema_trend', 'period for the slow trend EMA', 200); // EMA_Trend
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate Fast Signal EMA
    s.period.ema_signal = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_signal);

    // Calculate Slow Trend EMA
    s.period.ema_trend = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_trend);
  },

  onPeriod: function (s, cb) {
    if (!s.period.ema_signal || !s.period.ema_trend) {
      return cb();
    }

    let current_price = s.period.close;
    let ema_s = s.period.ema_signal;
    let ema_t = s.period.ema_trend;

    // Signal Logic
    // Buy Signal: Price is above Trend EMA AND Price crosses above Signal EMA
    if (current_price > ema_t && current_price > ema_s && s.lookback[0].close <= s.lookback[0].ema_signal) {
      s.signal = 'buy';
    }
    // Sell Signal: Price is below Trend EMA AND Price crosses below Signal EMA
    else if (current_price < ema_t && current_price < ema_s && s.lookback[0].close >= s.lookback[0].ema_signal) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('Sig EMA: ' + (s.period.ema_signal ? s.period.ema_signal.toFixed(2) : 'N/A'));
    cols.push('Trd EMA: ' + (s.period.ema_trend ? s.period.ema_trend.toFixed(2) : 'N/A'));
    return cols;
  }
};
