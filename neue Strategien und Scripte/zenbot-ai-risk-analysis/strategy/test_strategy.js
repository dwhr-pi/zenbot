/**
 * Test script for AI Risk Strategy
 * This script demonstrates how to use the AI Risk Strategy with mock data
 */

const AIRiskStrategy = require('./ai_risk_strategy');

// Mock Zenbot session object
function createMockSession() {
  return {
    product_id: 'BTC-USD',
    period: {
      close: 45000,
      high: 45500,
      low: 44500,
      volume: 1000000,
      rsi: 65,
      macd_histogram: 0.05,
      bollinger_upper: 46000,
      bollinger_lower: 44000
    },
    lookback: Array.from({ length: 20 }, (_, i) => ({
      close: 45000 + Math.random() * 1000 - 500,
      high: 45000 + Math.random() * 1000,
      low: 45000 - Math.random() * 1000,
      volume: 1000000 + Math.random() * 500000
    }))
  };
}

// Test configuration
const testConfig = {
  api_url: 'http://localhost:5000/api/risk',
  ai_provider: 'ollama',
  model: 'llama2',
  risk_threshold: 0.7,
  sentiment_threshold: -0.3,
  confidence_threshold: 0.5,
  analysis_interval: 60000, // 1 minute for testing
  enable_position_adjustment: true,
  enable_stop_loss_adjustment: true,
  enable_trading_pause: true
};

async function testStrategy() {
  console.log('=== AI Risk Strategy Test ===');
  console.log('Configuration:', JSON.stringify(testConfig, null, 2));
  console.log('');

  // Create strategy instance
  const strategy = new AIRiskStrategy(testConfig);
  
  // Set up event listeners
  strategy.on('trading_paused', (data) => {
    console.log('🚨 Trading paused:', data);
  });
  
  strategy.on('periodic_analysis_requested', () => {
    console.log('⏰ Periodic analysis requested');
  });

  // Create mock session
  const mockSession = createMockSession();
  console.log('Mock session created for:', mockSession.product_id);
  console.log('Current price:', mockSession.period.close);
  console.log('');

  // Test the strategy
  try {
    console.log('Testing strategy execution...');
    
    strategy.onTick(mockSession, {}, (error, signal) => {
      if (error) {
        console.error('Strategy error:', error);
      } else {
        console.log('Strategy signal:', JSON.stringify(signal, null, 2));
      }
      
      // Cleanup
      strategy.destroy();
      console.log('');
      console.log('Test completed successfully!');
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    strategy.destroy();
  }
}

// Helper function to test API connectivity
async function testAPIConnectivity() {
  const axios = require('axios');
  
  console.log('=== API Connectivity Test ===');
  
  try {
    const response = await axios.get(`${testConfig.api_url.replace('/analyze', '')}/health`, {
      timeout: 5000
    });
    
    console.log('API Health Status:', response.data);
    console.log('✅ API is accessible');
    
  } catch (error) {
    console.log('❌ API connectivity failed:', error.message);
    console.log('Make sure the AI Risk API is running on', testConfig.api_url);
  }
  
  console.log('');
}

// Run tests
async function runTests() {
  await testAPIConnectivity();
  await testStrategy();
}

// Execute if run directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testStrategy,
  testAPIConnectivity,
  createMockSession
};

