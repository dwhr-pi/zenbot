const csvAdapter = require('./csv-adapter');
const { v4: uuidv4 } = require('uuid');

module.exports = function(conf) {
  const csvManager = conf.db.csv;
  
  // Hilfsfunktion zum Erstellen einer Collection-Schnittstelle
  function createCollectionInterface(collectionName) {
    return {
      // MongoDB-kompatible Methoden
      createIndex: () => Promise.resolve(), // Indizes werden bereits beim Laden erstellt
      
      find: (query = {}, options = {}) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query, options);
        
        // MongoDB-kompatibles Cursor-Interface simulieren
        return {
          sort: (sortOptions) => {
            const sortedResults = csvAdapter.sortDocuments(results, sortOptions);
            return {
              limit: (limit) => {
                const limitedResults = sortedResults.slice(0, limit);
                return {
                  toArray: () => Promise.resolve(limitedResults)
                };
              },
              toArray: () => Promise.resolve(sortedResults)
            };
          },
          limit: (limit) => {
            const limitedResults = results.slice(0, limit);
            return {
              toArray: () => Promise.resolve(limitedResults)
            };
          },
          toArray: () => Promise.resolve(results)
        };
      },
      
      findOne: (query = {}) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query, { limit: 1 });
        return Promise.resolve(results.length > 0 ? results[0] : null);
      },
      
      insertOne: (doc) => {
        if (!doc.id) {
          doc.id = uuidv4();
        }
        
        if (!doc.created_at) {
          doc.created_at = new Date().toISOString();
        }
        
        csvManager.cache[collectionName].push(doc);
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          insertedId: doc.id,
          insertedCount: 1,
          result: { ok: 1, n: 1 }
        });
      },
      
      insertMany: (docs) => {
        const insertedIds = [];
        
        for (const doc of docs) {
          if (!doc.id) {
            doc.id = uuidv4();
          }
          
          if (!doc.created_at) {
            doc.created_at = new Date().toISOString();
          }
          
          insertedIds.push(doc.id);
          csvManager.cache[collectionName].push(doc);
        }
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          insertedIds: insertedIds,
          insertedCount: docs.length,
          result: { ok: 1, n: docs.length }
        });
      },
      
      updateOne: (query, update) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query, { limit: 1 });
        
        if (results.length === 0) {
          return Promise.resolve({
            matchedCount: 0,
            modifiedCount: 0,
            result: { ok: 1, n: 0 }
          });
        }
        
        const doc = results[0];
        const index = csvManager.cache[collectionName].findIndex(d => d.id === doc.id);
        
        if (update.$set) {
          Object.assign(csvManager.cache[collectionName][index], update.$set);
        }
        
        // Weitere Update-Operatoren nach Bedarf
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          matchedCount: 1,
          modifiedCount: 1,
          result: { ok: 1, n: 1 }
        });
      },
      
      updateMany: (query, update) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query);
        
        if (results.length === 0) {
          return Promise.resolve({
            matchedCount: 0,
            modifiedCount: 0,
            result: { ok: 1, n: 0 }
          });
        }
        
        let modifiedCount = 0;
        
        for (const doc of results) {
          const index = csvManager.cache[collectionName].findIndex(d => d.id === doc.id);
          
          if (index !== -1) {
            if (update.$set) {
              Object.assign(csvManager.cache[collectionName][index], update.$set);
              modifiedCount++;
            }
            
            // Weitere Update-Operatoren nach Bedarf
          }
        }
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          matchedCount: results.length,
          modifiedCount: modifiedCount,
          result: { ok: 1, n: modifiedCount }
        });
      },
      
      deleteOne: (query) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query, { limit: 1 });
        
        if (results.length === 0) {
          return Promise.resolve({
            deletedCount: 0,
            result: { ok: 1, n: 0 }
          });
        }
        
        const doc = results[0];
        const index = csvManager.cache[collectionName].findIndex(d => d.id === doc.id);
        
        if (index !== -1) {
          csvManager.cache[collectionName].splice(index, 1);
        }
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          deletedCount: 1,
          result: { ok: 1, n: 1 }
        });
      },
      
      deleteMany: (query) => {
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query);
        
        if (results.length === 0) {
          return Promise.resolve({
            deletedCount: 0,
            result: { ok: 1, n: 0 }
          });
        }
        
        const idsToDelete = results.map(doc => doc.id);
        csvManager.cache[collectionName] = csvManager.cache[collectionName].filter(doc => !idsToDelete.includes(doc.id));
        
        // Synchronisiere mit Dateisystem, wenn kein Intervall konfiguriert ist
        if (!conf.db.csv.syncInterval) {
          csvManager.syncCollection(collectionName);
        }
        
        return Promise.resolve({
          deletedCount: results.length,
          result: { ok: 1, n: results.length }
        });
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
        const results = csvAdapter.findDocuments(csvManager.cache[collectionName], query);
        return Promise.resolve(results.length);
      }
    };
  }
  
  return {
    getTrades: () => {
      return createCollectionInterface('trades');
    },
    
    getResumeMarkers: () => {
      return createCollectionInterface('resume_markers');
    },
    
    getBalances: () => {
      return createCollectionInterface('balances');
    },
    
    getSessions: () => {
      return createCollectionInterface('sessions');
    },
    
    getPeriods: () => {
      return createCollectionInterface('periods');
    },
    
    getMyTrades: () => {
      return createCollectionInterface('my_trades');
    },
    
    getSimResults: () => {
      return createCollectionInterface('sim_results');
    }
  };
};
