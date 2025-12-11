// Zenbot Strategy: grid_waka
// Version: 1.0 (Optimized)
// Description: A grid trading strategy inspired by the Waka Waka EA,
// adapted for cryptocurrency markets. It uses Bollinger Bands and RSI
// for initial entry and a conservative DCA/Martingale approach for managing the grid.
// Optimized for robustness and reduced maximum drawdown.

module.exports = function container(get, set, clear) {
  return {
    name: 'grid_waka',
    description: 'Grid trading strategy based on Waka Waka EA logic (BB + RSI entry, conservative DCA/Martingale grid).',

    getOptions: function() {
      this.option('period', 'period length, e.g. 15m', String, '15m')
      this.option('period_length', 'period length, e.g. 15m', String, '15m')
      this.option('order_size_pct', 'Initial order size as a percentage of portfolio', Number, 1)
      
      // -- INDICATOR SETTINGS (from Waka Waka) --
      this.option('bb_period', 'Bollinger Bands period', Number, 35)
      this.option('rsi_period', 'RSI period', Number, 20)
      
      // -- ENTRY CONDITIONS --
      this.option('rsi_buy_trigger', 'RSI level to trigger a buy grid', Number, 15)
      this.option('rsi_sell_trigger', 'RSI level to trigger a sell grid', Number, 85)

      // -- GRID MANAGEMENT (Optimized for robustness) --
      this.option('grid_distance', 'Distance (%) from last order to place a new one', Number, 1.0) // Optimized from 1.5
      this.option('lot_multiplier', 'Multiplier for the size of the next order in the grid', Number, 1.2) // Optimized from 1.6
      this.option('max_grid_orders', 'Maximum number of orders in a single grid', Number, 5)

      // -- EXIT CONDITIONS (Optimized for profit) --
      this.option('take_profit', 'Take profit % for the entire grid', Number, 1.2) // Optimized from 0.8
      this.option('stop_loss', 'Stop loss % for the entire grid (emergency exit)', Number, 25) // Optimized from 30
    },

    calculate: function(s) {
      get('lib.bollinger')(s, 'bb', s.options.bb_period)
      get('lib.rsi')(s, 'rsi', s.options.rsi_period)
    },

    onPeriod: function(s, cb) {
      if (!s.custom_state) {
        s.custom_state = { active: false, orders: [] };
      }
      if (s.lookback.length > s.options.bb_period) {
        this.calculate(s)
      }
      if (!s.period.rsi || !s.period.bb) {
        return cb();
      }

      // --- 1. LOGIK FÜR INAKTIVES GRID ---
      if (!s.custom_state.active) {
        let signal = null;
        if (s.period.close < s.period.bb.lower && s.period.rsi < s.options.rsi_buy_trigger) {
          signal = 'buy';
        } else if (s.period.close > s.period.bb.upper && s.period.rsi > s.options.rsi_sell_trigger) {
          signal = 'sell';
        }
        if (signal) {
          s.signal = signal; 
          const order_size = s.options.order_size_pct;
          const price = s.period.close;
          s.custom_state = {
            active: true, direction: signal, orders: [{ price: price, size: order_size }],
            avg_price: price, total_quantity: order_size
          };
          // console.log(`\n--- NEW GRID STARTED --- | Direction: ${signal.toUpperCase()} | 1st Order: ${order_size}% at ${price}`);
        }
      }
      // --- 2. LOGIK FÜR AKTIVES GRID ---
      else {
        let current_profit_pct = 0;
        if (s.custom_state.direction === 'buy') {
          current_profit_pct = ((s.period.close - s.custom_state.avg_price) / s.custom_state.avg_price) * 100;
        } else {
          current_profit_pct = ((s.custom_state.avg_price - s.period.close) / s.custom_state.avg_price) * 100;
        }
        s.custom_state.profit = current_profit_pct;

        // a) Prüfe auf Take-Profit
        if (current_profit_pct >= s.options.take_profit) {
          // console.log(`\n--- GRID CLOSED (TAKE PROFIT) --- | Profit: ${current_profit_pct.toFixed(2)}%`);
          s.signal = (s.custom_state.direction === 'buy') ? 'sell' : 'buy';
          s.custom_state = { active: false, orders: [] }; 
          return cb();
        }

        // b) Prüfe auf Stop-Loss
        const drawdown_pct = -current_profit_pct;
        if (drawdown_pct >= s.options.stop_loss) {
          // console.log(`\n--- !!! GRID CLOSED (STOP LOSS) !!! --- | Drawdown: ${drawdown_pct.toFixed(2)}%`);
          s.signal = (s.custom_state.direction === 'buy') ? 'sell' : 'buy';
          s.custom_state = { active: false, orders: [] };
          return cb();
        }

        // c) Prüfe auf Hinzufügen einer neuen Grid-Order (DCA)
        if (s.custom_state.orders.length < s.options.max_grid_orders) {
          const last_order_price = s.custom_state.orders[s.custom_state.orders.length - 1].price;
          let price_distance_pct = 0;
          if (s.custom_state.direction === 'buy') {
            price_distance_pct = ((last_order_price - s.period.close) / last_order_price) * 100;
          } else {
            price_distance_pct = ((s.period.close - last_order_price) / last_order_price) * 100;
          }

          if (price_distance_pct >= s.options.grid_distance) {
            const last_order_size = s.custom_state.orders[s.custom_state.orders.length - 1].size;
            const new_order_size = last_order_size * s.options.lot_multiplier;
            const price = s.period.close;
            s.signal = s.custom_state.direction;
            s.options.order_size_pct = new_order_size;
            
            // Recalculate new state
            const total_cost_before = s.custom_state.avg_price * s.custom_state.total_quantity;
            const new_order_cost = price * new_order_size;
            const new_total_quantity = s.custom_state.total_quantity + new_order_size;
            const new_avg_price = (total_cost_before + new_order_cost) / new_total_quantity;
            
            s.custom_state.orders.push({ price: price, size: new_order_size });
            s.custom_state.total_quantity = new_total_quantity;
            s.custom_state.avg_price = new_avg_price;
            // console.log(`\n--- ADDING TO GRID (Order ${s.custom_state.orders.length}) --- | New Avg Price: ${new_avg_price.toFixed(2)}`);
          }
        }
      }
      cb();
    },

    onReport: function(s, cb) {
      var cols = []
      if (s.custom_state && s.custom_state.active) {
        cols.push('GRID ACTIVE (' + s.custom_state.direction.toUpperCase() + ')')
        cols.push('Orders: ' + s.custom_state.orders.length + '/' + s.options.max_grid_orders)
        cols.push('Avg Price: ' + s.custom_state.avg_price.toFixed(4))
        cols.push('Profit/DD: ' + (s.custom_state.profit ? s.custom_state.profit.toFixed(2) : 'N/A') + '%')
      } else {
        cols.push('GRID INACTIVE')
      }
      cb(null, cols)
    }
  }
}
