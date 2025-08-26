const sqlAdapter = require('./sql-adapter');

module.exports = function(conf) {
  const sqlManager = conf.db.sql;
  
  // Hilfsfunktion zum Erstellen einer Collection-Schnittstelle
  function createCollectionInterface(modelName) {
    const model = sqlManager.models[modelName];
    
    return {
      // MongoDB-kompatible Methoden
      createIndex: () => Promise.resolve(), // Indizes werden bereits bei der Modelldefinition erstellt
      
      find: (query = {}, options = {}) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        
        if (options.sort) {
          sequelizeQuery.order = sqlAdapter.convertSort(options.sort);
        }
        
        if (options.limit) {
          sequelizeQuery.limit = options.limit;
        }
        
        if (options.skip) {
          sequelizeQuery.offset = options.skip;
        }
        
        return model.findAll(sequelizeQuery)
          .then(results => {
            // MongoDB-kompatibles Cursor-Interface simulieren
            const items = results.map(r => r.toJSON());
            return {
              sort: () => ({ toArray: () => Promise.resolve(items) }),
              limit: () => ({ toArray: () => Promise.resolve(items) }),
              toArray: () => Promise.resolve(items)
            };
          });
      },
      
      findOne: (query = {}) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        return model.findOne(sequelizeQuery)
          .then(result => result ? result.toJSON() : null);
      },
      
      insertOne: (doc) => {
        return model.create(doc)
          .then(result => ({
            insertedId: result.id,
            insertedCount: 1,
            result: { ok: 1, n: 1 }
          }));
      },
      
      insertMany: (docs) => {
        return model.bulkCreate(docs)
          .then(results => ({
            insertedIds: results.map(r => r.id),
            insertedCount: results.length,
            result: { ok: 1, n: results.length }
          }));
      },
      
      updateOne: (query, update) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        const sequelizeUpdate = sqlAdapter.convertUpdate(update);
        
        return model.update(sequelizeUpdate, { where: sequelizeQuery.where })
          .then(([affectedCount]) => ({
            matchedCount: affectedCount,
            modifiedCount: affectedCount,
            result: { ok: 1, n: affectedCount }
          }));
      },
      
      updateMany: (query, update) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        const sequelizeUpdate = sqlAdapter.convertUpdate(update);
        
        return model.update(sequelizeUpdate, { where: sequelizeQuery.where })
          .then(([affectedCount]) => ({
            matchedCount: affectedCount,
            modifiedCount: affectedCount,
            result: { ok: 1, n: affectedCount }
          }));
      },
      
      deleteOne: (query) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        
        return model.destroy({ where: sequelizeQuery.where, limit: 1 })
          .then(affectedCount => ({
            deletedCount: affectedCount,
            result: { ok: 1, n: affectedCount }
          }));
      },
      
      deleteMany: (query) => {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        
        return model.destroy({ where: sequelizeQuery.where })
          .then(affectedCount => ({
            deletedCount: affectedCount,
            result: { ok: 1, n: affectedCount }
          }));
      },
      
      // Alias-Methoden für MongoDB-Kompatibilität
      insert: function(doc) {
        return Array.isArray(doc) ? this.insertMany(doc) : this.insertOne(doc);
      },
      
      update: function(query, update, options = {}) {
        return options.multi ? this.updateMany(query, update) : this.updateOne(query, update);
      },
      
      remove: function(query, options = {}) {
        return options.justOne ? this.deleteOne(query) : this.deleteMany(query);
      },
      
      count: function(query = {}) {
        const sequelizeQuery = sqlAdapter.convertQuery(query);
        return model.count({ where: sequelizeQuery.where });
      }
    };
  }
  
  return {
    getTrades: () => {
      return createCollectionInterface('Trade');
    },
    
    getResumeMarkers: () => {
      return createCollectionInterface('ResumeMarker');
    },
    
    getBalances: () => {
      return createCollectionInterface('Balance');
    },
    
    getSessions: () => {
      return createCollectionInterface('Session');
    },
    
    getPeriods: () => {
      return createCollectionInterface('Period');
    },
    
    getMyTrades: () => {
      return createCollectionInterface('MyTrade');
    },
    
    getSimResults: () => {
      return createCollectionInterface('SimResult');
    }
  };
};
