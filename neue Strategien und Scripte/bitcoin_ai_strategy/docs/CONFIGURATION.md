# Beispiel-Konfiguration für Bitcoin AI Strategie

Diese Konfigurationsdatei enthält empfohlene Einstellungen für verschiedene Marktbedingungen.

## Standard-Konfiguration

```json
{
  "strategy": "bitcoin_ai_strategy",
  "selector": "binance.BTC-USDT",
  "period": "1h",
  "min_periods": 200,
  "max_slippage_pct": 0.5,
  "keep_lookback_periods": 500,
  "rsi_periods": 14,
  "oversold_rsi": 30,
  "overbought_rsi": 70,
  "ema_short_period": 12,
  "ema_long_period": 26,
  "signal_period": 9,
  "bollinger_size": 2,
  "bollinger_period": 20,
  "prediction_horizon": 3,
  "confidence_threshold": 0.7,
  "stop_loss_pct": 2,
  "profit_target_pct": 4,
  "trailing_stop_pct": 1,
  "max_position_size": 10
}
```

## Bullischer Markt

```json
{
  "strategy": "bitcoin_ai_strategy",
  "selector": "binance.BTC-USDT",
  "period": "1h",
  "min_periods": 200,
  "rsi_periods": 14,
  "oversold_rsi": 40,
  "overbought_rsi": 75,
  "ema_short_period": 10,
  "ema_long_period": 21,
  "bollinger_size": 2.5,
  "confidence_threshold": 0.6,
  "stop_loss_pct": 3,
  "profit_target_pct": 6,
  "trailing_stop_pct": 2,
  "max_position_size": 15
}
```

## Bärischer Markt

```json
{
  "strategy": "bitcoin_ai_strategy",
  "selector": "binance.BTC-USDT",
  "period": "1h",
  "min_periods": 200,
  "rsi_periods": 21,
  "oversold_rsi": 25,
  "overbought_rsi": 65,
  "ema_short_period": 8,
  "ema_long_period": 34,
  "bollinger_size": 1.8,
  "confidence_threshold": 0.8,
  "stop_loss_pct": 1.5,
  "profit_target_pct": 3,
  "trailing_stop_pct": 0.8,
  "max_position_size": 5
}
```

## Hohe Volatilität

```json
{
  "strategy": "bitcoin_ai_strategy",
  "selector": "binance.BTC-USDT",
  "period": "30m",
  "min_periods": 200,
  "rsi_periods": 10,
  "oversold_rsi": 30,
  "overbought_rsi": 70,
  "bollinger_size": 3,
  "bollinger_period": 15,
  "confidence_threshold": 0.75,
  "stop_loss_pct": 2.5,
  "profit_target_pct": 5,
  "trailing_stop_pct": 1.5,
  "max_position_size": 8
}
```

## Niedrige Volatilität

```json
{
  "strategy": "bitcoin_ai_strategy",
  "selector": "binance.BTC-USDT",
  "period": "2h",
  "min_periods": 200,
  "rsi_periods": 21,
  "oversold_rsi": 35,
  "overbought_rsi": 65,
  "bollinger_size": 1.5,
  "bollinger_period": 30,
  "confidence_threshold": 0.65,
  "stop_loss_pct": 1,
  "profit_target_pct": 2,
  "trailing_stop_pct": 0.5,
  "max_position_size": 12
}
```

## Verwendung der Konfigurationsdateien

Sie können diese Konfigurationen speichern und mit dem `--conf_file`-Parameter verwenden:

```bash
./zenbot.sh trade --conf_file=bullish_config.json
```

Oder Sie können die Parameter direkt in der Befehlszeile überschreiben:

```bash
./zenbot.sh trade --conf_file=standard_config.json --conf.stop_loss_pct=2.5
```
