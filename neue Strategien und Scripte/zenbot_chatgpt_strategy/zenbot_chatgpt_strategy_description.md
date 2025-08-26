# Zenbot ChatGPT Trading Strategie

Dies ist eine angepasste Trading-Strategie für Zenbot, die darauf abzielt, Handelssignale von der OpenAI API (ChatGPT) zu beziehen. Die Strategie sendet historische Marktdaten an die OpenAI API und interpretiert die zurückgegebenen Signale (Kaufen, Verkaufen, Halten) für Handelsentscheidungen.

## Strategie-Implementierung (`chatgpt_strategy/strategy.js`)

Die Kernlogik der Strategie befindet sich in der Datei `strategy.js`:

```javascript
const axios = require("axios");

module.exports = {
  name: 'chatgpt_strategy',
  description: 'Trading strategy integrating with OpenAI API for signals.',

  getOptions: function () {
    this.option('period', 'period length, same as --period_length', String, '1m');
    this.option('period_length', 'period length, same as --period', String, '1m');
    this.option('openai_api_key', 'Your OpenAI API key', String, process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY');
    this.option('openai_model', 'OpenAI model to use for analysis', String, 'gpt-3.5-turbo');
    this.option('signal_threshold', 'Threshold for OpenAI signal (e.g., 0.7 for strong buy/sell)', Number, 0.7);
    this.option('min_periods', 'min. number of history periods', Number, 50);
  },

  calculate: function (s) {
    // This function is called on each new trade. We can use it to collect data.
    // For simplicity, we'll process data in onPeriod.
  },

  onPeriod: async function (s, cb) {
    if (!s.options.openai_api_key || s.options.openai_api_key === 'YOUR_OPENAI_API_KEY') {
      console.error('OpenAI API key is not set. Please set it via --openai_api_key or OPENAI_API_KEY environment variable.');
      return cb();
    }

    // Collect recent market data
    const history = s.lookback.slice(0, s.options.min_periods || 50).map(period => ({
      open: period.open,
      high: period.high,
      low: period.low,
      close: period.close,
      volume: period.volume,
      timestamp: period.time
    })).reverse(); // Reverse to get chronological order

    if (history.length < (s.options.min_periods || 50)) {
      console.log('Not enough historical data yet for OpenAI analysis.');
      return cb();
    }

    const prompt = `Analyze the following cryptocurrency market data and provide a trading signal (buy, sell, or hold) and a confidence score (0-1). The data is in chronological order. Focus on short-term trends and potential price movements. Respond in JSON format: {"signal": "buy|sell|hold", "confidence": 0.8, "reasoning": "Brief explanation"}

Recent market data (last ${history.length} periods):
${JSON.stringify(history.slice(-10), null, 2)}

Current price: ${s.period.close}
Current volume: ${s.period.volume}`;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: s.options.openai_model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert cryptocurrency trader. Analyze market data and provide trading signals with confidence scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${s.options.openai_api_key}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = response.data.choices[0].message.content;
      console.log('OpenAI Response:', aiResponse);

      // Parse the JSON response
      let analysis;
      try {
        analysis = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        return cb();
      }

      // Apply the signal if confidence is above threshold
      if (analysis.confidence >= s.options.signal_threshold) {
        if (analysis.signal === 'buy') {
          s.signal = 'buy';
          console.log(`BUY signal from OpenAI (confidence: ${analysis.confidence}): ${analysis.reasoning}`);
        } else if (analysis.signal === 'sell') {
          s.signal = 'sell';
          console.log(`SELL signal from OpenAI (confidence: ${analysis.confidence}): ${analysis.reasoning}`);
        }
      } else {
        console.log(`Signal confidence too low (${analysis.confidence} < ${s.options.signal_threshold}): ${analysis.reasoning}`);
      }

      // Store analysis for reporting
      s.period.ai_signal = analysis.signal;
      s.period.ai_confidence = analysis.confidence;
      s.period.ai_reasoning = analysis.reasoning;

    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }

    cb();
  },

  onReport: function (s) {
    var cols = [];
    if (s.period.ai_signal) {
      var color = 'grey';
      if (s.period.ai_signal === 'buy') {
        color = 'green';
      } else if (s.period.ai_signal === 'sell') {
        color = 'red';
      }
      cols.push(`AI: ${s.period.ai_signal} (${(s.period.ai_confidence * 100).toFixed(1)}%)`[color]);
    }
    return cols;
  }
};
```

## Backfill-Probleme und Herausforderungen

Bei der Integration und dem Testen dieser Strategie mit Zenbot sind wir auf erhebliche Herausforderungen gestoßen, insbesondere im Zusammenhang mit dem Backfilling historischer Daten und der allgemeinen Stabilität des Zenbot-Projekts:

1.  **Veraltetes Projekt:** Zenbot ist seit Februar 2022 archiviert und wird nicht mehr aktiv gepflegt. Dies führt zu Kompatibilitätsproblemen mit neueren Node.js-Versionen, Abhängigkeiten (z.B. `ccxt`) und Betriebssystemen.
2.  **Abhängigkeitskonflikte:** Die Installation der Node.js-Abhängigkeiten war schwierig und erforderte die Verwendung von `--force` und die manuelle Installation von Build-Tools (`build-essential`), um Fehler zu umgehen. Es gab weiterhin Warnungen bezüglich veralteter Pakete.
3.  **Backfill-Fehler:** Der `backfill`-Befehl von Zenbot, der zum Abrufen und Speichern historischer Daten in MongoDB verwendet wird, funktionierte nicht zuverlässig. Versuche mit verschiedenen Börsen (GDAX, Binance, Poloniex) führten zu `BadSymbol`-Fehlern oder Timeouts, was darauf hindeutet, dass die Exchange-Integrationen veraltet oder nicht mehr funktionsfähig sind.
4.  **Manuelle Datenimporte:** Obwohl wir erfolgreich historische Kline-Daten von Binance heruntergeladen und manuell in die MongoDB-Sammlungen `trades` und `periods` importiert haben, konnte Zenbot diese Daten für Simulationen nicht korrekt verwenden. Der `sim`-Befehl meldete weiterhin "no trades found!", was darauf hindeutet, dass Zenbot ein sehr spezifisches Datenformat oder zusätzliche Metadaten erwartet, die über die einfachen OHLCV-Daten hinausgehen.
5.  **Mangelnde Debugging-Möglichkeiten:** Die Fehlermeldungen von Zenbot sind oft nicht sehr aufschlussreich, was das Debugging erschwert. Die Warnungen bezüglich veralteter Node.js-Module deuten auf eine tiefere Inkompatibilität hin.

**Fazit:** Aufgrund der Veralterung und der damit verbundenen technischen Probleme ist Zenbot keine geeignete Plattform mehr für die Entwicklung und das Testen moderner Trading-Strategien, insbesondere wenn sie auf externe APIs wie die OpenAI API angewiesen sind. Die Zeit, die für die Fehlerbehebung des Bots aufgewendet werden müsste, übersteigt den Nutzen bei weitem. Es wird dringend empfohlen, für solche Projekte eine modernere und aktiv gepflegte Trading-Bot-Plattform zu verwenden oder eine maßgeschneiderte Lösung zu entwickeln.

