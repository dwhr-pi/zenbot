const { Op } = require('sequelize');

// SQL-Adapter zum Konvertieren von MongoDB-Abfragen in Sequelize-Abfragen
module.exports = {
  // Konvertiert MongoDB-Abfragen in Sequelize-Abfragen
  convertQuery(mongoQuery) {
    if (!mongoQuery) return {};
    
    const sequelizeQuery = {
      where: {}
    };
    
    // Einfache Gleichheitsabfragen
    Object.keys(mongoQuery).forEach(key => {
      if (typeof mongoQuery[key] !== 'object') {
        sequelizeQuery.where[key] = mongoQuery[key];
      } else if (mongoQuery[key] !== null) {
        // MongoDB-Operatoren in Sequelize-Operatoren umwandeln
        Object.keys(mongoQuery[key]).forEach(op => {
          switch(op) {
            case '$gt':
              sequelizeQuery.where[key] = { [Op.gt]: mongoQuery[key][op] };
              break;
            case '$gte':
              sequelizeQuery.where[key] = { [Op.gte]: mongoQuery[key][op] };
              break;
            case '$lt':
              sequelizeQuery.where[key] = { [Op.lt]: mongoQuery[key][op] };
              break;
            case '$lte':
              sequelizeQuery.where[key] = { [Op.lte]: mongoQuery[key][op] };
              break;
            case '$ne':
              sequelizeQuery.where[key] = { [Op.ne]: mongoQuery[key][op] };
              break;
            case '$in':
              sequelizeQuery.where[key] = { [Op.in]: mongoQuery[key][op] };
              break;
            case '$nin':
              sequelizeQuery.where[key] = { [Op.notIn]: mongoQuery[key][op] };
              break;
            case '$or':
              sequelizeQuery.where[Op.or] = mongoQuery[key][op].map(item => this.convertQuery(item).where);
              break;
            case '$and':
              sequelizeQuery.where[Op.and] = mongoQuery[key][op].map(item => this.convertQuery(item).where);
              break;
            // Weitere Operatoren nach Bedarf
          }
        });
      }
    });
    
    return sequelizeQuery;
  },
  
  // Konvertiert MongoDB-Update-Operationen in Sequelize-Updates
  convertUpdate(mongoUpdate) {
    if (!mongoUpdate) return {};
    
    const sequelizeUpdate = {};
    
    // $set Operator
    if (mongoUpdate.$set) {
      Object.assign(sequelizeUpdate, mongoUpdate.$set);
    }
    
    // $inc Operator
    if (mongoUpdate.$inc) {
      Object.keys(mongoUpdate.$inc).forEach(key => {
        sequelizeUpdate[key] = Sequelize.literal(`${key} + ${mongoUpdate.$inc[key]}`);
      });
    }
    
    // Weitere Update-Operatoren nach Bedarf
    
    return sequelizeUpdate;
  },
  
  // Konvertiert MongoDB-Sortieroptionen in Sequelize-Sortieroptionen
  convertSort(mongoSort) {
    if (!mongoSort) return [];
    
    const sequelizeSort = [];
    
    Object.keys(mongoSort).forEach(key => {
      sequelizeSort.push([key, mongoSort[key] === 1 ? 'ASC' : 'DESC']);
    });
    
    return sequelizeSort;
  }
};
