# Installation - Zebot API

Diese Anleitung führt Sie durch die Installation und Einrichtung der Zebot API für Ihr Projekt.

## Systemanforderungen

### Node.js Version
- **Mindestversion**: Node.js 14.0.0 oder höher
- **Empfohlene Version**: Node.js 18.0.0 oder höher
- **NPM Version**: 6.0.0 oder höher

### Betriebssystem
- Windows 10/11
- macOS 10.15 oder höher
- Linux (Ubuntu 18.04+, CentOS 7+, oder äquivalent)

### Hardware
- **RAM**: Mindestens 512 MB verfügbarer Arbeitsspeicher
- **Speicherplatz**: 100 MB für die Installation
- **Netzwerk**: Stabile Internetverbindung für API-Aufrufe

## Installationsmethoden

### Methode 1: Direkte Installation (Empfohlen)

1. **Projekt herunterladen**
   ```bash
   # Laden Sie die zebot-api.zip Datei herunter und entpacken Sie sie
   unzip zebot-api.zip
   cd zebot-api
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Installation verifizieren**
   ```bash
   node -e "const ZebotAPI = require('./zebot_api'); console.log('Installation erfolgreich!');"
   ```

### Methode 2: In bestehendes Projekt integrieren

1. **Dateien kopieren**
   ```bash
   # Kopieren Sie zebot_api.js in Ihr Projektverzeichnis
   cp zebot_api.js /pfad/zu/ihrem/projekt/
   ```

2. **CCXT-Abhängigkeit hinzufügen**
   ```bash
   cd /pfad/zu/ihrem/projekt
   npm install ccxt
   ```

3. **In Ihrem Code verwenden**
   ```javascript
   const ZebotAPI = require('./zebot_api');
   ```

### Methode 3: Als NPM-Paket (Lokale Installation)

1. **Package.json erstellen** (falls nicht vorhanden)
   ```bash
   npm init -y
   ```

2. **Lokales Paket installieren**
   ```bash
   npm install ./pfad/zur/zebot-api
   ```

3. **Verwenden**
   ```javascript
   const ZebotAPI = require('zebot-api');
   ```

## Konfiguration

### Umgebungsvariablen

Für Sicherheit empfiehlt es sich, API-Schlüssel als Umgebungsvariablen zu speichern:

#### Windows
```cmd
set BINANCE_API_KEY=ihr_api_schluessel
set BINANCE_SECRET=ihr_secret_schluessel
```

#### macOS/Linux
```bash
export BINANCE_API_KEY=ihr_api_schluessel
export BINANCE_SECRET=ihr_secret_schluessel
```

#### .env Datei (Empfohlen)
```bash
# .env Datei erstellen
npm install dotenv
```

```javascript
// .env Datei
BINANCE_API_KEY=ihr_api_schluessel
BINANCE_SECRET=ihr_secret_schluessel
COINBASE_API_KEY=ihr_coinbase_schluessel
COINBASE_SECRET=ihr_coinbase_secret
```

```javascript
// In Ihrem Code
require('dotenv').config();

const api = new ZebotAPI('binance', 
    process.env.BINANCE_API_KEY, 
    process.env.BINANCE_SECRET
);
```

### Konfigurationsdatei

Erstellen Sie eine `config.js` Datei für erweiterte Konfiguration:

```javascript
// config.js
module.exports = {
    exchanges: {
        binance: {
            apiKey: process.env.BINANCE_API_KEY,
            secret: process.env.BINANCE_SECRET,
            sandbox: false,
            timeout: 30000
        },
        coinbase: {
            apiKey: process.env.COINBASE_API_KEY,
            secret: process.env.COINBASE_SECRET,
            passphrase: process.env.COINBASE_PASSPHRASE,
            sandbox: true
        }
    },
    defaultOptions: {
        enableRateLimit: true,
        timeout: 30000
    }
};
```

## Erste Schritte

### 1. Grundlegende Verwendung testen

```javascript
// test.js
const ZebotAPI = require('./zebot_api');

async function testBasicFunctionality() {
    try {
        // Teste öffentliche API ohne Authentifizierung
        const api = new ZebotAPI('binance');
        
        console.log('Teste Verbindung zur Binance API...');
        const ticker = await api.fetchTicker('BTC/USDT');
        
        if (ticker.success) {
            console.log('✅ Verbindung erfolgreich!');
            console.log('BTC/USDT Preis:', ticker.data.last);
        } else {
            console.log('❌ Verbindung fehlgeschlagen:', ticker.error.message);
        }
    } catch (error) {
        console.error('❌ Fehler:', error.message);
    }
}

testBasicFunctionality();
```

```bash
node test.js
```

### 2. Authentifizierte API testen

```javascript
// auth-test.js
const ZebotAPI = require('./zebot_api');

async function testAuthenticatedAPI() {
    try {
        const api = new ZebotAPI('binance', 
            process.env.BINANCE_API_KEY, 
            process.env.BINANCE_SECRET,
            { sandbox: true } // Verwenden Sie Sandbox für Tests
        );
        
        console.log('Teste authentifizierte API...');
        const balance = await api.fetchBalance();
        
        if (balance.success) {
            console.log('✅ Authentifizierung erfolgreich!');
            console.log('Verfügbare Guthaben:', Object.keys(balance.data.free));
        } else {
            console.log('❌ Authentifizierung fehlgeschlagen:', balance.error.message);
        }
    } catch (error) {
        console.error('❌ Fehler:', error.message);
    }
}

testAuthenticatedAPI();
```

### 3. Verfügbare Börsen anzeigen

```javascript
// exchanges.js
const ZebotAPI = require('./zebot_api');

console.log('Verfügbare Börsen:');
const exchanges = ZebotAPI.getAvailableExchanges();
console.log(`Insgesamt ${exchanges.length} Börsen unterstützt:`);

// Zeige erste 20 Börsen
exchanges.slice(0, 20).forEach((exchange, index) => {
    console.log(`${index + 1}. ${exchange}`);
});

if (exchanges.length > 20) {
    console.log(`... und ${exchanges.length - 20} weitere`);
}
```

## API-Schlüssel einrichten

### Binance

1. **Konto erstellen**: Registrieren Sie sich bei [Binance](https://www.binance.com)
2. **API-Schlüssel erstellen**:
   - Gehen Sie zu "API Management" in Ihren Kontoeinstellungen
   - Klicken Sie auf "Create API"
   - Notieren Sie sich API Key und Secret Key
   - Aktivieren Sie "Enable Spot & Margin Trading" (falls benötigt)
3. **IP-Whitelist** (empfohlen): Fügen Sie Ihre IP-Adresse zur Whitelist hinzu

### Coinbase Pro

1. **Konto erstellen**: Registrieren Sie sich bei [Coinbase Pro](https://pro.coinbase.com)
2. **API-Schlüssel erstellen**:
   - Gehen Sie zu "API" in den Einstellungen
   - Klicken Sie auf "New API Key"
   - Wählen Sie die benötigten Berechtigungen
   - Notieren Sie sich Key, Secret und Passphrase

### Kraken

1. **Konto erstellen**: Registrieren Sie sich bei [Kraken](https://www.kraken.com)
2. **API-Schlüssel erstellen**:
   - Gehen Sie zu "Settings" > "API"
   - Klicken Sie auf "Generate New Key"
   - Wählen Sie die benötigten Berechtigungen
   - Notieren Sie sich API Key und Private Key

## Fehlerbehebung

### Häufige Installationsprobleme

#### Problem: "Module not found: ccxt"
```bash
# Lösung: CCXT installieren
npm install ccxt
```

#### Problem: "Permission denied" (Linux/macOS)
```bash
# Lösung: Mit sudo installieren oder npm-Berechtigungen konfigurieren
sudo npm install
# ODER
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Problem: "Network timeout"
```bash
# Lösung: Timeout erhöhen oder anderen Registry verwenden
npm install --timeout=60000
# ODER
npm install --registry https://registry.npmjs.org/
```

### Häufige API-Probleme

#### Problem: "Invalid API key"
- Überprüfen Sie, ob API-Schlüssel korrekt kopiert wurden
- Stellen Sie sicher, dass keine Leerzeichen am Anfang/Ende stehen
- Überprüfen Sie, ob der Schlüssel aktiviert ist

#### Problem: "IP not whitelisted"
- Fügen Sie Ihre IP-Adresse zur Whitelist der Börse hinzu
- Bei dynamischen IPs: Verwenden Sie keine IP-Whitelist

#### Problem: "Insufficient permissions"
- Überprüfen Sie die Berechtigungen Ihres API-Schlüssels
- Aktivieren Sie "Trading" Berechtigungen falls benötigt

### Debugging

Aktivieren Sie Debug-Modus für detaillierte Logs:

```javascript
const ZebotAPI = require('./zebot_api');

// Debug-Modus aktivieren
const api = new ZebotAPI('binance', apiKey, secret, {
    verbose: true,  // Aktiviert detaillierte Logs
    timeout: 60000  // Erhöht Timeout für langsame Verbindungen
});
```

## Performance-Optimierung

### Rate-Limiting

```javascript
// Optimale Rate-Limiting-Konfiguration
const api = new ZebotAPI('binance', apiKey, secret, {
    enableRateLimit: true,
    rateLimit: 1200  // Millisekunden zwischen Anfragen
});
```

### Connection Pooling

```javascript
// Für mehrere gleichzeitige Verbindungen
const apis = {};

function getAPI(exchangeId) {
    if (!apis[exchangeId]) {
        apis[exchangeId] = new ZebotAPI(exchangeId, apiKey, secret, {
            enableRateLimit: true,
            timeout: 30000
        });
    }
    return apis[exchangeId];
}
```

### Caching

```javascript
// Einfaches Caching für Marktdaten
const cache = new Map();
const CACHE_DURATION = 60000; // 1 Minute

async function getCachedTicker(api, symbol) {
    const key = `${api.exchangeId}-${symbol}`;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    const result = await api.fetchTicker(symbol);
    if (result.success) {
        cache.set(key, {
            data: result,
            timestamp: Date.now()
        });
    }
    
    return result;
}
```

## Sicherheitshinweise

### API-Schlüssel Sicherheit

1. **Niemals in Code einbetten**: Verwenden Sie Umgebungsvariablen
2. **Minimale Berechtigungen**: Aktivieren Sie nur benötigte Berechtigungen
3. **IP-Whitelist**: Beschränken Sie Zugriff auf bekannte IPs
4. **Regelmäßige Rotation**: Erneuern Sie Schlüssel regelmäßig
5. **Sichere Speicherung**: Verwenden Sie verschlüsselte Konfigurationsdateien

### Netzwerk-Sicherheit

```javascript
// HTTPS erzwingen
const api = new ZebotAPI('binance', apiKey, secret, {
    timeout: 30000,
    enableRateLimit: true,
    // Zusätzliche Sicherheitsoptionen
    agent: false,  // Deaktiviert HTTP Agent Pooling
    headers: {
        'User-Agent': 'ZebotAPI/1.0'
    }
});
```

## Produktionsbereitschaft

### Monitoring

```javascript
// Einfaches Monitoring
class MonitoredZebotAPI extends ZebotAPI {
    async executeWithErrorHandling(operation, operationName) {
        const startTime = Date.now();
        const result = await super.executeWithErrorHandling(operation, operationName);
        const duration = Date.now() - startTime;
        
        // Log für Monitoring
        console.log(`[${new Date().toISOString()}] ${operationName} - ${result.success ? 'SUCCESS' : 'ERROR'} - ${duration}ms`);
        
        if (!result.success) {
            // Fehler-Benachrichtigung senden
            this.notifyError(operationName, result.error);
        }
        
        return result;
    }
    
    notifyError(operation, error) {
        // Implementieren Sie hier Ihre Fehler-Benachrichtigung
        // z.B. E-Mail, Slack, etc.
    }
}
```

### Logging

```javascript
// Strukturiertes Logging
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// In Ihrer API-Klasse verwenden
if (!result.success) {
    logger.error('API Error', {
        operation: operationName,
        exchange: this.exchangeId,
        error: result.error
    });
}
```

## Support und Updates

### Community Support
- GitHub Issues: [Repository-Link]
- Discord: [Discord-Server-Link]
- Stack Overflow: Tag `zebot-api`

### Updates
```bash
# Prüfen auf Updates
npm outdated

# CCXT aktualisieren
npm update ccxt

# Zebot API aktualisieren (falls als Paket installiert)
npm update zebot-api
```

### Changelog verfolgen
- Abonnieren Sie GitHub Releases
- Folgen Sie dem offiziellen Blog
- Prüfen Sie regelmäßig die Dokumentation

---

Mit dieser Installationsanleitung sollten Sie in der Lage sein, die Zebot API erfolgreich in Ihrem Projekt zu installieren und zu konfigurieren. Bei weiteren Fragen konsultieren Sie die [API-Referenz](api-reference.md) oder die [Beispiele](examples.md).

