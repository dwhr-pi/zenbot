#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zenbot Konfigurations-Editor
Eine Flask-Webanwendung zum Bearbeiten von Zenbot conf.js Dateien

Autor: Manus AI
Version: 1.0
"""

import re
import os
from flask import Flask, render_template, request, flash, redirect, url_for
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'zenbot_config_editor_secret_key_2024'
CORS(app)  # Ermöglicht Cross-Origin-Requests

CONFIG_FILE = 'conf.js'

# Konfigurationsfelder mit ihren Eigenschaften
CONFIG_FIELDS = {
    'selector': {
        'type': 'select',
        'label': 'Börse und Währungspaar (Selector)',
        'options': [
            'gdax.BTC-USD', 'gdax.ETH-USD', 'gdax.LTC-USD',
            'binance.BTC-USDT', 'binance.ETH-BTC', 'binance.LTC-BTC',
            'kraken.XBTUSD', 'kraken.ETHUSD', 'kraken.LTCUSD',
            'bitfinex.BTCUSD', 'bitfinex.ETHUSD', 'bitfinex.LTCUSD'
        ],
        'help': 'Wählen Sie die Börse und das Währungspaar, das der Bot handeln soll. Das Format ist immer börsenname.WÄHRUNG1-WÄHRUNG2.'
    },
    'strategy': {
        'type': 'select',
        'label': 'Handelsstrategie',
        'options': [
            'trend_ema', 'macd', 'rsi', 'bollinger', 'cci', 'srsi_macd',
            'neural', 'momentum', 'sar', 'speed', 'ta_macd', 'ta_ema'
        ],
        'help': 'Dies ist die Logik, nach der der Bot kauft und verkauft. Zenbot bringt viele vordefinierte Strategien mit. trend_ema ist ein guter Startpunkt für Anfänger.'
    },
    'paper': {
        'type': 'select',
        'label': 'Paper-Trading (Simulation)',
        'options': ['true', 'false'],
        'help': 'WICHTIG: Wenn dies aktiviert ist, simuliert der Bot nur den Handel, ohne echtes Geld zu verwenden. Deaktivieren Sie dies nur, wenn Sie bereit sind, live zu handeln und Ihre API-Schlüssel konfiguriert haben.'
    },
    'currency_capital': {
        'type': 'number',
        'label': 'Startkapital (in Basiswährung)',
        'help': 'Das verfügbare Kapital für den Handel. Bei Paper-Trading ist dies das simulierte Startkapital.'
    },
    'asset_capital': {
        'type': 'number',
        'label': 'Asset-Kapital',
        'help': 'Bereits vorhandenes Asset-Kapital (z.B. bereits gehaltene Bitcoin).'
    },
    'buy_pct': {
        'type': 'number',
        'label': 'Kaufprozentsatz (%)',
        'help': 'Prozentsatz des verfügbaren Kapitals, der bei einem Kauf verwendet wird (Standard: 99).'
    },
    'sell_pct': {
        'type': 'number',
        'label': 'Verkaufsprozentsatz (%)',
        'help': 'Prozentsatz der gehaltenen Assets, der bei einem Verkauf verwendet wird (Standard: 99).'
    },
    'max_slippage_pct': {
        'type': 'number',
        'label': 'Maximaler Slippage (%)',
        'help': 'Maximaler akzeptabler Slippage bei Trades (Standard: 5).'
    },
    'buy_max_amt': {
        'type': 'number',
        'label': 'Maximaler Kaufbetrag',
        'help': 'Maximaler Betrag für einen einzelnen Kauf (leer lassen für unbegrenzt).'
    },
    'sell_max_amt': {
        'type': 'number',
        'label': 'Maximaler Verkaufsbetrag',
        'help': 'Maximaler Betrag für einen einzelnen Verkauf (leer lassen für unbegrenzt).'
    },
    'order_adjust_time': {
        'type': 'number',
        'label': 'Order-Anpassungszeit (ms)',
        'help': 'Zeit in Millisekunden, nach der Orders angepasst werden (Standard: 5000).'
    },
    'order_poll_time': {
        'type': 'number',
        'label': 'Order-Polling-Zeit (ms)',
        'help': 'Zeit in Millisekunden zwischen Order-Status-Abfragen (Standard: 5000).'
    },
    'markup_pct': {
        'type': 'number',
        'label': 'Markup-Prozentsatz (%)',
        'help': 'Prozentsatz, um den der Kaufpreis erhöht wird (Standard: 0).'
    },
    'markdown_buy_pct': {
        'type': 'number',
        'label': 'Markdown-Kauf-Prozentsatz (%)',
        'help': 'Prozentsatz, um den der Kaufpreis reduziert wird (Standard: 0).'
    },
    'markdown_sell_pct': {
        'type': 'number',
        'label': 'Markdown-Verkauf-Prozentsatz (%)',
        'help': 'Prozentsatz, um den der Verkaufspreis reduziert wird (Standard: 0).'
    },
    'days': {
        'type': 'number',
        'label': 'Tage für Backfill/Simulation',
        'help': 'Anzahl der vergangenen Tage, für die historische Daten für Simulationen und Backtests geladen werden. Ein höherer Wert gibt eine bessere Datengrundlage, dauert aber länger.'
    }
}

def get_config_value(key, content):
    """Extrahiert einen Wert aus der conf.js. Funktioniert für Strings, Zahlen und Booleans."""
    # Verschiedene Muster für verschiedene Werttypen
    patterns = [
        r"c\.{}\s*=\s*'([^']*)'".format(re.escape(key)),  # String mit einfachen Anführungszeichen
        r'c\.{}\s*=\s*"([^"]*)"'.format(re.escape(key)),  # String mit doppelten Anführungszeichen
        r"c\.{}\s*=\s*([^,\s\n]+)".format(re.escape(key))  # Zahlen, Booleans, etc.
    ]
    
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            value = match.group(1).strip()
            # Entferne Anführungszeichen falls vorhanden
            if value.startswith(("'", '"')) and value.endswith(("'", '"')):
                value = value[1:-1]
            return value
    return ''

def set_config_value(key, new_value, content):
    """Ersetzt einen Wert in der conf.js. Behält das richtige Format bei."""
    # Bestimme das Format basierend auf dem Werttyp
    if new_value.lower() in ['true', 'false']:
        # Boolean-Wert
        replacement = f"c.{key} = {new_value.lower()}"
    elif new_value.replace('.', '').replace('-', '').isdigit():
        # Numerischer Wert
        replacement = f"c.{key} = {new_value}"
    else:
        # String-Wert
        replacement = f"c.{key} = '{new_value}'"
    
    # Verschiedene Muster zum Finden des alten Werts
    patterns = [
        r"c\.{}\s*=\s*'[^']*'".format(re.escape(key)),
        r'c\.{}\s*=\s*"[^"]*"'.format(re.escape(key)),
        r"c\.{}\s*=\s*[^,\s\n]+".format(re.escape(key))
    ]
    
    for pattern in patterns:
        if re.search(pattern, content):
            new_content = re.sub(pattern, replacement, content, count=1)
            return new_content
    
    # Falls der Schlüssel nicht gefunden wurde, füge ihn am Ende hinzu
    if not content.endswith('\n'):
        content += '\n'
    content += f"{replacement}\n"
    return content

def create_sample_config():
    """Erstellt eine Beispiel-conf.js Datei, falls keine vorhanden ist."""
    sample_content = """// Zenbot Konfigurationsdatei
// Generiert vom Zenbot Config Editor

var c = module.exports = {}

// Börse und Währungspaar
c.selector = 'gdax.BTC-USD'

// Handelsstrategie
c.strategy = 'trend_ema'

// Paper Trading (Simulation)
c.paper = true

// Kapital-Einstellungen
c.currency_capital = 1000
c.asset_capital = 0

// Trade-Einstellungen
c.buy_pct = 99
c.sell_pct = 99
c.max_slippage_pct = 5

// Order-Einstellungen
c.order_adjust_time = 5000
c.order_poll_time = 5000

// Markup/Markdown
c.markup_pct = 0
c.markdown_buy_pct = 0
c.markdown_sell_pct = 0

// Backfill-Tage
c.days = 14

// Weitere Einstellungen können hier hinzugefügt werden...
"""
    return sample_content

@app.route('/', methods=['GET', 'POST'])
def config_editor():
    """Hauptroute für den Konfigurationseditor."""
    
    # Prüfe, ob conf.js existiert, falls nicht, erstelle eine Beispieldatei
    if not os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            f.write(create_sample_config())
        flash('Eine neue Beispiel-conf.js wurde erstellt. Sie können diese nun bearbeiten.', 'info')
    
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        flash('Fehler: conf.js konnte nicht gelesen werden!', 'danger')
        return render_template('error.html', error='Konfigurationsdatei nicht gefunden')
    except Exception as e:
        flash(f'Fehler beim Lesen der Datei: {e}', 'danger')
        return render_template('error.html', error=str(e))

    if request.method == 'POST':
        # Neue Werte aus dem Formular holen und in die Datei schreiben
        new_content = content
        
        for field_name in CONFIG_FIELDS.keys():
            if field_name in request.form:
                new_value = request.form[field_name].strip()
                if new_value:  # Nur setzen, wenn ein Wert eingegeben wurde
                    new_content = set_config_value(field_name, new_value, new_content)
        
        # Die Datei mit den neuen Werten überschreiben
        try:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            flash('Konfiguration erfolgreich gespeichert!', 'success')
            
            # Seite neu laden, um die gespeicherten Werte anzuzeigen
            content = new_content
            
        except Exception as e:
            flash(f'Fehler beim Speichern: {e}', 'danger')

    # Aktuelle Werte auslesen, um sie im Formular anzuzeigen
    config_values = {}
    for field_name in CONFIG_FIELDS.keys():
        config_values[field_name] = get_config_value(field_name, content)

    return render_template(
        'index.html', 
        config=config_values, 
        fields=CONFIG_FIELDS
    )

@app.route('/backup')
def backup_config():
    """Erstellt ein Backup der aktuellen Konfiguration."""
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        import datetime
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'conf_backup_{timestamp}.js'
        
        with open(backup_filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        flash(f'Backup erstellt: {backup_filename}', 'success')
        
    except Exception as e:
        flash(f'Fehler beim Erstellen des Backups: {e}', 'danger')
    
    return redirect(url_for('config_editor'))

@app.route('/reset')
def reset_config():
    """Setzt die Konfiguration auf Standardwerte zurück."""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            f.write(create_sample_config())
        flash('Konfiguration auf Standardwerte zurückgesetzt!', 'warning')
    except Exception as e:
        flash(f'Fehler beim Zurücksetzen: {e}', 'danger')
    
    return redirect(url_for('config_editor'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

