/**
 * Logger für Zenbot Multi-Trading
 * 
 * Stellt Logging-Funktionalität für das Multi-Trading-System bereit.
 */

const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor(logLevel = 'info', logPath = './logs') {
    this.logLevel = logLevel;
    this.logPath = logPath;
    this.logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  /**
   * Initialisiert den Logger
   */
  async init() {
    try {
      // Logverzeichnis erstellen, falls es nicht existiert
      await fs.mkdir(this.logPath, { recursive: true });
      return true;
    } catch (error) {
      console.error(`Fehler bei der Initialisierung des Loggers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Schreibt eine Lognachricht
   */
  async log(level, message) {
    try {
      // Prüfen, ob das Loglevel ausreichend ist
      if (this.logLevels[level] < this.logLevels[this.logLevel]) {
        return;
      }

      // Zeitstempel erstellen
      const timestamp = new Date().toISOString();

      // Lognachricht formatieren
      const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;

      // Logdatei bestimmen
      const logFile = path.join(this.logPath, `${level}.log`);

      // Lognachricht in Datei schreiben
      await fs.appendFile(logFile, logMessage, 'utf8');

      // Lognachricht auch auf der Konsole ausgeben
      console.log(logMessage);

      return true;
    } catch (error) {
      console.error(`Fehler beim Schreiben der Lognachricht: ${error.message}`);
      return false;
    }
  }

  /**
   * Schreibt eine Debug-Lognachricht
   */
  async debug(message) {
    return this.log('debug', message);
  }

  /**
   * Schreibt eine Info-Lognachricht
   */
  async info(message) {
    return this.log('info', message);
  }

  /**
   * Schreibt eine Warn-Lognachricht
   */
  async warn(message) {
    return this.log('warn', message);
  }

  /**
   * Schreibt eine Error-Lognachricht
   */
  async error(message) {
    return this.log('error', message);
  }

  /**
   * Erstellt einen Child-Logger für eine bestimmte Komponente
   */
  createChildLogger(component) {
    const childLogger = new Logger(this.logLevel, this.logPath);
    
    // Überschreibe die Log-Methoden, um den Komponentennamen hinzuzufügen
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = async (level, message) => {
      return originalLog(level, `[${component}] ${message}`);
    };
    
    return childLogger;
  }
}

module.exports = Logger;
