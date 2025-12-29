"""
Test suite for ChatterBot service
Run with: pytest test_chatbot.py -v
"""
import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chatbot_service import ThalassemiaChatBotService
from training_data import BASIC_KNOWLEDGE, get_training_conversations

class TestChatBotService:
    """Test cases for ChatterBot service"""
    
    @pytest.fixture
    def chatbot(self):
        """Create a chatbot instance for testing"""
        return ThalassemiaChatBotService()
    
    def test_chatbot_initialization(self, chatbot):
        """Test that chatbot initializes successfully"""
        assert chatbot is not None
        assert chatbot.chatbot is not None
    
    def test_training_with_conversations(self, chatbot):
        """Test training with conversation pairs"""
        test_conversations = [
            ["What is thalassemia?", "Thalassemia is a genetic blood disorder."],
            ["Is it contagious?", "No, thalassemia is not contagious."]
        ]
        
        result = chatbot.train_with_conversations(test_conversations)
        assert result == True
    
    def test_get_response(self, chatbot):
        """Test getting a response from the chatbot"""
        # Train with basic data first
        conversations = [[item["question"], item["answer"]] for item in BASIC_KNOWLEDGE[:3]]
        chatbot.train_with_conversations(conversations)
        
        # Get response
        result = chatbot.get_response("What is thalassemia?")
        
        assert 'response' in result
        assert 'confidence' in result
        assert isinstance(result['response'], str)
        assert len(result['response']) > 0
    
    def test_training_status(self, chatbot):
        """Test getting training status"""
        status = chatbot.get_training_status()
        
        assert 'total_statements' in status
        assert 'database_uri' in status
        assert 'chatbot_name' in status

class TestFlaskAPI:
    """Test cases for Flask API endpoints"""
    
    @pytest.fixture
    def client(self):
        """Create a test client for Flask app"""
        from app import app
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    def test_health_endpoint(self, client):
        """Test health check endpoint"""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'service' in data
    
    def test_chat_endpoint(self, client):
        """Test chat endpoint"""
        response = client.post('/api/chat', json={
            'message': 'Hello',
            'session_id': 'test-session'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        
        assert data['success'] == True
        assert 'response' in data
        assert 'confidence' in data
    
    def test_chat_endpoint_missing_message(self, client):
        """Test chat endpoint with missing message"""
        response = client.post('/api/chat', json={})
        assert response.status_code == 400
    
    def test_status_endpoint(self, client):
        """Test status endpoint"""
        response = client.get('/api/status')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] == True
        assert 'status' in data

class TestTrainingData:
    """Test cases for training data"""
    
    def test_training_data_format(self):
        """Test that training data has correct format"""
        conversations = get_training_conversations()
        
        assert len(conversations) > 0
        
        for conversation in conversations:
            assert len(conversation) == 2
            assert isinstance(conversation[0], str)
            assert isinstance(conversation[1], str)
            assert len(conversation[0]) > 0
            assert len(conversation[1]) > 0
    
    def test_basic_knowledge_data(self):
        """Test basic knowledge training data"""
        assert len(BASIC_KNOWLEDGE) > 0
        
        for item in BASIC_KNOWLEDGE:
            assert 'question' in item
            assert 'answer' in item
            assert len(item['question']) > 0
            assert len(item['answer']) > 0

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
