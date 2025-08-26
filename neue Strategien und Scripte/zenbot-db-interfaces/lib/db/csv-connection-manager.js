const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { v4: uuidv4 } = require('uuid');

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
