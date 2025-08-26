# Zenbot Alternative Datenbankschnittstellen

Dieses Paket enthält alternative Datenbankschnittstellen für Zenbot:

1. **SQL-Datenbankschnittstelle**: Ermöglicht die Verwendung von SQL-Datenbanken (SQLite, MySQL, PostgreSQL, MS SQL) anstelle von MongoDB.
2. **CSV-Datenbankschnittstelle**: Ermöglicht die Speicherung von Daten in CSV-Dateien anstelle von MongoDB.

## Installation

1. Kopieren Sie die Dateien aus dem `lib/db` Verzeichnis in das entsprechende Verzeichnis Ihrer Zenbot-Installation.
2. Ersetzen Sie die `boot.js` Datei mit der mitgelieferten `boot-modified.js` oder passen Sie Ihre bestehende `boot.js` entsprechend an.
3. Installieren Sie die erforderlichen Abhängigkeiten:

```bash
npm install --save sequelize sqlite3 mysql2 pg tedious mkdirp uuid
```

## Konfiguration

### SQL-Datenbankschnittstelle

Fügen Sie folgende Konfiguration zu Ihrer `conf.js` hinzu:

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

### CSV-Datenbankschnittstelle

Fügen Sie folgende Konfiguration zu Ihrer `conf.js` hinzu:

```javascript
c.db = {}
c.db.type = 'csv' // Kann 'mongo', 'sql' oder 'csv' sein
c.db.csv = {}
c.db.csv.dataDir = './data/csv' // Verzeichnis für CSV-Dateien
c.db.csv.indexing = true // Ob Indizes erstellt werden sollen
c.db.csv.caching = true // Ob Daten im Speicher gecacht werden sollen
c.db.csv.syncInterval = 5000 // Intervall in ms für Synchronisierung mit Dateisystem
```

## Verwendung

Nach der Installation und Konfiguration können Sie Zenbot wie gewohnt verwenden. Die alternative Datenbankschnittstelle wird automatisch basierend auf Ihrer Konfiguration verwendet.

## Hinweise

- Die SQL-Datenbankschnittstelle erstellt automatisch die erforderlichen Tabellen und Indizes.
- Die CSV-Datenbankschnittstelle erstellt automatisch die erforderlichen Verzeichnisse und Dateien.
- Beide Schnittstellen sind vollständig kompatibel mit der bestehenden MongoDB-Schnittstelle und können ohne Änderungen an der Zenbot-Logik verwendet werden.

## Unterstützte Datenbanken (SQL)

- SQLite
- MySQL
- PostgreSQL
- Microsoft SQL Server

## Limitierungen

- Die CSV-Datenbankschnittstelle ist für kleinere Datenmengen optimiert und kann bei großen Datenmengen langsamer sein.
- Die SQL-Datenbankschnittstelle unterstützt nicht alle MongoDB-spezifischen Abfrageoperatoren.
