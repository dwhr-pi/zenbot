/**
 * Konfigurationsmanager für Zenbot Multi-Trading
 * 
 * Verwaltet die Konfiguration für das Multi-Trading-System,
 * einschließlich der Einstellungen für verschiedene Coins und Börsen.
 */

const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
    this.defaultConfig = {
      instances: [],
      globalSettings: {
        maxParallelInstances: 10,
        defaultRiskParams: {
          maxPositionSize: 0.05,
          maxOpenPositions: 3,
          maxDailyLoss: 0.03
        },
        logLevel: 'info',
        monitoringInterval: 60000
      }
    };
  }

  /**
   * Lädt die Konfiguration aus der Datei
   */
  async load() {
    try {
      // Prüfen, ob die Konfigurationsdatei existiert
      try {
        await fs.access(this.configPath);
      } catch (error) {
        // Konfigurationsdatei existiert nicht, erstelle Standardkonfiguration
        await this.createDefaultConfig();
      }

      // Konfiguration laden
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);

      return this.config;
    } catch (error) {
      throw new Error(`Fehler beim Laden der Konfiguration: ${error.message}`);
    }
  }

  /**
   * Speichert die Konfiguration in der Datei
   */
  async save(config = null) {
    try {
      // Wenn keine Konfiguration übergeben wurde, aktuelle Konfiguration speichern
      const configToSave = config || this.config;

      // Konfiguration speichern
      await fs.writeFile(this.configPath, JSON.stringify(configToSave, null, 2), 'utf8');

      // Konfiguration aktualisieren
      this.config = configToSave;

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Speichern der Konfiguration: ${error.message}`);
    }
  }

  /**
   * Erstellt die Standardkonfiguration
   */
  async createDefaultConfig() {
    try {
      // Verzeichnis erstellen, falls es nicht existiert
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });

      // Standardkonfiguration speichern
      await this.save(this.defaultConfig);

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Erstellen der Standardkonfiguration: ${error.message}`);
    }
  }

  /**
   * Gibt die aktuelle Konfiguration zurück
   */
  getConfig() {
    return this.config || this.defaultConfig;
  }

  /**
   * Fügt eine neue Trading-Instanz zur Konfiguration hinzu
   */
  async addInstance(instanceConfig) {
    try {
      // Konfiguration laden, falls noch nicht geladen
      if (!this.config) {
        await this.load();
      }

      // Prüfen, ob die Instanz bereits existiert
      const existingIndex = this.config.instances.findIndex(
        inst => inst.exchange === instanceConfig.exchange && 
                inst.coin === instanceConfig.coin && 
                inst.strategy === instanceConfig.strategy
      );

      if (existingIndex !== -1) {
        throw new Error(`Trading-Instanz für ${instanceConfig.coin} auf ${instanceConfig.exchange} mit Strategie ${instanceConfig.strategy} existiert bereits`);
      }

      // Instanz zur Konfiguration hinzufügen
      this.config.instances.push(instanceConfig);

      // Konfiguration speichern
      await this.save();

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Hinzufügen der Trading-Instanz: ${error.message}`);
    }
  }

  /**
   * Entfernt eine Trading-Instanz aus der Konfiguration
   */
  async removeInstance(exchange, coin, strategy) {
    try {
      // Konfiguration laden, falls noch nicht geladen
      if (!this.config) {
        await this.load();
      }

      // Instanz in der Konfiguration suchen
      const instanceIndex = this.config.instances.findIndex(
        inst => inst.exchange === exchange && 
                inst.coin === coin && 
                inst.strategy === strategy
      );

      if (instanceIndex === -1) {
        throw new Error(`Trading-Instanz für ${coin} auf ${exchange} mit Strategie ${strategy} nicht gefunden`);
      }

      // Instanz aus der Konfiguration entfernen
      this.config.instances.splice(instanceIndex, 1);

      // Konfiguration speichern
      await this.save();

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Entfernen der Trading-Instanz: ${error.message}`);
    }
  }

  /**
   * Aktualisiert die Konfiguration einer Trading-Instanz
   */
  async updateInstance(exchange, coin, strategy, newConfig) {
    try {
      // Konfiguration laden, falls noch nicht geladen
      if (!this.config) {
        await this.load();
      }

      // Instanz in der Konfiguration suchen
      const instanceIndex = this.config.instances.findIndex(
        inst => inst.exchange === exchange && 
                inst.coin === coin && 
                inst.strategy === strategy
      );

      if (instanceIndex === -1) {
        throw new Error(`Trading-Instanz für ${coin} auf ${exchange} mit Strategie ${strategy} nicht gefunden`);
      }

      // Instanz-Konfiguration aktualisieren
      this.config.instances[instanceIndex] = {
        ...this.config.instances[instanceIndex],
        ...newConfig
      };

      // Konfiguration speichern
      await this.save();

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Aktualisieren der Trading-Instanz: ${error.message}`);
    }
  }

  /**
   * Aktualisiert die globalen Einstellungen
   */
  async updateGlobalSettings(newSettings) {
    try {
      // Konfiguration laden, falls noch nicht geladen
      if (!this.config) {
        await this.load();
      }

      // Globale Einstellungen aktualisieren
      this.config.globalSettings = {
        ...this.config.globalSettings,
        ...newSettings
      };

      // Konfiguration speichern
      await this.save();

      return true;
    } catch (error) {
      throw new Error(`Fehler beim Aktualisieren der globalen Einstellungen: ${error.message}`);
    }
  }

  /**
   * Validiert eine Instanz-Konfiguration
   */
  validateInstanceConfig(instanceConfig) {
    // Pflichtfelder prüfen
    const requiredFields = ['exchange', 'coin', 'strategy'];
    for (const field of requiredFields) {
      if (!instanceConfig[field]) {
        throw new Error(`Pflichtfeld ${field} fehlt in der Instanz-Konfiguration`);
      }
    }

    // API-Schlüssel prüfen, falls vorhanden
    if (instanceConfig.apiKey && !instanceConfig.apiSecret) {
      throw new Error('API-Secret fehlt, obwohl API-Key angegeben wurde');
    }

    // Strategie-Parameter prüfen, falls vorhanden
    if (instanceConfig.strategy && !instanceConfig.strategyParams) {
      throw new Error(`Strategie-Parameter für ${instanceConfig.strategy} fehlen`);
    }

    return true;
  }
}

module.exports = ConfigManager;
