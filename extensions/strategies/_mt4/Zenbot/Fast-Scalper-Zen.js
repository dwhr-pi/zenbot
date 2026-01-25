module.exports = function container (get, set, clear) {
  var c = get('constants')
  var z = get('utils')
  var ta = get('ta')

  var strategy = {
    name: 'fast-scalper-zen',
    description: 'Adaptierte Version des MT4 Fast Scalper EA. Nutzt eine Breakout-Logik basierend auf der vorherigen Kerze.',

    getOptions: function () {
      this.option('period', 'period length', String, '1m')
      this.option('breakout_percent', 'Prozentuale Distanz vom High/Low der letzten Kerze für den Breakout (z.B. 0.05 für 0.05%)', Number, 0.05)
      this.option('stop_loss_percent', 'Stop Loss in Prozent (entspricht StopLoss/MaxStopLoss)', Number, 1.0)
      this.option('profit_target_percent', 'Take Profit in Prozent (simuliert Trailing Stop Ziel)', Number, 0.5)
    },

    calculate: function (s) {
      // Keine Indikatoren im Original-EA, nur Preis-Aktion.
    },

    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()

      var last_bar = s.lookback[0]
      var current_bar = s.period

      if (!last_bar) return cb()

      // Berechne die Breakout-Schwellen basierend auf dem High/Low der letzten Kerze
      var breakout_delta = last_bar.close * (s.options.breakout_percent / 100)
      var buy_threshold = last_bar.high + breakout_delta
      var sell_threshold = last_bar.low - breakout_delta

      // Breakout-Logik (ersetzt Pending Orders)
      // Kaufen, wenn der aktuelle Schlusskurs über dem Buy-Threshold liegt
      if (current_bar.close > buy_threshold) {
        s.signal = 'buy'
        s.options.stop_loss = s.options.stop_loss_percent
        s.options.profit_target = s.options.profit_target_percent
      }
      // Verkaufen, wenn der aktuelle Schlusskurs unter dem Sell-Threshold liegt
      else if (current_bar.close < sell_threshold) {
        s.signal = 'sell'
        s.options.stop_loss = s.options.stop_loss_percent
        s.options.profit_target = s.options.profit_target_percent
      }
      // Ansonsten kein Signal
      else {
        s.signal = null
      }

      cb()
    },

    onReport: function (s) {
      var cols = []
      cols.push(z.ansi(' Breakout %: ' + z.pad(s.options.breakout_percent.toFixed(2) + '%', 5), 'grey'))
      return cols
    }
  }
  return strategy
}
