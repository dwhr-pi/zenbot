# API-Referenz - Zebot API

Diese Dokumentation bietet eine vollständige Referenz aller verfügbaren Methoden und Funktionen der Zebot API.

## Inhaltsverzeichnis

1. [Konstruktor](#konstruktor)
2. [Marktdaten-Methoden](#marktdaten-methoden)
3. [Trading-Methoden](#trading-methoden)
4. [Konto-Methoden](#konto-methoden)
5. [Utility-Methoden](#utility-methoden)
6. [Fehlerbehandlung](#fehlerbehandlung)
7. [Datenstrukturen](#datenstrukturen)

## Konstruktor

### `new ZebotAPI(exchangeId, apiKey, secret, options)`

Erstellt eine neue Instanz der Zebot API für eine spezifische Börse.

**Parameter:**
- `exchangeId` (string): ID der Börse (z.B. 'binance', 'coinbase', 'kraken')
- `apiKey` (string, optional): API-Schlüssel für authentifizierte Operationen
- `secret` (string, optional): Secret-Schlüssel für authentifizierte Operationen
- `options` (object, optional): Zusätzliche Konfigurationsoptionen

**Optionen:**
- `timeout` (number): Timeout für API-Aufrufe in Millisekunden (Standard: 30000)
- `enableRateLimit` (boolean): Rate-Limiting aktivieren (Standard: true)
- `sandbox` (boolean): Sandbox-Modus aktivieren (Standard: false)

**Beispiel:**
```javascript
// Öffentliche API ohne Authentifizierung
const api = new ZebotAPI('binance');

// Authentifizierte API
const authApi = new ZebotAPI('binance', 'your_api_key', 'your_secret');

// Mit benutzerdefinierten Optionen
const customApi = new ZebotAPI('binance', 'key', 'secret', {
    timeout: 60000,
    sandbox: true
});
```

**Wirft:**
- `Error`: Wenn die angegebene Börse nicht unterstützt wird

## Marktdaten-Methoden

### `loadMarkets(reload)`

Lädt die verfügbaren Märkte der Börse.

**Parameter:**
- `reload` (boolean, optional): Erzwingt das Neuladen der Märkte (Standard: false)

**Rückgabe:**
```javascript
{
    success: boolean,
    data: object,      // Märkte-Objekt
    timestamp: number,
    exchange: string
}
```

**Beispiel:**
```javascript
const result = await api.loadMarkets();
if (result.success) {
    console.log('Verfügbare Märkte:', Object.keys(result.data));
}
```

### `fetchTicker(symbol, params)`

Holt Ticker-Daten für ein spezifisches Handelspaar.

**Parameter:**
- `symbol` (string): Handelspaar (z.B. 'BTC/USDT')
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        symbol: string,
        timestamp: number,
        datetime: string,
        high: number,
        low: number,
        bid: number,
        ask: number,
        last: number,
        close: number,
        baseVolume: number,
        quoteVolume: number,
        // ... weitere Ticker-Daten
    },
    timestamp: number,
    exchange: string
}
```

### `fetchTickers(symbols, params)`

Holt Ticker-Daten für mehrere oder alle Handelspaare.

**Parameter:**
- `symbols` (array, optional): Array von Handelspaaren
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: object,      // Objekt mit Ticker-Daten für jedes Symbol
    timestamp: number,
    exchange: string
}
```

### `fetchOrderBook(symbol, limit, params)`

Holt das Orderbuch für ein Handelspaar.

**Parameter:**
- `symbol` (string): Handelspaar
- `limit` (number, optional): Maximale Anzahl von Bids/Asks
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        symbol: string,
        bids: [[price, amount], ...],
        asks: [[price, amount], ...],
        timestamp: number,
        datetime: string
    },
    timestamp: number,
    exchange: string
}
```

### `fetchOHLCV(symbol, timeframe, since, limit, params)`

Holt OHLCV-Daten (Kerzenchart-Daten) für ein Handelspaar.

**Parameter:**
- `symbol` (string): Handelspaar
- `timeframe` (string): Zeitrahmen ('1m', '5m', '15m', '1h', '4h', '1d', etc.)
- `since` (number, optional): Zeitstempel ab wann
- `limit` (number, optional): Maximale Anzahl von Kerzen
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: [
        [timestamp, open, high, low, close, volume],
        // ... weitere Kerzen
    ],
    timestamp: number,
    exchange: string
}
```

### `fetchTrades(symbol, since, limit, params)`

Holt die letzten öffentlichen Trades für ein Handelspaar.

**Parameter:**
- `symbol` (string): Handelspaar
- `since` (number, optional): Zeitstempel ab wann
- `limit` (number, optional): Maximale Anzahl von Trades
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: [
        {
            id: string,
            timestamp: number,
            datetime: string,
            symbol: string,
            side: string,
            amount: number,
            price: number,
            cost: number
        },
        // ... weitere Trades
    ],
    timestamp: number,
    exchange: string
}
```

## Trading-Methoden

### `createOrder(symbol, type, side, amount, price, params)`

Erstellt eine neue Order.

**Parameter:**
- `symbol` (string): Handelspaar (z.B. 'BTC/USDT')
- `type` (string): Order-Typ ('market', 'limit')
- `side` (string): Seite ('buy', 'sell')
- `amount` (number): Menge
- `price` (number, optional): Preis (erforderlich für Limit-Orders)
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        id: string,
        timestamp: number,
        datetime: string,
        symbol: string,
        type: string,
        side: string,
        amount: number,
        price: number,
        cost: number,
        status: string,
        // ... weitere Order-Daten
    },
    timestamp: number,
    exchange: string
}
```

**Beispiel:**
```javascript
// Market-Order
const marketOrder = await api.createOrder('BTC/USDT', 'market', 'buy', 0.001);

// Limit-Order
const limitOrder = await api.createOrder('BTC/USDT', 'limit', 'buy', 0.001, 50000);
```

### `fetchOpenOrders(symbol, since, limit, params)`

Holt alle offenen Orders.

**Parameter:**
- `symbol` (string, optional): Handelspaar (alle Orders wenn nicht angegeben)
- `since` (number, optional): Zeitstempel ab wann
- `limit` (number, optional): Maximale Anzahl
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: [
        {
            id: string,
            timestamp: number,
            datetime: string,
            symbol: string,
            type: string,
            side: string,
            amount: number,
            price: number,
            cost: number,
            status: string,
            remaining: number,
            filled: number
        },
        // ... weitere Orders
    ],
    timestamp: number,
    exchange: string
}
```

### `fetchClosedOrders(symbol, since, limit, params)`

Holt alle geschlossenen Orders.

**Parameter:**
- `symbol` (string, optional): Handelspaar
- `since` (number, optional): Zeitstempel ab wann
- `limit` (number, optional): Maximale Anzahl
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:** Gleiche Struktur wie `fetchOpenOrders`

### `cancelOrder(id, symbol, params)`

Storniert eine spezifische Order.

**Parameter:**
- `id` (string): Order-ID
- `symbol` (string, optional): Handelspaar
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        id: string,
        status: string,
        // ... weitere Order-Daten
    },
    timestamp: number,
    exchange: string
}
```

### `cancelAllOrders(symbol, params)`

Storniert alle offenen Orders.

**Parameter:**
- `symbol` (string, optional): Handelspaar (alle Orders wenn nicht angegeben)
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: [
        // Array von stornierten Orders
    ],
    timestamp: number,
    exchange: string
}
```

## Konto-Methoden

### `fetchBalance()`

Holt das aktuelle Kontoguthaben.

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        info: object,      // Rohe Antwort der Börse
        free: object,      // Verfügbare Guthaben
        used: object,      // Verwendete Guthaben
        total: object,     // Gesamtguthaben
        // Für jede Währung:
        'BTC': {
            free: number,
            used: number,
            total: number
        },
        // ...
    },
    timestamp: number,
    exchange: string
}
```

### `fetchMyTrades(symbol, since, limit, params)`

Holt die eigenen Trades.

**Parameter:**
- `symbol` (string, optional): Handelspaar
- `since` (number, optional): Zeitstempel ab wann
- `limit` (number, optional): Maximale Anzahl
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: [
        {
            id: string,
            order: string,
            timestamp: number,
            datetime: string,
            symbol: string,
            side: string,
            amount: number,
            price: number,
            cost: number,
            fee: {
                cost: number,
                currency: string
            }
        },
        // ... weitere Trades
    ],
    timestamp: number,
    exchange: string
}
```

### `fetchDepositAddress(code, params)`

Holt die Einzahlungsadresse für eine Währung.

**Parameter:**
- `code` (string): Währungscode (z.B. 'BTC', 'ETH')
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        currency: string,
        address: string,
        tag: string,       // Falls erforderlich (z.B. für XRP)
        network: string
    },
    timestamp: number,
    exchange: string
}
```

### `withdraw(code, amount, address, tag, params)`

Erstellt eine Auszahlungsanfrage.

**Parameter:**
- `code` (string): Währungscode
- `amount` (number): Auszahlungsbetrag
- `address` (string): Zieladresse
- `tag` (string, optional): Tag/Memo (falls erforderlich)
- `params` (object, optional): Zusätzliche Parameter

**Rückgabe:**
```javascript
{
    success: boolean,
    data: {
        id: string,
        txid: string,
        timestamp: number,
        datetime: string,
        currency: string,
        amount: number,
        address: string,
        tag: string,
        status: string,
        fee: {
            cost: number,
            currency: string
        }
    },
    timestamp: number,
    exchange: string
}
```

## Utility-Methoden

### `getExchangeInfo()`

Gibt detaillierte Informationen über die Börse zurück.

**Rückgabe:**
```javascript
{
    id: string,
    name: string,
    countries: array,
    urls: object,
    version: string,
    has: object,           // Unterstützte Features
    timeframes: object,    // Verfügbare Zeitrahmen
    fees: object,          // Gebührenstruktur
    limits: object,        // Limits für Orders
    precision: object      // Präzision für Preise/Mengen
}
```

### `static getAvailableExchanges()`

Gibt eine Liste aller verfügbaren Börsen zurück.

**Rückgabe:**
```javascript
[
    'binance',
    'coinbase',
    'kraken',
    // ... alle unterstützten Börsen
]
```

### `hasFeature(feature)`

Prüft, ob eine bestimmte Funktion von der Börse unterstützt wird.

**Parameter:**
- `feature` (string): Name der Funktion (z.B. 'fetchOHLCV', 'createOrder')

**Rückgabe:**
```javascript
boolean
```

### `setSandboxMode(enabled)`

Aktiviert oder deaktiviert den Sandbox-Modus.

**Parameter:**
- `enabled` (boolean): Sandbox-Modus aktivieren/deaktivieren

**Hinweis:** Nur verfügbar, wenn die Börse einen Sandbox-Modus unterstützt.

## Fehlerbehandlung

Alle API-Methoden geben ein einheitliches Antwortformat zurück. Bei Fehlern wird `success: false` gesetzt und detaillierte Fehlerinformationen bereitgestellt.

### Fehlerstruktur

```javascript
{
    success: false,
    error: {
        type: string,        // Fehlertyp
        message: string,     // Fehlermeldung
        operation: string,   // Name der fehlgeschlagenen Operation
        exchange: string,    // Börsen-ID
        timestamp: number    // Zeitstempel des Fehlers
    }
}
```

### Fehlertypen

- `NetworkError`: Netzwerk- oder Verbindungsfehler
- `ExchangeError`: Allgemeiner Börsenfehler
- `AuthenticationError`: Authentifizierungsfehler
- `PermissionDenied`: Keine Berechtigung für die Operation
- `InsufficientFunds`: Unzureichende Mittel
- `InvalidOrder`: Ungültige Order-Parameter
- `OrderNotFound`: Order nicht gefunden
- `RateLimitExceeded`: Rate-Limit überschritten
- `UnknownError`: Unbekannter Fehler

### Fehlerbehandlung-Beispiel

```javascript
const result = await api.createOrder('BTC/USDT', 'limit', 'buy', 0.001, 50000);

if (result.success) {
    console.log('Order erstellt:', result.data.id);
} else {
    console.error('Fehler beim Erstellen der Order:');
    console.error('Typ:', result.error.type);
    console.error('Nachricht:', result.error.message);
    
    // Spezifische Fehlerbehandlung
    switch (result.error.type) {
        case 'InsufficientFunds':
            console.log('Nicht genügend Guthaben verfügbar');
            break;
        case 'InvalidOrder':
            console.log('Ungültige Order-Parameter');
            break;
        case 'RateLimitExceeded':
            console.log('Rate-Limit erreicht, bitte warten');
            break;
        default:
            console.log('Unerwarteter Fehler aufgetreten');
    }
}
```

## Datenstrukturen

### Ticker

```javascript
{
    symbol: string,        // Handelspaar
    timestamp: number,     // Zeitstempel
    datetime: string,      // ISO-Datum
    high: number,          // 24h Höchstpreis
    low: number,           // 24h Tiefstpreis
    bid: number,           // Höchstes Gebot
    ask: number,           // Niedrigstes Angebot
    last: number,          // Letzter Preis
    close: number,         // Schlusspreis
    baseVolume: number,    // Volumen in Basiswährung
    quoteVolume: number,   // Volumen in Kurswährung
    percentage: number,    // 24h Preisänderung in %
    change: number,        // 24h Preisänderung absolut
    average: number,       // Durchschnittspreis
    open: number,          // Eröffnungspreis
    previousClose: number  // Vorheriger Schlusspreis
}
```

### Order

```javascript
{
    id: string,            // Order-ID
    clientOrderId: string, // Client-Order-ID
    timestamp: number,     // Erstellungszeitpunkt
    datetime: string,      // ISO-Datum
    lastTradeTimestamp: number, // Letzter Trade
    symbol: string,        // Handelspaar
    type: string,          // Order-Typ (market, limit)
    side: string,          // Seite (buy, sell)
    amount: number,        // Bestellte Menge
    price: number,         // Preis
    cost: number,          // Gesamtkosten
    average: number,       // Durchschnittspreis
    filled: number,        // Ausgeführte Menge
    remaining: number,     // Verbleibende Menge
    status: string,        // Status (open, closed, canceled)
    fee: {                 // Gebühren
        cost: number,
        currency: string
    },
    trades: array,         // Zugehörige Trades
    info: object          // Rohe Börsenantwort
}
```

### Trade

```javascript
{
    id: string,            // Trade-ID
    order: string,         // Zugehörige Order-ID
    timestamp: number,     // Zeitstempel
    datetime: string,      // ISO-Datum
    symbol: string,        // Handelspaar
    side: string,          // Seite (buy, sell)
    amount: number,        // Gehandelte Menge
    price: number,         // Preis
    cost: number,          // Gesamtkosten
    fee: {                 // Gebühren
        cost: number,
        currency: string,
        rate: number
    },
    info: object          // Rohe Börsenantwort
}
```

### Balance

```javascript
{
    info: object,          // Rohe Börsenantwort
    free: object,          // Verfügbare Guthaben
    used: object,          // Verwendete Guthaben
    total: object,         // Gesamtguthaben
    
    // Für jede Währung:
    'BTC': {
        free: number,      // Verfügbar
        used: number,      // Verwendet (in Orders)
        total: number      // Gesamt
    },
    'ETH': {
        free: number,
        used: number,
        total: number
    }
    // ... weitere Währungen
}
```

---

Diese API-Referenz bietet eine vollständige Übersicht über alle verfügbaren Funktionen der Zebot API. Für praktische Beispiele siehe [examples.md](examples.md).

