// Zenbot Strategy: Super Signal Reversal (Based on Super Signal v3.mq4)

module.exports = {
  name: 'super_signal_reversal',
  description: 'A reversal strategy that identifies price extremes over two different time windows. It signals a potential trend reversal when the price hits a new high or low in these windows.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 30);
    this.option('dist1', 'short window for extreme detection', 14);
    this.option('dist2', 'long window for extreme detection', 21);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < Math.max(s.options.dist1, s.options.dist2)) {
      return cb();
    }

    let current_high = s.period.high;
    let current_low = s.period.low;
    let dist1 = s.options.dist1;
    let dist2 = s.options.dist2;

    // Find extremes in lookback for dist1
    let hhb1 = 0, llb1 = Infinity;
    for (let i = 0; i < dist1; i++) {
      if (s.lookback[i].high > hhb1) hhb1 = s.lookback[i].high;
      if (s.lookback[i].low < llb1) llb1 = s.lookback[i].low;
    }

    // Find extremes in lookback for dist2
    let hhb2 = 0, llb2 = Infinity;
    for (let i = 0; i < dist2; i++) {
      if (s.lookback[i].high > hhb2) hhb2 = s.lookback[i].high;
      if (s.lookback[i].low < llb2) llb2 = s.lookback[i].low;
    }

    // Signal Logic
    // Sell if price hits a new high in the long window (dist2)
    if (current_high >= hhb2) {
      s.signal = 'sell';
    }
    // Buy if price hits a new low in the long window (dist2)
    else if (current_low <= llb2) {
      s.signal = 'buy';
    }
    // Minor signals from dist1 could be added, but for Zenbot we focus on the stronger dist2 signals
    else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('Dist1: ' + s.options.dist1 + ' Dist2: ' + s.options.dist2);
    return cols;
  }
};
