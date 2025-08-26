# Zenbot Microsoft Access Datenbank

## Einführung

Diese Dokumentation beschreibt die Datenbankstruktur für Zenbot, einen Open-Source-Kryptowährungs-Trading-Bot. Die Datenbank wurde speziell für Microsoft Access entwickelt und bietet eine umfassende Lösung zur Speicherung und Verwaltung von Trading-Daten, Marktinformationen und Bot-Konfigurationen.

## Zweck der Datenbank

Die Zenbot-Datenbank dient folgenden Hauptzwecken:

- **Trading-Verwaltung**: Speicherung aller ausgeführten Trades mit detaillierten Informationen
- **Marktdatenanalyse**: Historische Candlestick-Daten für technische Analysen
- **Portfolio-Tracking**: Überwachung der aktuellen Bestände und Portfoliowerte
- **Strategieverwaltung**: Konfiguration und Verwaltung verschiedener Trading-Strategien
- **Performance-Monitoring**: Verfolgung der Bot-Performance über verschiedene Trading-Sessions
- **Fehlerprotokollierung**: Systematische Erfassung von Fehlern und Systemereignissen

## Systemanforderungen

- Microsoft Access 2016 oder höher
- Windows 10 oder höher
- Mindestens 4 GB RAM
- 500 MB freier Speicherplatz für die Datenbank

## Datenbankstruktur

Die Zenbot-Datenbank besteht aus 9 Haupttabellen, die verschiedene Aspekte des Trading-Bots abdecken:

### 1. Assets (Vermögenswerte)

**Zweck**: Speichert Informationen über verschiedene Kryptowährungen und Trading-Paare.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| AssetID | AUTOINCREMENT | Eindeutige ID für jeden Vermögenswert (Primärschlüssel) |
| Symbol | VARCHAR(20) | Trading-Symbol (z.B. "BTC/USD") |
| Name | VARCHAR(100) | Vollständiger Name der Kryptowährung |
| Exchange | VARCHAR(50) | Name der Börse |
| BaseCurrency | VARCHAR(10) | Basis-Währung des Trading-Paars |
| QuoteCurrency | VARCHAR(10) | Quote-Währung des Trading-Paars |
| IsActive | YESNO | Gibt an, ob der Vermögenswert aktiv gehandelt wird |
| CreatedDate | DATETIME | Erstellungsdatum des Eintrags |
| LastUpdated | DATETIME | Datum der letzten Aktualisierung |

### 2. Strategies (Strategien)

**Zweck**: Verwaltet verschiedene Trading-Strategien und deren Konfigurationen.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| StrategyID | AUTOINCREMENT | Eindeutige ID für jede Strategie (Primärschlüssel) |
| StrategyName | VARCHAR(100) | Name der Trading-Strategie |
| Description | MEMO | Detaillierte Beschreibung der Strategie |
| Parameters | MEMO | JSON-formatierte Parameter der Strategie |
| IsActive | YESNO | Gibt an, ob die Strategie aktiv ist |
| CreatedDate | DATETIME | Erstellungsdatum der Strategie |
| LastUpdated | DATETIME | Datum der letzten Aktualisierung |

### 3. Candlestick_Data (Kerzendiagramm-Daten)

**Zweck**: Speichert historische Preisdaten für technische Analysen.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| CandleID | AUTOINCREMENT | Eindeutige ID für jeden Candlestick (Primärschlüssel) |
| AssetID | LONG | Fremdschlüssel zur Assets-Tabelle |
| Timestamp | DATETIME | Zeitstempel der Kerze |
| OpenPrice | CURRENCY | Eröffnungspreis |
| HighPrice | CURRENCY | Höchstpreis |
| LowPrice | CURRENCY | Tiefstpreis |
| ClosePrice | CURRENCY | Schlusspreis |
| Volume | DOUBLE | Handelsvolumen |
| Timeframe | VARCHAR(10) | Zeitrahmen (z.B. "1m", "5m", "1h") |
| CreatedDate | DATETIME | Erstellungsdatum des Eintrags |

### 4. Trades (Geschäfte)

**Zweck**: Dokumentiert alle ausgeführten Trading-Transaktionen.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| TradeID | AUTOINCREMENT | Eindeutige ID für jeden Trade (Primärschlüssel) |
| AssetID | LONG | Fremdschlüssel zur Assets-Tabelle |
| StrategyID | LONG | Fremdschlüssel zur Strategies-Tabelle |
| TradeType | VARCHAR(10) | Art des Trades ("BUY" oder "SELL") |
| Quantity | DOUBLE | Gehandelte Menge |
| Price | CURRENCY | Ausführungspreis |
| TotalValue | CURRENCY | Gesamtwert des Trades |
| Fee | CURRENCY | Transaktionsgebühren |
| Timestamp | DATETIME | Zeitstempel der Ausführung |
| OrderID | VARCHAR(100) | Börsen-spezifische Order-ID |
| Status | VARCHAR(20) | Status des Trades |
| Notes | MEMO | Zusätzliche Notizen |
| CreatedDate | DATETIME | Erstellungsdatum des Eintrags |

### 5. Portfolio (Portfolio)

**Zweck**: Verfolgt aktuelle Bestände und Portfoliowerte.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| PortfolioID | AUTOINCREMENT | Eindeutige ID für jeden Portfolio-Eintrag (Primärschlüssel) |
| AssetID | LONG | Fremdschlüssel zur Assets-Tabelle |
| Quantity | DOUBLE | Aktuelle Menge im Portfolio |
| AveragePrice | CURRENCY | Durchschnittlicher Kaufpreis |
| TotalValue | CURRENCY | Gesamtwert der Position |
| LastUpdated | DATETIME | Datum der letzten Aktualisierung |

### 6. Trading_Sessions (Handelssitzungen)

**Zweck**: Verfolgt Bot-Handelssitzungen und deren Performance.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| SessionID | AUTOINCREMENT | Eindeutige ID für jede Sitzung (Primärschlüssel) |
| StrategyID | LONG | Fremdschlüssel zur Strategies-Tabelle |
| StartTime | DATETIME | Startzeit der Sitzung |
| EndTime | DATETIME | Endzeit der Sitzung |
| InitialBalance | CURRENCY | Anfangsguthaben der Sitzung |
| FinalBalance | CURRENCY | Endguthaben der Sitzung |
| TotalTrades | LONG | Gesamtzahl der Trades in dieser Sitzung |
| ProfitLoss | CURRENCY | Gewinn/Verlust der Sitzung |
| Status | VARCHAR(20) | Status der Sitzung (z.B. "ACTIVE", "COMPLETED") |
| Notes | MEMO | Zusätzliche Notizen |

### 7. Market_Indicators (Marktindikatoren)

**Zweck**: Speichert berechnete technische Indikatoren.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| IndicatorID | AUTOINCREMENT | Eindeutige ID für jeden Indikator (Primärschlüssel) |
| AssetID | LONG | Fremdschlüssel zur Assets-Tabelle |
| IndicatorType | VARCHAR(50) | Art des Indikators (z.B. "RSI", "MACD") |
| Value | DOUBLE | Berechneter Wert des Indikators |
| Timestamp | DATETIME | Zeitstempel des Indikatorwerts |
| Timeframe | VARCHAR(10) | Zeitrahmen des Indikators |
| CreatedDate | DATETIME | Erstellungsdatum des Eintrags |

### 8. Bot_Configuration (Bot-Konfiguration)

**Zweck**: Speichert Konfigurationseinstellungen des Bots.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| ConfigID | AUTOINCREMENT | Eindeutige ID für jede Konfiguration (Primärschlüssel) |
| ConfigKey | VARCHAR(100) | Schlüssel der Konfigurationseinstellung |
| ConfigValue | MEMO | Wert der Konfigurationseinstellung |
| Description | MEMO | Beschreibung der Einstellung |
| LastUpdated | DATETIME | Datum der letzten Aktualisierung |

### 9. Error_Logs (Fehlerprotokolle)

**Zweck**: Speichert Fehlerprotokolle und Systemmeldungen.

| Feldname | Datentyp | Beschreibung |
|----------|----------|--------------|
| LogID | AUTOINCREMENT | Eindeutige ID für jeden Log-Eintrag (Primärschlüssel) |
| LogLevel | VARCHAR(20) | Schweregrad des Logs (z.B. "ERROR", "WARNING") |
| Message | MEMO | Fehlermeldung oder Systemnachricht |
| StackTrace | MEMO | Stack-Trace bei Fehlern |
| Timestamp | DATETIME | Zeitstempel des Log-Eintrags |
| Source | VARCHAR(100) | Quelle des Log-Eintrags |

## Beziehungen zwischen Tabellen

Die Datenbank verwendet Fremdschlüssel-Beziehungen, um die Datenintegrität zu gewährleisten:

- **Assets → Candlestick_Data**: Ein Asset kann viele Candlestick-Datenpunkte haben
- **Assets → Trades**: Ein Asset kann in vielen Trades verwendet werden
- **Assets → Portfolio**: Ein Asset kann einen Portfolio-Eintrag haben
- **Assets → Market_Indicators**: Ein Asset kann viele Indikatorwerte haben
- **Strategies → Trades**: Eine Strategie kann für viele Trades verwendet werden
- **Strategies → Trading_Sessions**: Eine Strategie kann in vielen Sessions verwendet werden

## Installation und Einrichtung

### Schritt 1: Neue Access-Datenbank erstellen

1. Öffnen Sie Microsoft Access
2. Wählen Sie "Leere Datenbank"
3. Geben Sie den Namen "Zenbot_Database.accdb" ein
4. Klicken Sie auf "Erstellen"

### Schritt 2: SQL-Skript ausführen

1. Klicken Sie auf die Registerkarte "Erstellen"
2. Wählen Sie "Abfrageentwurf"
3. Schließen Sie das Dialogfeld "Tabelle anzeigen"
4. Klicken Sie auf "SQL-Ansicht" in der Symbolleiste
5. Kopieren Sie das folgende SQL-Skript und fügen Sie es ein:

```sql
-- Zenbot Microsoft Access Database Schema
-- This script creates the necessary tables for a Zenbot cryptocurrency trading bot database

-- Table: Assets
-- Stores information about different cryptocurrencies and trading pairs
CREATE TABLE Assets (
    AssetID AUTOINCREMENT PRIMARY KEY,
    Symbol VARCHAR(20) NOT NULL,
    Name VARCHAR(100),
    Exchange VARCHAR(50),
    BaseCurrency VARCHAR(10),
    QuoteCurrency VARCHAR(10),
    IsActive YESNO DEFAULT Yes,
    CreatedDate DATETIME DEFAULT Now(),
    LastUpdated DATETIME DEFAULT Now()
);

-- Table: Strategies
-- Stores trading strategy configurations
CREATE TABLE Strategies (
    StrategyID AUTOINCREMENT PRIMARY KEY,
    StrategyName VARCHAR(100) NOT NULL,
    Description MEMO,
    Parameters MEMO,
    IsActive YESNO DEFAULT Yes,
    CreatedDate DATETIME DEFAULT Now(),
    LastUpdated DATETIME DEFAULT Now()
);

-- Table: Candlestick_Data
-- Stores historical price data for technical analysis
CREATE TABLE Candlestick_Data (
    CandleID AUTOINCREMENT PRIMARY KEY,
    AssetID LONG,
    Timestamp DATETIME NOT NULL,
    OpenPrice CURRENCY,
    HighPrice CURRENCY,
    LowPrice CURRENCY,
    ClosePrice CURRENCY,
    Volume DOUBLE,
    Timeframe VARCHAR(10),
    CreatedDate DATETIME DEFAULT Now(),
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

-- Table: Trades
-- Stores executed trades and their details
CREATE TABLE Trades (
    TradeID AUTOINCREMENT PRIMARY KEY,
    AssetID LONG,
    StrategyID LONG,
    TradeType VARCHAR(10) NOT NULL, -- 'BUY' or 'SELL'
    Quantity DOUBLE NOT NULL,
    Price CURRENCY NOT NULL,
    TotalValue CURRENCY,
    Fee CURRENCY DEFAULT 0,
    Timestamp DATETIME NOT NULL,
    OrderID VARCHAR(100),
    Status VARCHAR(20) DEFAULT 'COMPLETED',
    Notes MEMO,
    CreatedDate DATETIME DEFAULT Now(),
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID),
    FOREIGN KEY (StrategyID) REFERENCES Strategies(StrategyID)
);

-- Table: Portfolio
-- Tracks current portfolio holdings
CREATE TABLE Portfolio (
    PortfolioID AUTOINCREMENT PRIMARY KEY,
    AssetID LONG,
    Quantity DOUBLE NOT NULL DEFAULT 0,
    AveragePrice CURRENCY,
    TotalValue CURRENCY,
    LastUpdated DATETIME DEFAULT Now(),
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

-- Table: Trading_Sessions
-- Tracks bot trading sessions and performance
CREATE TABLE Trading_Sessions (
    SessionID AUTOINCREMENT PRIMARY KEY,
    StrategyID LONG,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME,
    InitialBalance CURRENCY,
    FinalBalance CURRENCY,
    TotalTrades LONG DEFAULT 0,
    ProfitLoss CURRENCY DEFAULT 0,
    Status VARCHAR(20) DEFAULT 'ACTIVE',
    Notes MEMO,
    FOREIGN KEY (StrategyID) REFERENCES Strategies(StrategyID)
);

-- Table: Market_Indicators
-- Stores calculated technical indicators
CREATE TABLE Market_Indicators (
    IndicatorID AUTOINCREMENT PRIMARY KEY,
    AssetID LONG,
    IndicatorType VARCHAR(50) NOT NULL, -- RSI, MACD, SMA, EMA, etc.
    Value DOUBLE,
    Timestamp DATETIME NOT NULL,
    Timeframe VARCHAR(10),
    CreatedDate DATETIME DEFAULT Now(),
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID)
);

-- Table: Bot_Configuration
-- Stores bot configuration settings
CREATE TABLE Bot_Configuration (
    ConfigID AUTOINCREMENT PRIMARY KEY,
    ConfigKey VARCHAR(100) NOT NULL,
    ConfigValue MEMO,
    Description MEMO,
    LastUpdated DATETIME DEFAULT Now()
);

-- Table: Error_Logs
-- Stores error logs and system messages
CREATE TABLE Error_Logs (
    LogID AUTOINCREMENT PRIMARY KEY,
    LogLevel VARCHAR(20) NOT NULL, -- ERROR, WARNING, INFO
    Message MEMO NOT NULL,
    StackTrace MEMO,
    Timestamp DATETIME DEFAULT Now(),
    Source VARCHAR(100)
);
```

### Schritt 3: Beispieldaten einfügen

Nach der Erstellung der Tabellen können Sie die folgenden INSERT-Anweisungen ausführen, um Beispieldaten hinzuzufügen:

```sql
-- Insert sample configuration data
INSERT INTO Bot_Configuration (ConfigKey, ConfigValue, Description) VALUES
('API_KEY', '', 'Exchange API Key'),
('API_SECRET', '', 'Exchange API Secret'),
('DEFAULT_STRATEGY', 'macd', 'Default trading strategy'),
('MAX_TRADE_AMOUNT', '100', 'Maximum amount per trade'),
('STOP_LOSS_PERCENTAGE', '5', 'Stop loss percentage'),
('TAKE_PROFIT_PERCENTAGE', '10', 'Take profit percentage');

-- Insert sample strategy data
INSERT INTO Strategies (StrategyName, Description, Parameters) VALUES
('MACD', 'Moving Average Convergence Divergence strategy', '{"fast_period": 12, "slow_period": 26, "signal_period": 9}'),
('RSI', 'Relative Strength Index strategy', '{"period": 14, "overbought": 70, "oversold": 30}'),
('SMA_Cross', 'Simple Moving Average Crossover', '{"short_period": 10, "long_period": 20}'),
('Bollinger_Bands', 'Bollinger Bands strategy', '{"period": 20, "std_dev": 2}');

-- Insert sample asset data
INSERT INTO Assets (Symbol, Name, Exchange, BaseCurrency, QuoteCurrency) VALUES
('BTC/USD', 'Bitcoin', 'Coinbase', 'BTC', 'USD'),
('ETH/USD', 'Ethereum', 'Coinbase', 'ETH', 'USD'),
('LTC/USD', 'Litecoin', 'Coinbase', 'LTC', 'USD'),
('XRP/USD', 'Ripple', 'Coinbase', 'XRP', 'USD'),
('ADA/USD', 'Cardano', 'Coinbase', 'ADA', 'USD');
```

## Verwendung der Datenbank

### Grundlegende Abfragen

**Alle aktiven Assets anzeigen:**
```sql
SELECT * FROM Assets WHERE IsActive = Yes;
```

**Trades für ein bestimmtes Asset anzeigen:**
```sql
SELECT t.*, a.Symbol, s.StrategyName 
FROM Trades t 
INNER JOIN Assets a ON t.AssetID = a.AssetID 
INNER JOIN Strategies s ON t.StrategyID = s.StrategyID 
WHERE a.Symbol = 'BTC/USD';
```

**Portfolio-Übersicht:**
```sql
SELECT a.Symbol, p.Quantity, p.AveragePrice, p.TotalValue 
FROM Portfolio p 
INNER JOIN Assets a ON p.AssetID = a.AssetID 
WHERE p.Quantity > 0;
```

### Wartung und Optimierung

1. **Regelmäßige Komprimierung**: Verwenden Sie die Access-Funktion "Komprimieren und Reparieren"
2. **Indizierung**: Erstellen Sie Indizes für häufig abgefragte Felder wie Timestamp und AssetID
3. **Archivierung**: Verschieben Sie alte Daten regelmäßig in Archivtabellen
4. **Backup**: Erstellen Sie regelmäßige Sicherungskopien der Datenbank

## Sicherheitshinweise

- **API-Schlüssel**: Speichern Sie niemals echte API-Schlüssel in der Datenbank ohne Verschlüsselung
- **Zugriffskontrolle**: Implementieren Sie angemessene Benutzerberechtigungen
- **Netzwerksicherheit**: Beschränken Sie den Netzwerkzugriff auf die Datenbank
- **Backup-Verschlüsselung**: Verschlüsseln Sie Backup-Dateien

## Fehlerbehebung

### Häufige Probleme

1. **Fremdschlüssel-Fehler**: Stellen Sie sicher, dass referenzierte Datensätze existieren
2. **Datentyp-Konflikte**: Überprüfen Sie die Datentypen bei INSERT-Operationen
3. **Performance-Probleme**: Erstellen Sie Indizes für häufig abgefragte Spalten

### Support und Weiterentwicklung

Diese Datenbank ist als Grundlage für Zenbot-Implementierungen gedacht und kann je nach spezifischen Anforderungen erweitert werden. Für weitere Unterstützung konsultieren Sie die Zenbot-Community oder die offizielle Dokumentation.

## Lizenz

Diese Datenbankstruktur wird unter der MIT-Lizenz bereitgestellt und kann frei verwendet und modifiziert werden.

