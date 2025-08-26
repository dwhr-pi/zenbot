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

