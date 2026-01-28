## 11. Super Signal Reversal Strategie

**Zenbot-Dateiname:** `Super_Signal_Reversal.js`

Diese Strategie basiert auf dem MT4-Indikator **`Super Signal v3.mq4`**. Sie ist eine **Umkehrstrategie**, die darauf spezialisiert ist, Preis-Extrema (Hochs und Tiefs) über zwei verschiedene Zeitfenster zu identifizieren. Wenn der Preis ein neues Extremum erreicht, signalisiert dies eine mögliche Erschöpfung des aktuellen Trends und eine bevorstehende Umkehr.

### Strategie-Logik

Die Strategie überwacht zwei Zeitfenster (`dist1` und `dist2`). Ein Signal wird generiert, wenn der aktuelle Preis das höchste Hoch oder das niedrigste Tief des längeren Zeitfensters erreicht oder durchbricht.

| Signal | Bedingung |
| :--- | :--- |
| **Kauf (Long)** | Der aktuelle Tiefstpreis der Kerze ist kleiner oder gleich dem niedrigsten Tief der letzten `dist2` Kerzen. |
| **Verkauf (Short)** | Der aktuelle Höchstpreis der Kerze ist größer oder gleich dem höchsten Hoch der letzten `dist2` Kerzen. |

### Empfohlene Einstellungswerte (Zenbot-Optionen)

| Option | Beschreibung | Empfohlener Wert | Begründung |
| :--- | :--- | :--- | :--- |
| `period` | Zeitrahmen der Kerzen (z.B. 1h, 4h) | `1h` | Umkehrsignale sind auf höheren Zeitrahmen oft zuverlässiger. |
| `dist1` | Kurzes Fenster für Extremwert-Erkennung | `14` | Entspricht dem Standardwert im Original-Indikator. |
| `dist2` | Langes Fenster für Extremwert-Erkennung | `21` | Entspricht dem Standardwert im Original-Indikator für stärkere Signale. |

**Zenbot-Befehl (Beispiel für Super Signal Reversal Strategie):**

```bash
zenbot backtest binance.BTC-USDT --strategy=super_signal_reversal --period=1h --dist1=14 --dist2=21
```
