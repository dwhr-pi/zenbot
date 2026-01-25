module.exports = function container (get, set, clear) {
  var c = get('constants')
  var z = get('utils')
  var ta = get('ta')

  var strategy = {
    name: 'best-grider-zen',
    description: 'Adaptierte Version des MT4 Best-Grider EA. Nutzt Momentum-Filterung und eine vereinfachte Martingale-Logik nach Verlusten.',

    getOptions: function () {
      this.option('period', 'period length', String, '1m')
      this.option('momentum_period', 'Periodenlänge für den Momentum-Check (z.B. EMA)', Number, 10)
      this.option('momentum_threshold', 'Mindestprozentsatz der Kursbewegung für ein Signal (z.B. 0.1 für 0.1%)', Number, 0.1)
      this.option('martingale_factor', 'Faktor zur Erhöhung der Lot-Größe nach einem Verlust (1.0 = keine Erhöhung)', Number, 1.5)
      this.option('min_pips_filter', 'Mindest-Pips-Bewegung des letzten Bars als Filter (entspricht MinPips)', Number, 25)
    },

    calculate: function (s) {
      // Berechne den Momentum-Indikator (z.B. EMA)
      ta.add(s, 'momentum_ema', 'ema', s.options.momentum_period)
    },

    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()

      // 1. Momentum-Check (vereinfachte Version des Multi-Währungs-Filters)
      // Wir prüfen, ob die letzte Kerze eine starke Bewegung in eine Richtung war.
      var last_bar = s.lookback[0]
      var current_bar = s.period
      var bar_size_pips = Math.abs(current_bar.close - current_bar.open) / s.exchange.asset.tick_size * 10000 // Vereinfachte Pips-Berechnung

      // Prüfe, ob die Bewegung groß genug ist (MinPips-Filter)
      if (bar_size_pips < s.options.min_pips_filter) {
        s.signal = null // Kein Handel, wenn die Bewegung zu klein ist
        return cb()
      }

      // Prüfe die Richtung der Bewegung
      var is_bullish = current_bar.close > current_bar.open
      var is_bearish = current_bar.close < current_bar.open

      // 2. Martingale-Logik (Lot-Größe anpassen)
      var lot_size_factor = 1.0
      if (s.options.martingale_factor > 1.0) {
        // Zenbot speichert den letzten Trade-Status in s.last_trade
        if (s.last_trade && s.last_trade.profit < 0) {
          // Erhöhe den Faktor nach einem Verlust
          lot_size_factor = s.options.martingale_factor
        } else {
          // Setze den Faktor nach einem Gewinn oder ohne vorherigen Trade zurück
          lot_size_factor = 1.0
        }
      }
      
      // Speichere den angepassten Faktor für die Order-Größe
      s.options.size = s.options.size * lot_size_factor

      // 3. Handelssignal
      if (is_bullish && !s.acted_on_this_period) {
        s.signal = 'buy'
      } else if (is_bearish && !s.acted_on_this_period) {
        s.signal = 'sell'
      }

      cb()
    },

    onReport: function (s) {
      var cols = []
      cols.push(z.ansi(' Momentum: ' + z.pad(s.period.momentum_ema ? s.period.momentum_ema.toFixed(2) : 'N/A', 5), 'grey'))
      return cols
    }
  }
  return strategy
}
