# SQL-Datenbankschnittstelle für Zenbot

## Übersicht

Diese Dokumentation beschreibt das Design einer SQL-Datenbankschnittstelle für Zenbot als Alternative zur bestehenden MongoDB-Integration. Die Schnittstelle soll vollständig kompatibel mit der vorhandenen Architektur sein und alle notwendigen Funktionen bereitstellen.

## Datenbankschema

Basierend auf den identifizierten MongoDB-Collections werden folgende SQL-Tabellen erstellt:

### trades
```sql
CREATE TABLE trades (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    time BIGINT,
    price DECIMAL(20, 8),
    size DECIMAL(20, 8),
    side VARCHAR(10),
    exchange VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_trades_selector_time ON trades(selector, time);
```

### resume_markers
```sql
CREATE TABLE resume_markers (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    from_time BIGINT,
    to BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_resume_markers_selector_to ON resume_markers(selector, to);
```

### balances
```sql
CREATE TABLE balances (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    currency VARCHAR(20),
    amount DECIMAL(20, 8),
    time BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sessions
```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    started_at BIGINT,
    ended_at BIGINT,
    status VARCHAR(20),
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### periods
```sql
CREATE TABLE periods (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    time BIGINT,
    open DECIMAL(20, 8),
    high DECIMAL(20, 8),
    low DECIMAL(20, 8),
    close DECIMAL(20, 8),
    volume DECIMAL(20, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### my_trades
```sql
CREATE TABLE my_trades (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    order_id VARCHAR(255),
    trade_id VARCHAR(255),
    time BIGINT,
    price DECIMAL(20, 8),
    size DECIMAL(20, 8),
    fee DECIMAL(20, 8),
    slippage DECIMAL(20, 8),
    side VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sim_results
```sql
CREATE TABLE sim_results (
    id VARCHAR(255) PRIMARY KEY,
    selector VARCHAR(255),
    time BIGINT,
    balance DECIMAL(20, 8),
    profit DECIMAL(20, 8),
    trades INTEGER,
    buy_count INTEGER,
    sell_count INTEGER,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Architektur

Die SQL-Datenbankschnittstelle wird als Modul implementiert, das die gleiche Schnittstelle wie die MongoDB-Integration bietet. Die Hauptkomponenten sind:

1. **SQL-Verbindungsmanager**: Verantwortlich für die Herstellung und Verwaltung der Datenbankverbindung.
2. **SQL-Collection-Service**: Bietet die gleichen Methoden wie der bestehende Collection-Service, aber mit SQL-Implementierung.
3. **SQL-Adapter**: Übersetzt MongoDB-Abfragen in SQL-Abfragen.

## Konfiguration

Die SQL-Datenbankschnittstelle wird über die bestehende Konfigurationsdatei konfiguriert, mit zusätzlichen Parametern für die SQL-Verbindung:

```javascript
c.db = {}
c.db.type = 'sql' // Kann 'mongo', 'sql' oder 'csv' sein
c.db.sql = {}
c.db.sql.dialect = 'sqlite' // Kann 'sqlite', 'mysql', 'postgres' oder 'mssql' sein
c.db.sql.host = 'localhost'
c.db.sql.port = 3306 // Standard-Port für MySQL
c.db.sql.database = 'zenbot'
c.db.sql.username = 'zenbot'
c.db.sql.password = 'password'
c.db.sql.storage = 'zenbot.db' // Nur für SQLite
c.db.sql.connectionString = '' // Optional: Vollständiger Verbindungsstring
```

## Implementierungsdetails

### SQL-Verbindungsmanager

```javascript
// sql-connection-manager.js
const Sequelize = require('sequelize')

module.exports = function(conf) {
  let sequelize
  
  if (conf.db.sql.connectionString) {
    sequelize = new Sequelize(conf.db.sql.connectionString)
  } else {
    const options = {
      host: conf.db.sql.host,
      port: conf.db.sql.port,
      dialect: conf.db.sql.dialect,
      logging: conf.debug ? console.log : false
    }
    
    if (conf.db.sql.dialect === 'sqlite') {
      options.storage = conf.db.sql.storage
    }
    
    sequelize = new Sequelize(
      conf.db.sql.database,
      conf.db.sql.username,
      conf.db.sql.password,
      options
    )
  }
  
  return {
    sequelize,
    
    // Methode zum Initialisieren der Datenbank
    async init() {
      try {
        await sequelize.authenticate()
        console.log('SQL-Datenbankverbindung erfolgreich hergestellt.')
        
        // Modelle definieren und Tabellen erstellen
        this.defineModels()
        await sequelize.sync()
        
        return this
      } catch (err) {
        console.error('Fehler beim Verbinden mit der SQL-Datenbank:', err)
        throw err
      }
    },
    
    // Modelle definieren
    defineModels() {
      // Hier werden die Sequelize-Modelle für alle Tabellen definiert
      // ...
    }
  }
}
```

### SQL-Collection-Service

```javascript
// sql-collection-service.js
module.exports = function(conf) {
  const sqlManager = conf.db.sql
  
  return {
    getTrades: () => {
      return {
        // MongoDB-kompatible Methoden
        createIndex: () => Promise.resolve(),
        find: (query) => sqlManager.models.Trade.findAll(sqlAdapter.convertQuery(query)),
        findOne: (query) => sqlManager.models.Trade.findOne(sqlAdapter.convertQuery(query)),
        insert: (doc) => sqlManager.models.Trade.create(doc),
        update: (query, update) => sqlManager.models.Trade.update(update, sqlAdapter.convertQuery(query)),
        remove: (query) => sqlManager.models.Trade.destroy(sqlAdapter.convertQuery(query))
      }
    },
    
    getResumeMarkers: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    },
    
    getBalances: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    },
    
    getSessions: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    },
    
    getPeriods: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    },
    
    getMyTrades: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    },
    
    getSimResults: () => {
      // Ähnliche Implementierung wie für getTrades()
      // ...
    }
  }
}
```

### SQL-Adapter

```javascript
// sql-adapter.js
module.exports = {
  // Konvertiert MongoDB-Abfragen in Sequelize-Abfragen
  convertQuery(mongoQuery) {
    const sequelizeQuery = {
      where: {}
    }
    
    // Einfache Gleichheitsabfragen
    Object.keys(mongoQuery).forEach(key => {
      if (typeof mongoQuery[key] !== 'object') {
        sequelizeQuery.where[key] = mongoQuery[key]
      } else {
        // MongoDB-Operatoren in Sequelize-Operatoren umwandeln
        Object.keys(mongoQuery[key]).forEach(op => {
          switch(op) {
            case '$gt':
              sequelizeQuery.where[key] = { [Op.gt]: mongoQuery[key][op] }
              break
            case '$gte':
              sequelizeQuery.where[key] = { [Op.gte]: mongoQuery[key][op] }
              break
            case '$lt':
              sequelizeQuery.where[key] = { [Op.lt]: mongoQuery[key][op] }
              break
            case '$lte':
              sequelizeQuery.where[key] = { [Op.lte]: mongoQuery[key][op] }
              break
            case '$ne':
              sequelizeQuery.where[key] = { [Op.ne]: mongoQuery[key][op] }
              break
            case '$in':
              sequelizeQuery.where[key] = { [Op.in]: mongoQuery[key][op] }
              break
            // Weitere Operatoren nach Bedarf
          }
        })
      }
    })
    
    return sequelizeQuery
  }
}
```

### Boot-Prozess-Anpassung

```javascript
// Anpassung in boot.js
var _ = require('lodash')
var path = require('path')
// ... bestehender Code ...

module.exports = function(cb) {
  // ... bestehender Code ...
  
  // Datenbankverbindung basierend auf Konfiguration herstellen
  if (zenbot.conf.db.type === 'mongo') {
    // Bestehende MongoDB-Verbindung
    require('mongodb').MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
      if (err) {
        console.error('WARNING: MongoDB Connection Error: ', err)
        console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
        console.error('Attempted authentication string: ' + connectionString)
        cb(null, zenbot)
        return
      }
      var db = client.db(zenbot.conf.mongo.db)
      _.set(zenbot, 'conf.db.mongo', db)
      cb(null, zenbot)
    })
  } else if (zenbot.conf.db.type === 'sql') {
    // SQL-Datenbankverbindung
    const sqlConnectionManager = require('./lib/db/sql-connection-manager')(zenbot.conf)
    sqlConnectionManager.init()
      .then(sqlManager => {
        _.set(zenbot, 'conf.db.sql', sqlManager)
        cb(null, zenbot)
      })
      .catch(err => {
        console.error('WARNING: SQL Database Connection Error: ', err)
        console.error('WARNING: without database some features (such as backfilling/simulation) may be disabled.')
        cb(null, zenbot)
      })
  } else if (zenbot.conf.db.type === 'csv') {
    // CSV-Datenbankverbindung (wird später implementiert)
    const csvConnectionManager = require('./lib/db/csv-connection-manager')(zenbot.conf)
    csvConnectionManager.init()
      .then(csvManager => {
        _.set(zenbot, 'conf.db.csv', csvManager)
        cb(null, zenbot)
      })
      .catch(err => {
        console.error('WARNING: CSV Database Connection Error: ', err)
        console.error('WARNING: without database some features (such as backfilling/simulation) may be disabled.')
        cb(null, zenbot)
      })
  }
}
```

## Abhängigkeiten

Die SQL-Datenbankschnittstelle benötigt folgende zusätzliche Abhängigkeiten:

- **sequelize**: ORM für SQL-Datenbanken
- **sqlite3**: Für SQLite-Unterstützung
- **mysql2**: Für MySQL-Unterstützung
- **pg**: Für PostgreSQL-Unterstützung
- **tedious**: Für MS SQL Server-Unterstützung

Diese Abhängigkeiten müssen in der package.json hinzugefügt und installiert werden.
