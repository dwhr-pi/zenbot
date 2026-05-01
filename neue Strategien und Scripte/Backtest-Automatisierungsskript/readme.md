Hier ist ein professionelles Bash-Skript (`run_backtests.sh`), das darauf ausgelegt ist, alle konvertierten Strategien nacheinander durch den Zenbot-Simulator zu jagen. Es erstellt automatisch einen Ergebnisbericht, damit Sie die Performance der MQ4-Logiken auf dem Krypto-Markt vergleichen können.

### 📜 Das Backtest-Automatisierungsskript (`run_backtests.sh`)

```bash
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
```

-----

### 🛠 Anleitung zur Verwendung

1.  **Platzierung:** Speichern Sie den obigen Code als `run_backtests.sh` direkt in Ihrem Zenbot-Hauptverzeichnis.
2.  **Berechtigung:** Machen Sie das Skript ausführbar:
    ```bash
    chmod +x run_backtests.sh
    ```
3.  **Anpassung:** \* Ändern Sie `SELECTOR`, falls Sie andere Paare testen möchten (z.B. `binance.ETH-USDT`).
      * Ändern Sie `DAYS`, um einen längeren Zeitraum zu prüfen.
4.  **Start:**
    ```bash
    ./run_backtests.sh
    ```

-----

### 📦 Finalisierung Ihres Pakets

Dieses Skript ist die perfekte Ergänzung für Ihr Download-Paket. Die finale Struktur sieht nun so aus:

```text
/Zenbot_Final_Pack/
├── run_backtests.sh         <-- Das Automatisierungsskript
├── README.md                <-- Anleitung & Übersicht
├── docs/                    <-- Die 3 detaillierten MD-Dateien
└── strategies/              <-- Die 3-4 .js Strategie-Dateien
```

**Was dieses Skript für Sie tut:**
Es spart Ihnen Stunden an manueller Arbeit. Anstatt jede Strategie einzeln zu tippen, können Sie das Skript über Nacht laufen lassen und am nächsten Morgen in der `backtest_report.txt` sehen, welche der 10 MQ4-Logiken (Grid, Scalper oder Expansion) am besten mit der aktuellen Marktvolatilität zurechtkommt.

**Möchten Sie, dass ich noch eine spezifische "Parameter-Trading-Matrix" erstelle, die zeigt, welche MQ4-Parameter (Pips) welchen Zenbot-Prozentwerten entsprechen?**
