"""
Flask REST API for ChatterBot Service
Provides endpoints for chat, training, and health checks
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from config import Config, config
from chatbot_service import get_chatbot_instance
from training_data import get_training_conversations
import os

# Configure logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(Config.LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Get configuration
env = os.getenv('FLASK_ENV', 'development')
app.config.from_object(config[env])

# Enable CORS for ASP.NET Core backend
CORS(app, resources={
    r"/api/*": {
        "origins": Config.CORS_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize chatbot
chatbot_service = None

def initialize_chatbot():
    """Initialize and train the chatbot on startup"""
    global chatbot_service
    
    try:
        logger.info("Starting Thalassemia Care Hub Chatbot Service...")
        
        # Get chatbot instance
        chatbot_service = get_chatbot_instance()
        
        # Auto-train if enabled and not already trained
        if Config.ENABLE_AUTO_TRAINING:
            status = chatbot_service.get_training_status()
            
            if not status['is_trained']:
                logger.info("Auto-training enabled. Loading training data...")
                
                # Get training data
                from training_data import ALL_TRAINING_DATA
                
                # Train the chatbot
                chatbot_service.train(ALL_TRAINING_DATA)
                
                logger.info(f"Training completed with {len(ALL_TRAINING_DATA)} thalassemia-specific conversations!")
            else:
                logger.info(f"Chatbot already trained with {status['total_questions']} questions")
        
        logger.info("Chatbot service ready!")
        
    except Exception as e:
        logger.error(f"Failed to initialize chatbot: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        status = chatbot_service.get_training_status() if chatbot_service else {}
        
        return jsonify({
            'status': 'healthy',
            'service': 'ThalassemiaCareBot',
            'version': '1.0.0',
            'training_status': status
        }), 200
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Send a message to the chatbot and get a response
    
    Request body:
    {
        "message": "User message",
        "session_id": "optional-session-id"
    }
    """
    try:
        # Validate request
        if not request.json or 'message' not in request.json:
            return jsonify({
                'error': 'Missing required field: message'
            }), 400
        
        user_message = request.json['message']
        session_id = request.json.get('session_id', None)
        
        # Validate message
        if not user_message or not user_message.strip():
            return jsonify({
                'error': 'Message cannot be empty'
            }), 400
        
        logger.info(f"Chat request - Session: {session_id}, Message: '{user_message[:50]}...'")
        
        # Get response from chatbot
        result = chatbot_service.get_response(user_message, session_id)
        
        return jsonify({
            'success': True,
            'message': user_message,
            'response': result['response'],
            'confidence': result['confidence'],
            'session_id': result.get('session_id')
        }), 200
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'response': 'I apologize, but I encountered an error. Please try again.'
        }), 500

@app.route('/api/train', methods=['POST'])
def train():
    """
    Train the chatbot with custom conversation data
    
    Request body:
    {
        "conversations": [
            {
                "question": "Question text",
                "answer": "Answer text"
            }
        ]
    }
    """
    try:
        # Validate request
        if not request.json or 'conversations' not in request.json:
            return jsonify({
                'error': 'Missing required field: conversations'
            }), 400
        
        conversations_data = request.json['conversations']
        
        if not conversations_data:
            return jsonify({
                'error': 'No valid conversations provided'
            }), 400
        
        logger.info(f"Training request with {len(conversations_data)} conversations")
        
        # Train the chatbot
        success = chatbot_service.train(conversations_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Successfully trained with {len(conversations_data)} conversations',
                'count': len(conversations_data)
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Training failed'
            }), 500
        
    except Exception as e:
        logger.error(f"Error in train endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get chatbot training status and statistics"""
    try:
        status = chatbot_service.get_training_status()
        
        return jsonify({
            'success': True,
            'status': status
        }), 200
        
    except Exception as e:
        logger.error(f"Error in status endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/reset', methods=['DELETE'])
def reset_chatbot():
    """
    Reset the chatbot (clear all training data)
    WARNING: This will delete all learned conversations
    """
    try:
        logger.warning("Reset request received")
        
        # Re-initialize and train
        initialize_chatbot()
        
        return jsonify({
            'success': True,
            'message': 'Chatbot reset and retrained successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in reset endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Error handlers

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

# Initialize chatbot on startup
with app.app_context():
    initialize_chatbot()

if __name__ == '__main__':
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
