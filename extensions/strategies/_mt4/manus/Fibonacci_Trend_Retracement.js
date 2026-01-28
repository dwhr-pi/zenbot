// Zenbot Strategy: Fibonacci Trend Retracement (Based on EA RoboFibo v.11.2.mq4)

module.exports = {
  name: 'fibo_trend_retracement',
  description: 'A strategy that uses Fibonacci Retracement levels to identify entry points during pullbacks in an established trend. It uses EMA for trend detection and RSI for momentum filtering.',

  getOptions: function () {
    this.option('period', 'period length', '1h');
    this.option('min_periods', 'min. number of history periods', 100);
    this.option('bars_back', 'number of candles to calculate Fibonacci levels', 20); // BarsBack
    this.option('ema_period', 'period for trend EMA', 60); // maperiod
    this.option('rsi_period', 'period for RSI filter', 14); // RSIPeriod
    this.option('fibo_low', 'low Fibonacci level for entry (e.g., 23.6)', 23.6); // LowFibo
    this.option('fibo_high', 'high Fibonacci level for entry (e.g., 76.4)', 76.4); // HighFibo
    this.option('buy_pct', 'buy with this % of capital', 100);
    this.option('sell_pct', 'sell with this % of capital', 100);
  },

  calculate: function (s) {
    if (s.lookback.length < s.options.min_periods) {
      return;
    }

    // Calculate EMA for trend
    s.period.ema = s.tools.ema(s.lookback.slice(0, 1).concat([s.period]), 'close', s.options.ema_period);

    // Calculate RSI for momentum
    s.tools.rsi(s, 'rsi', s.options.rsi_period);
  },

  onPeriod: function (s, cb) {
    if (s.lookback.length < s.options.bars_back) {
      return cb();
    }

    let current_price = s.period.close;
    let ema = s.period.ema;
    let rsi = s.period.rsi;
    let bars_back = s.options.bars_back;

    // Find High and Low of the last N bars
    let lookback_slice = s.lookback.slice(0, bars_back);
    let high = Math.max(...lookback_slice.map(p => p.high));
    let low = Math.min(...lookback_slice.map(p => p.low));
    let range = high - low;

    if (range === 0) return cb();

    // Calculate Fibonacci Levels
    let fibo_236 = low + (range * 0.236);
    let fibo_382 = low + (range * 0.382);
    let fibo_500 = low + (range * 0.500);
    let fibo_618 = low + (range * 0.618);
    let fibo_764 = low + (range * 0.764);

    // Trend Direction
    let is_uptrend = current_price > ema;
    let is_downtrend = current_price < ema;

    // Signal Logic
    // Buy Signal: Uptrend + Price retraces to a Fibonacci level (e.g., 23.6% or 38.2%)
    if (is_uptrend && current_price <= fibo_382 && current_price >= low && rsi < 60) {
      s.signal = 'buy';
    }
    // Sell Signal: Downtrend + Price retraces to a Fibonacci level (e.g., 76.4% or 61.8%)
    else if (is_downtrend && current_price >= fibo_618 && current_price <= high && rsi > 40) {
      s.signal = 'sell';
    } else {
      s.signal = null;
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    cols.push('EMA: ' + (s.period.ema ? s.period.ema.toFixed(2) : 'N/A'));
    cols.push('RSI: ' + (s.period.rsi ? s.period.rsi.toFixed(2) : 'N/A'));
    return cols;
  }
};
