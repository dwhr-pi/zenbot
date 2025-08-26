var z = require('../../../lib/zero')

module.exports = {
  name: 'copy_trading',
  description: 'Copy-Trading Strategie für Zenbot - Kopiert Trades von externen Signalquellen',

  getOptions: function () {
    this.option('period', 'Zeit in Minuten zwischen Signal-Prüfungen', String, '1m')
    this.option('signal_source', 'Signalquelle (file, webhook, api)', String, 'file')
    this.option('signal_file', 'Pfad zur Signaldatei bei Verwendung von file als Quelle', String, 'signals.json')
    this.option('api_url', 'URL der API bei Verwendung von api als Quelle', String, '')
    this.option('api_key', 'API-Schlüssel für die Authentifizierung', String, '')
    this.option('webhook_port', 'Port für den Webhook-Server bei Verwendung von webhook als Quelle', Number, 8080)
    this.option('risk_percentage', 'Prozentsatz des Kapitals pro Trade (0-100)', Number, 1)
    this.option('max_open_trades', 'Maximale Anzahl offener Trades', Number, 3)
    this.option('stop_loss_pct', 'Stop-Loss in Prozent vom Einstiegspreis (0 = deaktiviert)', Number, 5)
    this.option('take_profit_pct', 'Take-Profit in Prozent vom Einstiegspreis (0 = deaktiviert)', Number, 10)
    this.option('max_drawdown_pct', 'Maximaler Drawdown in Prozent, bevor der Handel pausiert wird (0 = deaktiviert)', Number, 15)
    this.option('max_slippage_pct', 'Maximaler Slippage in Prozent (0 = unbegrenzt)', Number, 1)
    this.option('signal_timeout', 'Timeout für Signale in Minuten (0 = kein Timeout)', Number, 60)
    this.option('enable_trading_hours', 'Aktiviert Handelszeitfenster', Boolean, false)
    this.option('trading_hours_start', 'Startzeit des Handelszeitfensters (HH:MM)', String, '09:00')
    this.option('trading_hours_end', 'Endzeit des Handelszeitfensters (HH:MM)', String, '17:00')
    this.option('enable_signal_filter', 'Aktiviert Signalfilterung', Boolean, false)
    this.option('min_signal_quality', 'Minimale Signalqualität (0-100)', Number, 50)
    this.option('enable_logging', 'Aktiviert detailliertes Logging', Boolean, true)
    this.option('log_file', 'Pfad zur Log-Datei', String, 'copy_trading.log')
  },

  calculate: function (s) {
    // Initialisierung beim ersten Aufruf
    if (!s.copy_trading) {
      s.copy_trading = {
        signals: [],
        active_trades: [],
        last_check: 0,
        drawdown: 0,
        total_profit: 0,
        signal_source: null,
        log: []
      }
      
      this.initSignalSource(s)
      this.log(s, 'Copy-Trading Strategie initialisiert')
    }
    
    // Prüfen, ob es Zeit für eine neue Signal-Prüfung ist
    var now = new Date().getTime()
    var check_interval = this.parseInterval(s.options.period)
    
    if (now - s.copy_trading.last_check >= check_interval) {
      s.copy_trading.last_check = now
      this.checkForSignals(s)
    }
    
    // Überprüfen der aktiven Trades
    this.manageActiveTrades(s)
    
    // Handelsentscheidung basierend auf Signalen
    this.processSignals(s)
  },
  
  // Initialisiert die konfigurierte Signalquelle
  initSignalSource: function(s) {
    var source_type = s.options.signal_source
    
    if (source_type === 'file') {
      // Dateibasierte Signalquelle
      s.copy_trading.signal_source = {
        type: 'file',
        path: s.options.signal_file,
        last_modified: 0
      }
      this.log(s, 'Dateibasierte Signalquelle initialisiert: ' + s.options.signal_file)
    }
    else if (source_type === 'api') {
      // API-basierte Signalquelle
      s.copy_trading.signal_source = {
        type: 'api',
        url: s.options.api_url,
        key: s.options.api_key,
        last_id: null
      }
      this.log(s, 'API-basierte Signalquelle initialisiert: ' + s.options.api_url)
    }
    else if (source_type === 'webhook') {
      // Webhook-basierte Signalquelle
      // Hinweis: In einer realen Implementierung würde hier ein HTTP-Server gestartet
      s.copy_trading.signal_source = {
        type: 'webhook',
        port: s.options.webhook_port,
        signals: []
      }
      this.log(s, 'Webhook-basierte Signalquelle initialisiert auf Port: ' + s.options.webhook_port)
      this.log(s, 'HINWEIS: Webhook-Unterstützung erfordert zusätzliche Implementierung')
    }
    else {
      this.log(s, 'FEHLER: Unbekannte Signalquelle: ' + source_type)
    }
  },
  
  // Prüft auf neue Signale von der konfigurierten Quelle
  checkForSignals: function(s) {
    // In einer realen Implementierung würden hier die Signale von der Quelle abgerufen
    // Für diese Demo verwenden wir Beispielsignale
    
    if (s.copy_trading.signal_source.type === 'file') {
      this.log(s, 'Prüfe auf neue Signale in Datei')
      // Hier würde die Datei gelesen und neue Signale verarbeitet werden
    }
    else if (s.copy_trading.signal_source.type === 'api') {
      this.log(s, 'Prüfe auf neue Signale von API')
      // Hier würde die API abgefragt werden
    }
    else if (s.copy_trading.signal_source.type === 'webhook') {
      this.log(s, 'Prüfe auf neue Webhook-Signale')
      // Hier würden die vom Webhook-Server empfangenen Signale verarbeitet werden
    }
    
    // Beispielsignal für Demonstrationszwecke
    if (Math.random() < 0.1) { // 10% Chance für ein neues Signal
      var signal = {
        id: 'demo_' + new Date().getTime(),
        action: Math.random() > 0.5 ? 'buy' : 'sell',
        symbol: s.product_id,
        price: s.period.close,
        amount: 0,
        timestamp: new Date().getTime(),
        source: 'demo',
        quality: Math.random() * 100
      }
      
      this.addSignal(s, signal)
    }
  },
  
  // Fügt ein neues Signal zur Verarbeitung hinzu
  addSignal: function(s, signal) {
    // Signalfilterung
    if (s.options.enable_signal_filter && signal.quality < s.options.min_signal_quality) {
      this.log(s, 'Signal abgelehnt (Qualität zu niedrig): ' + JSON.stringify(signal))
      return
    }
    
    // Handelszeitfenster prüfen
    if (s.options.enable_trading_hours && !this.isWithinTradingHours(s)) {
      this.log(s, 'Signal abgelehnt (außerhalb der Handelszeiten): ' + JSON.stringify(signal))
      return
    }
    
    // Prüfen, ob das Signal bereits verarbeitet wurde
    var existing = s.copy_trading.signals.find(function(s) { return s.id === signal.id })
    if (existing) {
      return
    }
    
    // Signal zur Verarbeitung hinzufügen
    s.copy_trading.signals.push(signal)
    this.log(s, 'Neues Signal hinzugefügt: ' + JSON.stringify(signal))
  },
  
  // Verarbeitet die vorhandenen Signale
  processSignals: function(s) {
    if (s.copy_trading.signals.length === 0) {
      return
    }
    
    // Maximalen Drawdown prüfen
    if (s.options.max_drawdown_pct > 0 && s.copy_trading.drawdown >= s.options.max_drawdown_pct) {
      this.log(s, 'Handel pausiert wegen maximalem Drawdown: ' + s.copy_trading.drawdown.toFixed(2) + '%')
      return
    }
    
    // Maximale Anzahl offener Trades prüfen
    if (s.copy_trading.active_trades.length >= s.options.max_open_trades) {
      return
    }
    
    // Ältestes Signal verarbeiten
    var signal = s.copy_trading.signals.shift()
    
    // Signal-Timeout prüfen
    if (s.options.signal_timeout > 0) {
      var timeout = s.options.signal_timeout * 60 * 1000
      if (new Date().getTime() - signal.timestamp > timeout) {
        this.log(s, 'Signal abgelaufen: ' + JSON.stringify(signal))
        return
      }
    }
    
    // Handelsentscheidung basierend auf Signal
    if (signal.action === 'buy' && !s.buy) {
      // Positionsgröße berechnen
      var size = this.calculatePositionSize(s)
      
      // Kauf-Signal
      s.signal = 'buy'
      s.buy_price = signal.price > 0 ? signal.price : s.period.close
      s.buy_amount = signal.amount > 0 ? signal.amount : size
      
      // Trade zur Verfolgung hinzufügen
      var trade = {
        id: signal.id,
        action: 'buy',
        price: s.buy_price,
        amount: s.buy_amount,
        timestamp: new Date().getTime(),
        source: signal.source,
        stop_loss: s.options.stop_loss_pct > 0 ? s.buy_price * (1 - s.options.stop_loss_pct / 100) : 0,
        take_profit: s.options.take_profit_pct > 0 ? s.buy_price * (1 + s.options.take_profit_pct / 100) : 0
      }
      
      s.copy_trading.active_trades.push(trade)
      this.log(s, 'Kaufsignal ausgeführt: ' + JSON.stringify(trade))
    }
    else if (signal.action === 'sell' && !s.sell) {
      // Positionsgröße berechnen
      var size = this.calculatePositionSize(s)
      
      // Verkauf-Signal
      s.signal = 'sell'
      s.sell_price = signal.price > 0 ? signal.price : s.period.close
      s.sell_amount = signal.amount > 0 ? signal.amount : size
      
      // Trade zur Verfolgung hinzufügen
      var trade = {
        id: signal.id,
        action: 'sell',
        price: s.sell_price,
        amount: s.sell_amount,
        timestamp: new Date().getTime(),
        source: signal.source,
        stop_loss: s.options.stop_loss_pct > 0 ? s.sell_price * (1 + s.options.stop_loss_pct / 100) : 0,
        take_profit: s.options.take_profit_pct > 0 ? s.sell_price * (1 - s.options.take_profit_pct / 100) : 0
      }
      
      s.copy_trading.active_trades.push(trade)
      this.log(s, 'Verkaufssignal ausgeführt: ' + JSON.stringify(trade))
    }
  },
  
  // Verwaltet aktive Trades (Stop-Loss, Take-Profit, etc.)
  manageActiveTrades: function(s) {
    if (s.copy_trading.active_trades.length === 0) {
      return
    }
    
    var current_price = s.period.close
    var trades_to_remove = []
    
    // Jeden aktiven Trade überprüfen
    for (var i = 0; i < s.copy_trading.active_trades.length; i++) {
      var trade = s.copy_trading.active_trades[i]
      
      // Stop-Loss prüfen
      if (trade.stop_loss > 0) {
        if ((trade.action === 'buy' && current_price <= trade.stop_loss) ||
            (trade.action === 'sell' && current_price >= trade.stop_loss)) {
          // Stop-Loss ausgelöst
          if (trade.action === 'buy') {
            s.signal = 'sell'
            s.sell_price = current_price
            s.sell_amount = trade.amount
          } else {
            s.signal = 'buy'
            s.buy_price = current_price
            s.buy_amount = trade.amount
          }
          
          // Verlust berechnen
          var loss_pct = trade.action === 'buy' 
            ? ((trade.price - current_price) / trade.price) * 100
            : ((current_price - trade.price) / trade.price) * 100
          
          s.copy_trading.drawdown = Math.max(s.copy_trading.drawdown, loss_pct)
          s.copy_trading.total_profit -= loss_pct
          
          this.log(s, 'Stop-Loss ausgelöst für Trade: ' + JSON.stringify(trade) + ', Verlust: ' + loss_pct.toFixed(2) + '%')
          trades_to_remove.push(i)
        }
      }
      
      // Take-Profit prüfen
      if (trade.take_profit > 0) {
        if ((trade.action === 'buy' && current_price >= trade.take_profit) ||
            (trade.action === 'sell' && current_price <= trade.take_profit)) {
          // Take-Profit ausgelöst
          if (trade.action === 'buy') {
            s.signal = 'sell'
            s.sell_price = current_price
            s.sell_amount = trade.amount
          } else {
            s.signal = 'buy'
            s.buy_price = current_price
            s.buy_amount = trade.amount
          }
          
          // Gewinn berechnen
          var profit_pct = trade.action === 'buy' 
            ? ((current_price - trade.price) / trade.price) * 100
            : ((trade.price - current_price) / trade.price) * 100
          
          s.copy_trading.total_profit += profit_pct
          
          this.log(s, 'Take-Profit ausgelöst für Trade: ' + JSON.stringify(trade) + ', Gewinn: ' + profit_pct.toFixed(2) + '%')
          trades_to_remove.push(i)
        }
      }
    }
    
    // Abgeschlossene Trades entfernen (in umgekehrter Reihenfolge, um Indizes zu erhalten)
    for (var i = trades_to_remove.length - 1; i >= 0; i--) {
      s.copy_trading.active_trades.splice(trades_to_remove[i], 1)
    }
  },
  
  // Berechnet die Positionsgröße basierend auf Risikomanagement-Einstellungen
  calculatePositionSize: function(s) {
    // In einer realen Implementierung würde hier die Kontogröße abgefragt werden
    var account_balance = 1000 // Beispielwert
    
    // Risikoprozentsatz anwenden
    var risk_amount = account_balance * (s.options.risk_percentage / 100)
    
    // Positionsgröße basierend auf aktuellem Preis berechnen
    var position_size = risk_amount / s.period.close
    
    return position_size
  },
  
  // Prüft, ob die aktuelle Zeit innerhalb des konfigurierten Handelszeitfensters liegt
  isWithinTradingHours: function(s) {
    if (!s.options.enable_trading_hours) {
      return true
    }
    
    var now = new Date()
    var hours = now.getHours()
    var minutes = now.getMinutes()
    var current_time = hours * 60 + minutes
    
    var start_parts = s.options.trading_hours_start.split(':')
    var start_time = parseInt(start_parts[0]) * 60 + parseInt(start_parts[1])
    
    var end_parts = s.options.trading_hours_end.split(':')
    var end_time = parseInt(end_parts[0]) * 60 + parseInt(end_parts[1])
    
    return current_time >= start_time && current_time <= end_time
  },
  
  // Hilfsfunktion zum Parsen von Zeitintervallen
  parseInterval: function(interval_str) {
    var unit = interval_str.slice(-1)
    var value = parseInt(interval_str.slice(0, -1))
    
    switch(unit) {
      case 's': return value * 1000
      case 'm': return value * 60 * 1000
      case 'h': return value * 60 * 60 * 1000
      case 'd': return value * 24 * 60 * 60 * 1000
      default: return value * 60 * 1000 // Default: Minuten
    }
  },
  
  // Logging-Funktion
  log: function(s, message) {
    if (!s.options.enable_logging) {
      return
    }
    
    var timestamp = new Date().toISOString()
    var log_entry = timestamp + ' - ' + message
    
    s.copy_trading.log.push(log_entry)
    
    // In einer realen Implementierung würde hier in eine Datei geschrieben werden
    console.log(log_entry)
  },
  
  onPeriod: function (s, cb) {
    this.calculate(s)
    cb()
  },

  onReport: function (s) {
    var cols = []
    cols.push({
      title: 'Copy-Trading',
      value: 'aktiv'
    })
    
    cols.push({
      title: 'Signalquelle',
      value: s.options.signal_source
    })
    
    cols.push({
      title: 'Aktive Trades',
      value: s.copy_trading ? s.copy_trading.active_trades.length : 0
    })
    
    cols.push({
      title: 'Gesamtgewinn',
      value: s.copy_trading ? s.copy_trading.total_profit.toFixed(2) + '%' : '0.00%'
    })
    
    cols.push({
      title: 'Max Drawdown',
      value: s.copy_trading ? s.copy_trading.drawdown.toFixed(2) + '%' : '0.00%'
    })
    
    return cols
  }
}
