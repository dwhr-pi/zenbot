// Anpassung in boot.js für die Integration der alternativen Datenbankschnittstellen
var _ = require('lodash')
var path = require('path')
// ... bestehender Code ...

module.exports = function(cb) {
  // ... bestehender Code ...
  
  // Datenbankverbindung basierend auf Konfiguration herstellen
  if (!zenbot.conf.db || !zenbot.conf.db.type || zenbot.conf.db.type === 'mongo') {
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
      
      // Initialisiere den Collection-Service
      const collectionService = require('./lib/services/collection-service')(zenbot.conf)
      _.set(zenbot, 'conf.collectionService', collectionService)
      
      cb(null, zenbot)
    })
  } else if (zenbot.conf.db.type === 'sql') {
    // SQL-Datenbankverbindung
    const sqlConnectionManager = require('./lib/db/sql-connection-manager')(zenbot.conf)
    sqlConnectionManager.init()
      .then(sqlManager => {
        _.set(zenbot, 'conf.db.sql', sqlManager)
        
        // Initialisiere den SQL-Collection-Service
        const sqlCollectionService = require('./lib/db/sql-collection-service')(zenbot.conf)
        _.set(zenbot, 'conf.collectionService', sqlCollectionService)
        
        cb(null, zenbot)
      })
      .catch(err => {
        console.error('WARNING: SQL Database Connection Error: ', err)
        console.error('WARNING: without database some features (such as backfilling/simulation) may be disabled.')
        cb(null, zenbot)
      })
  } else if (zenbot.conf.db.type === 'csv') {
    // CSV-Datenbankverbindung
    const csvConnectionManager = require('./lib/db/csv-connection-manager')(zenbot.conf)
    csvConnectionManager.init()
      .then(csvManager => {
        _.set(zenbot, 'conf.db.csv', csvManager)
        
        // Initialisiere den CSV-Collection-Service
        const csvCollectionService = require('./lib/db/csv-collection-service')(zenbot.conf)
        _.set(zenbot, 'conf.collectionService', csvCollectionService)
        
        cb(null, zenbot)
      })
      .catch(err => {
        console.error('WARNING: CSV Database Connection Error: ', err)
        console.error('WARNING: without database some features (such as backfilling/simulation) may be disabled.')
        cb(null, zenbot)
      })
  }
}
