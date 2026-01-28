// Zenbot Strategy: Night Scalper (Based on Pirate.mq4)

module.exports = {
  name: 'night_scalper',
  description: 'A mean-reversion scalping strategy designed for low-volatility periods (like the Asian session), using Bollinger Bands to identify entry points in a sideways market.',

  getOptions: function () {
    this.option('period', 'period length', '15m');
    this.option('min_periods', 'min. number of history periods', 50);
    this.option('bollinger_size', 'period for Bollinger Bands', 20);
    this.option('bollinger_updev', 'upper deviation for Bollinger Bands', 2);
    this.option('bollinger_dndev', 'lower deviation for Bollinger Bands', 2);
    this.option('start_hour', 'start hour for trading (UTC)', 0); // StartHour
    this.option('end_hour', 'end hour for trading (UTC)', 2); // StopHour (extended slightly for crypto)
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.bollinger_size) {
      return;
    }

    // Calculate Bollinger Bands
    s.tools.bollinger(s, 'bollinger', s.options.bollinger_size, s.options.bollinger_updev, s.options.bollinger_dndev);
  },

  onPeriod: function (s, cb) {
    if (!s.period.bollinger) {
      return cb();
    }

    let current_hour = new Date(s.period.time).getUTCHours();
    let in_time_window = false;

    if (s.options.start_hour <= s.options.end_hour) {
      in_time_window = current_hour >= s.options.start_hour && current_hour < s.options.end_hour;
    } else {
      // Handles overnight window (e.g., 23:00 to 02:00)
      in_time_window = current_hour >= s.options.start_hour || current_hour < s.options.end_hour;
    }

    if (!in_time_window) {
      s.signal = null;
      return cb();
    }

    let price = s.period.close;
    let upper = s.period.bollinger.upper;
    let lower = s.period.bollinger.lower;

    // Signal Logic (Mean Reversion)
    // Buy Signal: Price touches or crosses below the lower Bollinger Band
    if (price <= lower) {
      s.signal = 'buy';
    }
    // Sell Signal: Price touches or crosses above the upper Bollinger Band
    else if (price >= upper) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    if (s.period.bollinger) {
      cols.push('Upper: ' + s.period.bollinger.upper.toFixed(2));
      cols.push('Lower: ' + s.period.bollinger.lower.toFixed(2));
    }
    return cols;
  }
};
