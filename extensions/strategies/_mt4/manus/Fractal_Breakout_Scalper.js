// Zenbot Strategy: Fractal Breakout Scalper (Based on RoyalPrince_Scalper.mq5)

module.exports = {
  name: 'fractal_breakout_scalper',
  description: 'A scalping strategy that identifies local highs and lows (fractals) and enters a trade when the price breaks out of these levels. It uses a short-term trend filter and is designed for fast execution.',

  getOptions: function () {
    this.option('period', 'period length', '15m');
    this.option('min_periods', 'min. number of history periods', 50);
    this.option('fractal_periods', 'number of candles to identify a fractal (BarsN)', 5);
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < s.options.fractal_periods * 2 + 1) {
      return cb();
    }

    let n = s.options.fractal_periods;
    let current_price = s.period.close;

    // Function to check if a candle at index 'i' is a fractal high
    const isFractalHigh = (index) => {
      let high = s.lookback[index].high;
      for (let j = index - n; j <= index + n; j++) {
        if (j === index || j < 0 || j >= s.lookback.length) continue;
        if (s.lookback[j].high > high) return false;
      }
      return true;
    };

    // Function to check if a candle at index 'i' is a fractal low
    const isFractalLow = (index) => {
      let low = s.lookback[index].low;
      for (let j = index - n; j <= index + n; j++) {
        if (j === index || j < 0 || j >= s.lookback.length) continue;
        if (s.lookback[j].low < low) return false;
      }
      return true;
    };

    // Find the most recent fractal high and low
    let last_fractal_high = null;
    let last_fractal_low = null;

    for (let i = 0; i < s.lookback.length - n; i++) {
      if (last_fractal_high === null && isFractalHigh(i)) {
        last_fractal_high = s.lookback[i].high;
      }
      if (last_fractal_low === null && isFractalLow(i)) {
        last_fractal_low = s.lookback[i].low;
      }
      if (last_fractal_high !== null && last_fractal_low !== null) break;
    }

    // Buy Signal: Price breaks above the last fractal high
    if (last_fractal_high !== null && current_price > last_fractal_high) {
      s.signal = 'buy';
    }
    // Sell Signal: Price breaks below the last fractal low
    else if (last_fractal_low !== null && current_price < last_fractal_low) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('Fractal N: ' + s.options.fractal_periods);
    return cols;
  }
};
