from flask import Blueprint, request, jsonify
import openai
import requests
import json
from datetime import datetime
import re

ai_risk_bp = Blueprint('ai_risk', __name__)

# Configuration
OPENAI_API_KEY = None  # To be set via environment variable or config
OLLAMA_BASE_URL = "http://localhost:11434"  # Default Ollama URL

class RiskAnalyzer:
    def __init__(self):
        self.openai_client = None
        if OPENAI_API_KEY:
            openai.api_key = OPENAI_API_KEY
            self.openai_client = openai
    
    def analyze_with_chatgpt(self, text_data, asset_symbol=None):
        """Analyze risk using ChatGPT/OpenAI API"""
        if not self.openai_client or not OPENAI_API_KEY:
            return {"error": "OpenAI API key not configured"}
        
        prompt = self._create_risk_analysis_prompt(text_data, asset_symbol)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial risk analysis expert. Analyze the provided information and return a structured risk assessment."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            
            analysis_text = response.choices[0].message.content
            return self._parse_risk_analysis(analysis_text)
            
        except Exception as e:
            return {"error": f"ChatGPT analysis failed: {str(e)}"}
    
    def analyze_with_ollama(self, text_data, asset_symbol=None, model="llama2"):
        """Analyze risk using Ollama local LLM"""
        prompt = self._create_risk_analysis_prompt(text_data, asset_symbol)
        
        try:
            response = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                analysis_text = result.get("response", "")
                return self._parse_risk_analysis(analysis_text)
            else:
                return {"error": f"Ollama request failed with status {response.status_code}"}
                
        except requests.exceptions.RequestException as e:
            return {"error": f"Ollama connection failed: {str(e)}"}
    
    def _create_risk_analysis_prompt(self, text_data, asset_symbol=None):
        """Create a structured prompt for risk analysis"""
        asset_info = f" for asset {asset_symbol}" if asset_symbol else ""
        
        prompt = f"""
Analyze the following financial information{asset_info} and provide a structured risk assessment:

TEXT DATA:
{text_data}

Please provide your analysis in the following JSON format:
{{
    "sentiment_score": <number between -1.0 and 1.0>,
    "risk_level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "risk_factors": ["factor1", "factor2", "factor3"],
    "market_impact": "<POSITIVE|NEGATIVE|NEUTRAL>",
    "confidence": <number between 0.0 and 1.0>,
    "summary": "<brief summary of key findings>",
    "recommendations": {{
        "position_size_adjustment": "<INCREASE|DECREASE|MAINTAIN>",
        "stop_loss_adjustment": "<TIGHTER|LOOSER|MAINTAIN>",
        "trading_action": "<CONTINUE|PAUSE|STOP>"
    }}
}}

Focus on identifying:
1. Market sentiment and emotional indicators
2. Potential volatility triggers
3. Liquidity concerns
4. Systemic risks
5. Event-driven risks

Provide specific, actionable insights for algorithmic trading decisions.
"""
        return prompt
    
    def _parse_risk_analysis(self, analysis_text):
        """Parse and validate the AI analysis response"""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                parsed = json.loads(json_str)
                
                # Validate required fields
                required_fields = ['sentiment_score', 'risk_level', 'risk_factors', 'market_impact', 'confidence', 'summary']
                for field in required_fields:
                    if field not in parsed:
                        parsed[field] = self._get_default_value(field)
                
                # Ensure numeric values are in valid ranges
                parsed['sentiment_score'] = max(-1.0, min(1.0, float(parsed.get('sentiment_score', 0.0))))
                parsed['confidence'] = max(0.0, min(1.0, float(parsed.get('confidence', 0.5))))
                
                # Add timestamp
                parsed['timestamp'] = datetime.utcnow().isoformat()
                
                return parsed
            else:
                # Fallback: create structured response from unstructured text
                return self._create_fallback_analysis(analysis_text)
                
        except (json.JSONDecodeError, ValueError) as e:
            return self._create_fallback_analysis(analysis_text)
    
    def _get_default_value(self, field):
        """Get default values for missing fields"""
        defaults = {
            'sentiment_score': 0.0,
            'risk_level': 'MEDIUM',
            'risk_factors': ['Insufficient data'],
            'market_impact': 'NEUTRAL',
            'confidence': 0.5,
            'summary': 'Analysis completed with limited data'
        }
        return defaults.get(field, None)
    
    def _create_fallback_analysis(self, analysis_text):
        """Create a fallback structured analysis when JSON parsing fails"""
        # Simple sentiment analysis based on keywords
        positive_keywords = ['bullish', 'positive', 'growth', 'strong', 'buy', 'optimistic']
        negative_keywords = ['bearish', 'negative', 'decline', 'weak', 'sell', 'pessimistic', 'risk', 'concern']
        
        text_lower = analysis_text.lower()
        positive_count = sum(1 for word in positive_keywords if word in text_lower)
        negative_count = sum(1 for word in negative_keywords if word in text_lower)
        
        sentiment_score = (positive_count - negative_count) / max(positive_count + negative_count, 1)
        sentiment_score = max(-1.0, min(1.0, sentiment_score))
        
        # Determine risk level based on sentiment and keywords
        if 'critical' in text_lower or 'high risk' in text_lower:
            risk_level = 'CRITICAL'
        elif 'medium risk' in text_lower or negative_count > positive_count:
            risk_level = 'MEDIUM'
        elif 'low risk' in text_lower or positive_count > negative_count:
            risk_level = 'LOW'
        else:
            risk_level = 'MEDIUM'
        
        return {
            'sentiment_score': sentiment_score,
            'risk_level': risk_level,
            'risk_factors': ['Parsed from unstructured analysis'],
            'market_impact': 'NEGATIVE' if sentiment_score < -0.2 else 'POSITIVE' if sentiment_score > 0.2 else 'NEUTRAL',
            'confidence': 0.3,  # Lower confidence for fallback analysis
            'summary': analysis_text[:200] + '...' if len(analysis_text) > 200 else analysis_text,
            'timestamp': datetime.utcnow().isoformat(),
            'recommendations': {
                'position_size_adjustment': 'DECREASE' if risk_level in ['HIGH', 'CRITICAL'] else 'MAINTAIN',
                'stop_loss_adjustment': 'TIGHTER' if risk_level in ['HIGH', 'CRITICAL'] else 'MAINTAIN',
                'trading_action': 'PAUSE' if risk_level == 'CRITICAL' else 'CONTINUE'
            }
        }

# Initialize the risk analyzer
risk_analyzer = RiskAnalyzer()

@ai_risk_bp.route('/analyze', methods=['POST'])
def analyze_risk():
    """Main endpoint for risk analysis"""
    try:
        data = request.get_json()
        
        if not data or 'text_data' not in data:
            return jsonify({'error': 'Missing text_data in request'}), 400
        
        text_data = data['text_data']
        asset_symbol = data.get('asset_symbol')
        ai_provider = data.get('ai_provider', 'ollama').lower()
        model = data.get('model', 'llama2')
        
        if ai_provider == 'chatgpt':
            result = risk_analyzer.analyze_with_chatgpt(text_data, asset_symbol)
        elif ai_provider == 'ollama':
            result = risk_analyzer.analyze_with_ollama(text_data, asset_symbol, model)
        else:
            return jsonify({'error': 'Invalid ai_provider. Use "chatgpt" or "ollama"'}), 400
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify({
            'success': True,
            'analysis': result,
            'provider': ai_provider,
            'model': model if ai_provider == 'ollama' else 'gpt-3.5-turbo'
        })
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@ai_risk_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'providers': {}
    }
    
    # Check OpenAI availability
    if OPENAI_API_KEY:
        status['providers']['chatgpt'] = 'configured'
    else:
        status['providers']['chatgpt'] = 'not_configured'
    
    # Check Ollama availability
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get('models', [])
            status['providers']['ollama'] = {
                'status': 'available',
                'models': [model['name'] for model in models]
            }
        else:
            status['providers']['ollama'] = {'status': 'unavailable', 'error': f'HTTP {response.status_code}'}
    except requests.exceptions.RequestException as e:
        status['providers']['ollama'] = {'status': 'unavailable', 'error': str(e)}
    
    return jsonify(status)

@ai_risk_bp.route('/config', methods=['POST'])
def update_config():
    """Update API configuration"""
    try:
        data = request.get_json()
        
        if 'openai_api_key' in data:
            global OPENAI_API_KEY
            OPENAI_API_KEY = data['openai_api_key']
            openai.api_key = OPENAI_API_KEY
            risk_analyzer.openai_client = openai
        
        if 'ollama_base_url' in data:
            global OLLAMA_BASE_URL
            OLLAMA_BASE_URL = data['ollama_base_url']
        
        return jsonify({'success': True, 'message': 'Configuration updated'})
        
    except Exception as e:
        return jsonify({'error': f'Configuration update failed: {str(e)}'}), 500

