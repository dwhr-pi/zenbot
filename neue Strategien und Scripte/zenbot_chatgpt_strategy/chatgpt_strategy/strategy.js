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
    this.option("min_periods", "min. number of history periods", Number, 50);
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
}
