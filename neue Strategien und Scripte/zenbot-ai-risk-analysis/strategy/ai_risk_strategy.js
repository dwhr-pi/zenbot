const axios = require('axios');
const EventEmitter = require('events');

/**
 * AI Risk Analysis Strategy for Zenbot
 * Integrates with ChatGPT/Ollama API for enhanced risk assessment
 */
class AIRiskStrategy extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.name = 'ai_risk_analysis';
    this.description = 'AI-powered risk analysis strategy using ChatGPT or Ollama';
    
    // Configuration
    this.config = {
      api_url: options.api_url || 'http://localhost:5000/api/risk',
      ai_provider: options.ai_provider || 'ollama', // 'chatgpt' or 'ollama'
      model: options.model || 'llama2',
      risk_threshold: options.risk_threshold || 0.7, // Risk threshold (0-1)
      sentiment_threshold: options.sentiment_threshold || -0.3, // Sentiment threshold (-1 to 1)
      confidence_threshold: options.confidence_threshold || 0.5, // Minimum confidence level
      analysis_interval: options.analysis_interval || 300000, // 5 minutes in ms
      enable_position_adjustment: options.enable_position_adjustment !== false,
      enable_stop_loss_adjustment: options.enable_stop_loss_adjustment !== false,
      enable_trading_pause: options.enable_trading_pause !== false,
      max_position_reduction: options.max_position_reduction || 0.5, // Max 50% reduction
      emergency_stop_threshold: options.emergency_stop_threshold || 0.9
    };
    
    // State tracking
    this.last_analysis = null;
    this.analysis_cache = new Map();
    this.risk_history = [];
    this.trading_paused = false;
    this.pause_until = null;
    
    // Initialize analysis timer
    this.analysis_timer = null;
    this.startPeriodicAnalysis();
  }

  /**
   * Main strategy execution
   */
  async onTick(s, options, cb) {
    try {
      // Get current market data
      const current_price = s.period.close;
      const asset_symbol = s.product_id;
      
      // Perform AI risk analysis
      const risk_analysis = await this.performRiskAnalysis(s, asset_symbol);
      
      if (!risk_analysis || risk_analysis.error) {
        console.log(`AI Risk Analysis failed: ${risk_analysis?.error || 'Unknown error'}`);
        return cb(null, this.getDefaultSignal(s));
      }
      
      // Process risk analysis and generate trading signal
      const signal = this.processRiskAnalysis(s, risk_analysis);
      
      // Log analysis results
      this.logAnalysis(asset_symbol, risk_analysis, signal);
      
      cb(null, signal);
      
    } catch (error) {
      console.error('AI Risk Strategy Error:', error);
      cb(null, this.getDefaultSignal(s));
    }
  }

  /**
   * Perform AI-powered risk analysis
   */
  async performRiskAnalysis(s, asset_symbol) {
    try {
      // Check cache first
      const cache_key = `${asset_symbol}_${Date.now() - (Date.now() % this.config.analysis_interval)}`;
      if (this.analysis_cache.has(cache_key)) {
        return this.analysis_cache.get(cache_key);
      }
      
      // Gather market context data
      const market_data = this.gatherMarketContext(s);
      
      // Prepare text data for AI analysis
      const text_data = this.prepareAnalysisText(s, market_data);
      
      // Call AI Risk API
      const response = await axios.post(`${this.config.api_url}/analyze`, {
        text_data: text_data,
        asset_symbol: asset_symbol,
        ai_provider: this.config.ai_provider,
        model: this.config.model
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        const analysis = response.data.analysis;
        
        // Cache the result
        this.analysis_cache.set(cache_key, analysis);
        
        // Clean old cache entries
        this.cleanCache();
        
        return analysis;
      } else {
        throw new Error('Invalid API response');
      }
      
    } catch (error) {
      console.error('Risk analysis failed:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Gather market context for analysis
   */
  gatherMarketContext(s) {
    const periods = s.lookback.slice(-20); // Last 20 periods
    
    return {
      current_price: s.period.close,
      price_change_24h: this.calculatePriceChange(periods, 24),
      volatility: this.calculateVolatility(periods),
      volume_trend: this.calculateVolumeTrend(periods),
      rsi: s.period.rsi || 50,
      macd: s.period.macd_histogram || 0,
      bollinger_position: this.calculateBollingerPosition(s),
      support_resistance: this.findSupportResistance(periods)
    };
  }

  /**
   * Prepare text data for AI analysis
   */
  prepareAnalysisText(s, market_data) {
    const asset = s.product_id;
    const price = s.period.close;
    const timestamp = new Date().toISOString();
    
    return `
MARKET ANALYSIS REQUEST - ${timestamp}
Asset: ${asset}
Current Price: ${price}

TECHNICAL INDICATORS:
- 24h Price Change: ${market_data.price_change_24h.toFixed(2)}%
- Volatility (20-period): ${market_data.volatility.toFixed(4)}
- Volume Trend: ${market_data.volume_trend}
- RSI: ${market_data.rsi.toFixed(2)}
- MACD Histogram: ${market_data.macd.toFixed(4)}
- Bollinger Band Position: ${market_data.bollinger_position}

SUPPORT/RESISTANCE:
- Support Level: ${market_data.support_resistance.support}
- Resistance Level: ${market_data.support_resistance.resistance}

RECENT PRICE ACTION:
${this.describePriceAction(s)}

Please analyze the current market conditions and provide a comprehensive risk assessment for algorithmic trading decisions. Consider:
1. Technical indicator divergences
2. Volatility patterns
3. Volume anomalies
4. Support/resistance levels
5. Overall market sentiment
6. Potential risk factors

Focus on actionable insights for position sizing, stop-loss placement, and trading continuation decisions.
`;
  }

  /**
   * Process AI risk analysis and generate trading signal
   */
  processRiskAnalysis(s, analysis) {
    const signal = this.getDefaultSignal(s);
    
    // Extract key metrics
    const risk_level = analysis.risk_level;
    const sentiment_score = analysis.sentiment_score;
    const confidence = analysis.confidence;
    const recommendations = analysis.recommendations || {};
    
    // Check if we should pause trading
    if (this.shouldPauseTrading(analysis)) {
      this.pauseTrading(analysis);
      signal.cancel_order = true;
      return signal;
    }
    
    // Apply risk-based adjustments
    if (confidence >= this.config.confidence_threshold) {
      
      // Position size adjustment
      if (this.config.enable_position_adjustment && recommendations.position_size_adjustment) {
        signal.position_adjustment = this.calculatePositionAdjustment(recommendations.position_size_adjustment, risk_level);
      }
      
      // Stop-loss adjustment
      if (this.config.enable_stop_loss_adjustment && recommendations.stop_loss_adjustment) {
        signal.stop_loss_adjustment = this.calculateStopLossAdjustment(recommendations.stop_loss_adjustment, risk_level);
      }
      
      // Trading action
      if (recommendations.trading_action === 'PAUSE' || recommendations.trading_action === 'STOP') {
        signal.cancel_order = true;
        if (recommendations.trading_action === 'STOP') {
          signal.close_position = true;
        }
      }
    }
    
    // Add AI analysis metadata
    signal.ai_analysis = {
      risk_level: risk_level,
      sentiment_score: sentiment_score,
      confidence: confidence,
      timestamp: analysis.timestamp,
      provider: this.config.ai_provider
    };
    
    // Update risk history
    this.updateRiskHistory(analysis);
    
    return signal;
  }

  /**
   * Check if trading should be paused based on risk analysis
   */
  shouldPauseTrading(analysis) {
    if (!this.config.enable_trading_pause) return false;
    
    const risk_score = this.calculateRiskScore(analysis);
    
    // Emergency stop conditions
    if (risk_score >= this.config.emergency_stop_threshold) {
      return true;
    }
    
    // High risk with low confidence
    if (analysis.risk_level === 'CRITICAL' && analysis.confidence >= 0.7) {
      return true;
    }
    
    // Extremely negative sentiment
    if (analysis.sentiment_score <= -0.8 && analysis.confidence >= 0.6) {
      return true;
    }
    
    return false;
  }

  /**
   * Pause trading for a specified duration
   */
  pauseTrading(analysis) {
    const pause_duration = this.calculatePauseDuration(analysis);
    this.trading_paused = true;
    this.pause_until = Date.now() + pause_duration;
    
    console.log(`Trading paused due to high risk. Resume at: ${new Date(this.pause_until).toISOString()}`);
    this.emit('trading_paused', { analysis, pause_until: this.pause_until });
  }

  /**
   * Calculate position size adjustment
   */
  calculatePositionAdjustment(recommendation, risk_level) {
    let adjustment_factor = 1.0;
    
    switch (recommendation) {
      case 'DECREASE':
        if (risk_level === 'CRITICAL') adjustment_factor = 0.2;
        else if (risk_level === 'HIGH') adjustment_factor = 0.5;
        else if (risk_level === 'MEDIUM') adjustment_factor = 0.8;
        break;
      case 'INCREASE':
        if (risk_level === 'LOW') adjustment_factor = 1.2;
        break;
      default:
        adjustment_factor = 1.0;
    }
    
    return Math.max(0.1, Math.min(adjustment_factor, 1.0));
  }

  /**
   * Calculate stop-loss adjustment
   */
  calculateStopLossAdjustment(recommendation, risk_level) {
    let adjustment_factor = 1.0;
    
    switch (recommendation) {
      case 'TIGHTER':
        if (risk_level === 'CRITICAL') adjustment_factor = 0.5;
        else if (risk_level === 'HIGH') adjustment_factor = 0.7;
        else if (risk_level === 'MEDIUM') adjustment_factor = 0.85;
        break;
      case 'LOOSER':
        if (risk_level === 'LOW') adjustment_factor = 1.3;
        break;
      default:
        adjustment_factor = 1.0;
    }
    
    return adjustment_factor;
  }

  /**
   * Calculate overall risk score
   */
  calculateRiskScore(analysis) {
    const risk_weights = {
      'LOW': 0.2,
      'MEDIUM': 0.5,
      'HIGH': 0.8,
      'CRITICAL': 1.0
    };
    
    const risk_component = risk_weights[analysis.risk_level] || 0.5;
    const sentiment_component = Math.abs(analysis.sentiment_score);
    const confidence_weight = analysis.confidence;
    
    return (risk_component * 0.6 + sentiment_component * 0.4) * confidence_weight;
  }

  /**
   * Calculate pause duration based on risk analysis
   */
  calculatePauseDuration(analysis) {
    const base_duration = 15 * 60 * 1000; // 15 minutes
    
    if (analysis.risk_level === 'CRITICAL') {
      return base_duration * 4; // 1 hour
    } else if (analysis.risk_level === 'HIGH') {
      return base_duration * 2; // 30 minutes
    } else {
      return base_duration; // 15 minutes
    }
  }

  /**
   * Start periodic risk analysis
   */
  startPeriodicAnalysis() {
    if (this.analysis_timer) {
      clearInterval(this.analysis_timer);
    }
    
    this.analysis_timer = setInterval(() => {
      this.emit('periodic_analysis_requested');
    }, this.config.analysis_interval);
  }

  /**
   * Utility functions
   */
  getDefaultSignal(s) {
    return {
      signal: null,
      cancel_order: false,
      close_position: false,
      position_adjustment: 1.0,
      stop_loss_adjustment: 1.0
    };
  }

  calculatePriceChange(periods, hours) {
    if (periods.length < hours) return 0;
    const current = periods[periods.length - 1].close;
    const previous = periods[periods.length - hours].close;
    return ((current - previous) / previous) * 100;
  }

  calculateVolatility(periods) {
    if (periods.length < 2) return 0;
    const returns = periods.slice(1).map((p, i) => 
      Math.log(p.close / periods[i].close)
    );
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  calculateVolumeTrend(periods) {
    if (periods.length < 10) return 'unknown';
    const recent_volume = periods.slice(-5).reduce((a, b) => a + b.volume, 0) / 5;
    const historical_volume = periods.slice(-15, -5).reduce((a, b) => a + b.volume, 0) / 10;
    
    const ratio = recent_volume / historical_volume;
    if (ratio > 1.2) return 'increasing';
    if (ratio < 0.8) return 'decreasing';
    return 'stable';
  }

  calculateBollingerPosition(s) {
    if (!s.period.bollinger_upper || !s.period.bollinger_lower) return 'unknown';
    const price = s.period.close;
    const upper = s.period.bollinger_upper;
    const lower = s.period.bollinger_lower;
    const position = (price - lower) / (upper - lower);
    
    if (position > 0.8) return 'near_upper';
    if (position < 0.2) return 'near_lower';
    return 'middle';
  }

  findSupportResistance(periods) {
    if (periods.length < 10) return { support: 0, resistance: 0 };
    
    const highs = periods.map(p => p.high).sort((a, b) => b - a);
    const lows = periods.map(p => p.low).sort((a, b) => a - b);
    
    return {
      support: lows[Math.floor(lows.length * 0.2)],
      resistance: highs[Math.floor(highs.length * 0.2)]
    };
  }

  describePriceAction(s) {
    const periods = s.lookback.slice(-5);
    if (periods.length < 2) return 'Insufficient data';
    
    const trend = periods[periods.length - 1].close > periods[0].close ? 'upward' : 'downward';
    const volatility = this.calculateVolatility(periods) > 0.02 ? 'high' : 'low';
    
    return `Recent ${trend} trend with ${volatility} volatility`;
  }

  updateRiskHistory(analysis) {
    this.risk_history.push({
      timestamp: Date.now(),
      risk_level: analysis.risk_level,
      sentiment_score: analysis.sentiment_score,
      confidence: analysis.confidence
    });
    
    // Keep only last 100 entries
    if (this.risk_history.length > 100) {
      this.risk_history = this.risk_history.slice(-100);
    }
  }

  cleanCache() {
    const now = Date.now();
    const max_age = this.config.analysis_interval * 2;
    
    for (const [key, value] of this.analysis_cache.entries()) {
      const timestamp = parseInt(key.split('_').pop());
      if (now - timestamp > max_age) {
        this.analysis_cache.delete(key);
      }
    }
  }

  logAnalysis(asset_symbol, analysis, signal) {
    console.log(`AI Risk Analysis for ${asset_symbol}:`);
    console.log(`  Risk Level: ${analysis.risk_level}`);
    console.log(`  Sentiment: ${analysis.sentiment_score.toFixed(3)}`);
    console.log(`  Confidence: ${analysis.confidence.toFixed(3)}`);
    console.log(`  Position Adjustment: ${signal.position_adjustment.toFixed(2)}`);
    console.log(`  Stop Loss Adjustment: ${signal.stop_loss_adjustment.toFixed(2)}`);
    if (signal.cancel_order) console.log('  Action: CANCEL ORDER');
    if (signal.close_position) console.log('  Action: CLOSE POSITION');
  }

  /**
   * Cleanup on strategy shutdown
   */
  destroy() {
    if (this.analysis_timer) {
      clearInterval(this.analysis_timer);
      this.analysis_timer = null;
    }
    this.analysis_cache.clear();
    this.removeAllListeners();
  }
}

module.exports = AIRiskStrategy;

