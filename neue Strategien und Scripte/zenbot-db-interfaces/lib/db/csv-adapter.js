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
