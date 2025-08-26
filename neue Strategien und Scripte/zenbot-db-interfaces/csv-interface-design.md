# CSV-Datenbankschnittstelle für Zenbot

## Übersicht

Diese Dokumentation beschreibt das Design einer CSV-Datenbankschnittstelle für Zenbot als Alternative zur bestehenden MongoDB-Integration. Die Schnittstelle soll vollständig kompatibel mit der vorhandenen Architektur sein und alle notwendigen Funktionen bereitstellen.

## Dateistruktur

Die CSV-Datenbankschnittstelle speichert Daten in einer Verzeichnisstruktur, wobei jede Collection einem Unterverzeichnis entspricht:

```
/data
  /trades
    trades.csv
    index_selector_time.json
  /resume_markers
    resume_markers.csv
    index_selector_to.json
  /balances
    balances.csv
  /sessions
    sessions.csv
  /periods
    periods.csv
  /my_trades
    my_trades.csv
  /sim_results
    sim_results.csv
```

## CSV-Dateiformat

Jede CSV-Datei enthält eine Kopfzeile mit den Spaltennamen und dann die eigentlichen Datensätze. Beispiel für trades.csv:

```csv
id,selector,time,price,size,side,exchange,created_at
abc123,gdax.BTC-USD,1622548800000,35000.00,0.1,buy,gdax,2021-06-01T12:00:00Z
def456,gdax.BTC-USD,1622548860000,35050.00,0.2,sell,gdax,2021-06-01T12:01:00Z
```

## Index-Dateien

Für Collections mit Indizes werden separate JSON-Dateien erstellt, die die Indizes definieren und beschleunigten Zugriff ermöglichen. Beispiel für index_selector_time.json:

```json
{
  "index_name": "selector_time",
  "fields": ["selector", "time"],
  "entries": {
    "gdax.BTC-USD_1622548800000": "abc123",
    "gdax.BTC-USD_1622548860000": "def456"
  }
}
```

## Architektur

Die CSV-Datenbankschnittstelle wird als Modul implementiert, das die gleiche Schnittstelle wie die MongoDB-Integration bietet. Die Hauptkomponenten sind:

1. **CSV-Verbindungsmanager**: Verantwortlich für die Initialisierung und Verwaltung der Dateistruktur.
2. **CSV-Collection-Service**: Bietet die gleichen Methoden wie der bestehende Collection-Service, aber mit CSV-Implementierung.
3. **CSV-Adapter**: Übersetzt MongoDB-Abfragen in Dateioperationen.

## Konfiguration

Die CSV-Datenbankschnittstelle wird über die bestehende Konfigurationsdatei konfiguriert, mit zusätzlichen Parametern für den CSV-Speicherort:

```javascript
c.db = {}
c.db.type = 'csv' // Kann 'mongo', 'sql' oder 'csv' sein
c.db.csv = {}
c.db.csv.dataDir = './data/csv' // Verzeichnis für CSV-Dateien
c.db.csv.indexing = true // Ob Indizes erstellt werden sollen
c.db.csv.caching = true // Ob Daten im Speicher gecacht werden sollen
c.db.csv.syncInterval = 5000 // Intervall in ms für Synchronisierung mit Dateisystem
```

## Implementierungsdetails

### CSV-Verbindungsmanager

```javascript
// csv-connection-manager.js
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = function(conf) {
  const dataDir = conf.db.csv.dataDir;
  const collections = ['trades', 'resume_markers', 'balances', 'sessions', 'periods', 'my_trades', 'sim_results'];
  const cache = {};
  const indexes = {};
  
  return {
    dataDir,
    cache,
    indexes,
    
    // Methode zum Initialisieren der Dateistruktur
    async init() {
      try {
        // Erstelle Hauptverzeichnis, falls es nicht existiert
        await mkdirp(dataDir);
        
        // Erstelle Unterverzeichnisse für jede Collection
        for (const collection of collections) {
          const collectionDir = path.join(dataDir, collection);
          await mkdirp(collectionDir);
          
          // Initialisiere Cache für jede Collection
          cache[collection] = [];
          
          // Lade bestehende Daten, falls vorhanden
          const csvFile = path.join(collectionDir, `${collection}.csv`);
          if (fs.existsSync(csvFile)) {
            await this.loadCollection(collection);
          } else {
            // Erstelle leere CSV-Datei mit Header
            const headers = this.getHeadersForCollection(collection);
            fs.writeFileSync(csvFile, headers.join(',') + '\n');
          }
          
          // Lade bestehende Indizes, falls vorhanden
          await this.loadIndexes(collection);
        }
        
        // Starte Synchronisierungsintervall, wenn konfiguriert
        if (conf.db.csv.syncInterval > 0) {
          setInterval(() => this.syncAll(), conf.db.csv.syncInterval);
        }
        
        console.log('CSV-Datenbankverbindung erfolgreich initialisiert.');
        return this;
      } catch (err) {
        console.error('Fehler beim Initialisieren der CSV-Datenbank:', err);
        throw err;
      }
    },
    
    // Gibt die Header für eine bestimmte Collection zurück
    getHeadersForCollection(collection) {
      switch (collection) {
        case 'trades':
          return ['id', 'selector', 'time', 'price', 'size', 'side', 'exchange', 'created_at'];
        case 'resume_markers':
          return ['id', 'selector', 'from_time', 'to', 'created_at'];
        case 'balances':
          return ['id', 'selector', 'currency', 'amount', 'time', 'created_at'];
        case 'sessions':
          return ['id', 'selector', 'started_at', 'ended_at', 'status', 'data', 'created_at'];
        case 'periods':
          return ['id', 'selector', 'time', 'open', 'high', 'low', 'close', 'volume', 'created_at'];
        case 'my_trades':
          return ['id', 'selector', 'order_id', 'trade_id', 'time', 'price', 'size', 'fee', 'slippage', 'side', 'created_at'];
        case 'sim_results':
          return ['id', 'selector', 'time', 'balance', 'profit', 'trades', 'buy_count', 'sell_count', 'data', 'created_at'];
        default:
          return ['id', 'created_at'];
      }
    },
    
    // Lädt eine Collection aus der CSV-Datei in den Cache
    async loadCollection(collection) {
      const csvFile = path.join(dataDir, collection, `${collection}.csv`);
      const content = fs.readFileSync(csvFile, 'utf8');
      const lines = content.trim().split('\n');
      const headers = lines[0].split(',');
      
      cache[collection] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        const doc = {};
        
        for (let j = 0; j < headers.length; j++) {
          doc[headers[j]] = values[j];
        }
        
        cache[collection].push(doc);
      }
      
      return cache[collection];
    },
    
    // Parst eine CSV-Zeile und berücksichtigt Anführungszeichen
    parseCSVLine(line) {
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      return values;
    },
    
    // Lädt Indizes für eine Collection
    async loadIndexes(collection) {
      indexes[collection] = {};
      
      // Definiere Indizes basierend auf der Collection
      if (collection === 'trades') {
        const indexFile = path.join(dataDir, collection, 'index_selector_time.json');
        if (fs.existsSync(indexFile)) {
          const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
          indexes[collection]['selector_time'] = indexData.entries;
        } else {
          indexes[collection]['selector_time'] = {};
          await this.rebuildIndex(collection, 'selector_time', ['selector', 'time']);
        }
      } else if (collection === 'resume_markers') {
        const indexFile = path.join(dataDir, collection, 'index_selector_to.json');
        if (fs.existsSync(indexFile)) {
          const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
          indexes[collection]['selector_to'] = indexData.entries;
        } else {
          indexes[collection]['selector_to'] = {};
          await this.rebuildIndex(collection, 'selector_to', ['selector', 'to']);
        }
      }
    },
    
    // Baut einen Index für eine Collection neu auf
    async rebuildIndex(collection, indexName, fields) {
      const docs = cache[collection];
      const index = {};
      
      for (const doc of docs) {
        const key = fields.map(field => doc[field]).join('_');
        index[key] = doc.id;
      }
      
      indexes[collection][indexName] = index;
      
      // Speichere Index in Datei
      const indexFile = path.join(dataDir, collection, `index_${indexName}.json`);
      const indexData = {
        index_name: indexName,
        fields: fields,
        entries: index
      };
      
      fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
      return index;
    },
    
    // Synchronisiert alle Collections mit dem Dateisystem
    async syncAll() {
      for (const collection of collections) {
        await this.syncCollection(collection);
      }
    },
    
    // Synchronisiert eine Collection mit dem Dateisystem
    async syncCollection(collection) {
      const csvFile = path.join(dataDir, collection, `${collection}.csv`);
      const headers = this.getHeadersForCollection(collection);
      
      let content = headers.join(',') + '\n';
      
      for (const doc of cache[collection]) {
        const values = headers.map(header => {
          const value = doc[header];
          // Umschließe Werte mit Kommas oder Anführungszeichen mit Anführungszeichen
          if (value && (String(value).includes(',') || String(value).includes('"'))) {
            return `"${String(value).replace(/"/g, '""')}"`;
          }
          return value !== undefined ? value : '';
        });
        
        content += values.join(',') + '\n';
      }
      
      fs.writeFileSync(csvFile, content);
      
      // Aktualisiere Indizes, falls vorhanden
      if (collection === 'trades') {
        await this.rebuildIndex(collection, 'selector_time', ['selector', 'time']);
      } else if (collection === 'resume_markers') {
        await this.rebuildIndex(collection, 'selector_to', ['selector', 'to']);
      }
    }
  };
};
```

### CSV-Collection-Service

```javascript
// csv-collection-service.js
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
```

### CSV-Adapter

```javascript
// csv-adapter.js
module.exports = {
  // Findet Dokumente basierend auf einer MongoDB-ähnlichen Abfrage
  findDocuments(documents, query = {}, options = {}) {
    if (!documents || !Array.isArray(documents)) {
      return [];
    }
    
    let results = [...documents];
    
    // Filtere Dokumente basierend auf der Abfrage
    if (Object.keys(query).length > 0) {
      results = results.filter(doc => this.matchesQuery(doc, query));
    }
    
    // Sortiere Dokumente, falls sort-Option angegeben
    if (options.sort) {
      results = this.sortDocuments(results, options.sort);
    }
    
    // Wende skip an, falls angegeben
    if (options.skip) {
      results = results.slice(options.skip);
    }
    
    // Wende limit an, falls angegeben
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  },
  
  // Prüft, ob ein Dokument einer Abfrage entspricht
  matchesQuery(doc, query) {
    for (const key in query) {
      if (key === '$or') {
        // $or-Operator
        if (!query[key].some(subQuery => this.matchesQuery(doc, subQuery))) {
          return false;
        }
      } else if (key === '$and') {
        // $and-Operator
        if (!query[key].every(subQuery => this.matchesQuery(doc, subQuery))) {
          return false;
        }
      } else if (typeof query[key] === 'object' && query[key] !== null) {
        // Operator-Abfragen
        for (const op in query[key]) {
          switch (op) {
            case '$gt':
              if (!(doc[key] > query[key][op])) return false;
              break;
            case '$gte':
              if (!(doc[key] >= query[key][op])) return false;
              break;
            case '$lt':
              if (!(doc[key] < query[key][op])) return false;
              break;
            case '$lte':
              if (!(doc[key] <= query[key][op])) return false;
              break;
            case '$ne':
              if (doc[key] === query[key][op]) return false;
              break;
            case '$in':
              if (!query[key][op].includes(doc[key])) return false;
              break;
            case '$nin':
              if (query[key][op].includes(doc[key])) return false;
              break;
            // Weitere Operatoren nach Bedarf
          }
        }
      } else {
        // Einfache Gleichheitsabfrage
        if (doc[key] !== query[key]) {
          return false;
        }
      }
    }
    
    return true;
  },
  
  // Sortiert Dokumente basierend auf MongoDB-ähnlichen Sortieroptionen
  sortDocuments(documents, sortOptions) {
    return [...documents].sort((a, b) => {
      for (const key in sortOptions) {
        const direction = sortOptions[key];
        
        if (a[key] < b[key]) {
          return direction === 1 ? -1 : 1;
        } else if (a[key] > b[key]) {
          return direction === 1 ? 1 : -1;
        }
      }
      
      return 0;
    });
  }
};
```

## Abhängigkeiten

Die CSV-Datenbankschnittstelle benötigt folgende zusätzliche Abhängigkeiten:

- **mkdirp**: Zum Erstellen verschachtelter Verzeichnisse
- **uuid**: Zum Generieren eindeutiger IDs

Diese Abhängigkeiten müssen in der package.json hinzugefügt und installiert werden.
