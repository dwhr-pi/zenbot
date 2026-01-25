module.exports = function container (get, set, clear) {
  var c = get('constants')
  var z = get('utils')
  var ta = get('ta')

  var strategy = {
    name: 'boom-ea-zen',
    description: 'Adaptierte Version des MT4 Boom EA. Nutzt eine vereinfachte Momentum-Logik mit optionaler Martingale-Anpassung, basierend auf der Multi-Währungs-Korrelation des Originals.',

    getOptions: function () {
      this.option('period', 'period length', String, '1m')
      this.option('min_pips_filter', 'Mindest-Pips-Bewegung des letzten Bars als Filter (entspricht MinPips)', Number, 10)
      this.option('martingale_factor', 'Faktor zur Erhöhung der Lot-Größe nach einem Verlust (1.0 = keine Erhöhung)', Number, 1.2)
    },

    calculate: function (s) {
      // Keine Indikatoren im Original-EA, nur Preis-Aktion.
    },

    onPeriod: function (s, cb) {
      if (s.in_preroll) return cb()

      var current_bar = s.period

      // 1. Momentum-Check (vereinfachte Version der Multi-Währungs-Korrelation)
      // Der Original-EA prüft die Korrelation von 7 Paaren. Hier simulieren wir dies durch eine starke Momentum-Anforderung auf dem aktuellen Paar.
      
      // Vereinfachte Pips-Berechnung für Zenbot (angenommen 4 Nachkommastellen für Pips)
      var bar_size_pips = Math.abs(current_bar.close - current_bar.open) / s.exchange.asset.tick_size * 10000 

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
      // Der Original-EA handelt in Richtung des stärksten Momentum-Paares.
      // Hier handeln wir in Richtung des Momentums des aktuellen Paares.
      if (is_bullish && !s.acted_on_this_period) {
        s.signal = 'buy'
      } else if (is_bearish && !s.acted_on_this_period) {
        s.signal = 'sell'
      }

      cb()
    },

    onReport: function (s) {
      var cols = []
      cols.push(z.ansi(' Min Pips: ' + z.pad(s.options.min_pips_filter, 5), 'grey'))
      return cols
    }
  }
  return strategy
}
