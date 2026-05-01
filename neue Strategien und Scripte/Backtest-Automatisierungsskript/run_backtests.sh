#!/bin/bash

# --- KONFIGURATION ---
SELECTOR="binance.BTC-USDT"
DAYS="30"
REPORT_FILE="backtest_report.txt"

# Liste der konvertierten Strategien und deren Standard-Parameter
declare -A STRATEGIES
STRATEGIES["mq4_grid"]="--grid_distance_pct 1.5 --profit_target_pct 0.5"
STRATEGIES["mq4_hybrid"]="--exp_factor 2.4 --lookback_size 1000"
STRATEGIES["mq4_scalper"]="--pips_offset 0.05 --trailing_pct 0.1"
STRATEGIES["mq4_expansion"]="--exp_factor 2.9 --profit_pips 30"
STRATEGIES["mq4_ghost"]="--exp_factor 2.2 --profit_stop_pct 0.1"

# Bericht-Header erstellen
echo "====================================================" > $REPORT_FILE
echo "ZENBOT MQ4 CONVERSION - BACKTEST REPORT" >> $REPORT_FILE
echo "Datum: $(date)" >> $REPORT_FILE
echo "Selector: $SELECTOR | Zeitraum: $DAYS Tage" >> $REPORT_FILE
echo "====================================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# --- BACKTEST SCHLEIFE ---
for STRAT in "${!STRATEGIES[@]}"; do
    echo "Starte Simulation für: $STRAT..."
    echo "Strategie: $STRAT" >> $REPORT_FILE
    
    # Zenbot Simulation ausführen und Output abfangen
    # Wir filtern nach 'end balance' und 'buy hold' für den Bericht
    RESULT=$(./zenbot.sh sim $SELECTOR --strategy $STRAT ${STRATEGIES[$STRAT]} --days $DAYS)
    
    echo "$RESULT" | grep -E "end balance|buy hold|vs. buy hold" >> $REPORT_FILE
    echo "----------------------------------------------------" >> $REPORT_FILE
    echo "Simulation für $STRAT abgeschlossen."
done

echo "Alle Backtests beendet. Ergebnisse finden Sie in $REPORT_FILE"