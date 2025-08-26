const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { v4: uuidv4 } = require('uuid');

module.exports = function(conf) {
  let sequelize;
  let models = {};
  
  if (conf.db.sql.connectionString) {
    sequelize = new Sequelize(conf.db.sql.connectionString);
  } else {
    const options = {
      host: conf.db.sql.host,
      port: conf.db.sql.port,
      dialect: conf.db.sql.dialect,
      logging: conf.debug ? console.log : false
    };
    
    if (conf.db.sql.dialect === 'sqlite') {
      options.storage = conf.db.sql.storage;
    }
    
    sequelize = new Sequelize(
      conf.db.sql.database,
      conf.db.sql.username,
      conf.db.sql.password,
      options
    );
  }
  
  return {
    sequelize,
    models,
    Op,
    
    // Methode zum Initialisieren der Datenbank
    async init() {
      try {
        await sequelize.authenticate();
        console.log('SQL-Datenbankverbindung erfolgreich hergestellt.');
        
        // Modelle definieren und Tabellen erstellen
        this.defineModels();
        await sequelize.sync();
        
        return this;
      } catch (err) {
        console.error('Fehler beim Verbinden mit der SQL-Datenbank:', err);
        throw err;
      }
    },
    
    // Modelle definieren
    defineModels() {
      // Trades Modell
      models.Trade = sequelize.define('trade', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        time: Sequelize.BIGINT,
        price: Sequelize.DECIMAL(20, 8),
        size: Sequelize.DECIMAL(20, 8),
        side: Sequelize.STRING(10),
        exchange: Sequelize.STRING(50)
      }, {
        indexes: [
          {
            fields: ['selector', 'time']
          }
        ]
      });
      
      // Resume Markers Modell
      models.ResumeMarker = sequelize.define('resume_marker', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        from_time: Sequelize.BIGINT,
        to: Sequelize.BIGINT
      }, {
        indexes: [
          {
            fields: ['selector', 'to']
          }
        ]
      });
      
      // Balances Modell
      models.Balance = sequelize.define('balance', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        currency: Sequelize.STRING(20),
        amount: Sequelize.DECIMAL(20, 8),
        time: Sequelize.BIGINT
      });
      
      // Sessions Modell
      models.Session = sequelize.define('session', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        started_at: Sequelize.BIGINT,
        ended_at: Sequelize.BIGINT,
        status: Sequelize.STRING(20),
        data: Sequelize.TEXT
      });
      
      // Periods Modell
      models.Period = sequelize.define('period', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        time: Sequelize.BIGINT,
        open: Sequelize.DECIMAL(20, 8),
        high: Sequelize.DECIMAL(20, 8),
        low: Sequelize.DECIMAL(20, 8),
        close: Sequelize.DECIMAL(20, 8),
        volume: Sequelize.DECIMAL(20, 8)
      });
      
      // My Trades Modell
      models.MyTrade = sequelize.define('my_trade', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        order_id: Sequelize.STRING,
        trade_id: Sequelize.STRING,
        time: Sequelize.BIGINT,
        price: Sequelize.DECIMAL(20, 8),
        size: Sequelize.DECIMAL(20, 8),
        fee: Sequelize.DECIMAL(20, 8),
        slippage: Sequelize.DECIMAL(20, 8),
        side: Sequelize.STRING(10)
      });
      
      // Sim Results Modell
      models.SimResult = sequelize.define('sim_result', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: () => uuidv4()
        },
        selector: Sequelize.STRING,
        time: Sequelize.BIGINT,
        balance: Sequelize.DECIMAL(20, 8),
        profit: Sequelize.DECIMAL(20, 8),
        trades: Sequelize.INTEGER,
        buy_count: Sequelize.INTEGER,
        sell_count: Sequelize.INTEGER,
        data: Sequelize.TEXT
      });
    }
  };
};
