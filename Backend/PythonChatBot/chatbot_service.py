"""
Modern Chatbot Service using Sentence Transformers
Compatible with Python 3.13+
"""
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging
import pickle
import os

logger = logging.getLogger(__name__)

class ModernChatBotService:
    """
    Modern chatbot using semantic similarity with sentence transformers
    Much better than ChatterBot and works with Python 3.13+
    """
    
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """
        Initialize the chatbot with a sentence transformer model
        
        Args:
            model_name: HuggingFace model name (default: all-MiniLM-L6-v2 - fast and accurate)
        """
        logger.info(f"Initializing Modern ChatBot with model: {model_name}")
        
        try:
            # Load sentence transformer model
            self.model = SentenceTransformer(model_name)
            
            # Storage for training data
            self.questions = []
            self.answers = []
            self.question_embeddings = None
            
            # Configuration
            self.similarity_threshold = 0.5  # Minimum similarity to return a match
            self.default_response = (
                "I apologize, but I don't have enough information to answer that question accurately. "
                "For specific medical advice, please consult with your healthcare provider or thalassemia specialist. "
                "Is there something else about thalassemia I can help you with?"
            )
            
            # Try to load existing training data
            self._load_training_data()
            
            logger.info("✅ Modern ChatBot initialized successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error initializing chatbot: {str(e)}")
            raise
    
    def train(self, training_data):
        """
        Train the chatbot with question-answer pairs
        
        Args:
            training_data: List of dicts with 'question' and 'answer' keys
        """
        try:
            logger.info(f"Training chatbot with {len(training_data)} conversation pairs...")
            
            # Extract questions and answers
            self.questions = [item['question'] for item in training_data]
            self.answers = [item['answer'] for item in training_data]
            
            # Generate embeddings for all questions
            logger.info("Generating embeddings (this may take a minute on first run)...")
            self.question_embeddings = self.model.encode(
                self.questions,
                show_progress_bar=True,
                convert_to_numpy=True
            )
            
            # Save training data
            self._save_training_data()
            
            logger.info(f"✅ Training completed! {len(self.questions)} questions indexed.")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error during training: {str(e)}")
            return False
    
    def get_response(self, user_message, session_id=None, conversation_id=None):
        """
        Get chatbot response using hybrid approach:
        1. Check training data first (fast)
        2. If confidence is low, use LLM (smart)
        
        Args:
            user_message: The user's input message
            session_id: Optional session identifier
            conversation_id: Optional conversation ID for context
            
        Returns:
            dict: Response containing bot message, confidence, and metadata
        """
        try:
            if not self.questions or self.question_embeddings is None:
                logger.warning("Chatbot not trained yet!")
                return {
                    'response': self.default_response,
                    'confidence': 0.0,
                    'session_id': session_id,
                    'conversation_id': conversation_id,
                    'used_llm': False
                }
            
            logger.info(f"Processing message: '{user_message[:50]}...'")
            
            # Generate embedding for user message
            user_embedding = self.model.encode([user_message], convert_to_numpy=True)
            
            # Calculate cosine similarity with all training questions
            similarities = cosine_similarity(user_embedding, self.question_embeddings)[0]
            
            # Get best match
            best_match_idx = np.argmax(similarities)
            best_similarity = similarities[best_match_idx]
            
            logger.info(f"Best match similarity: {best_similarity:.3f}")
            
            # HYBRID APPROACH: Use training data if confidence is high enough
            if best_similarity >= 0.7:  # High confidence threshold for training data
                response = self.answers[best_match_idx]
                confidence = float(best_similarity)
                used_llm = False
                logger.info(f"✅ Using training data (confidence: {confidence:.2%})")
            
            # Otherwise, try LLM fallback
            else:
                logger.info(f"⚠️  Low confidence ({best_similarity:.2%}), trying LLM fallback...")
                
                # Import here to avoid circular dependency
                from llm_service import get_llm_service
                from conversation_manager import get_conversation_manager
                
                llm_service = get_llm_service()
                
                logger.info(f"Checking for conversation ID: {conversation_id}")
                
                if conversation_id:
                    # Get conversation history
                    conv_manager = get_conversation_manager()
                    history = conv_manager.get_conversation_history(conversation_id, limit=10)
                    
                    # Get LLM response with context (using robust re-check)
                    llm_response, success = llm_service.check_and_get_response(
                        user_message,
                        conversation_history=history,
                        training_context=self.answers[best_match_idx] if best_similarity >= self.similarity_threshold else None
                    )
                    
                    if success:
                        response = llm_response
                        confidence = 0.85  # LLM responses get high confidence
                        used_llm = True
                        logger.info(f"🤖 Using LLM response")
                    else:
                        response = self.default_response
                        confidence = 0.0
                        used_llm = False
                else:
                    # LLM not available, use default response
                    response = self.default_response
                    confidence = 0.0
                    used_llm = False
                    logger.warning("LLM not available, using default response")
            
            return {
                'response': response,
                'confidence': confidence,
                'session_id': session_id,
                'conversation_id': conversation_id,
                'matched_question': self.questions[best_match_idx] if best_similarity >= self.similarity_threshold else None,
                'used_llm': used_llm
            }
            
        except Exception as e:
            logger.error(f"❌ Error generating response: {str(e)}")
            return {
                'response': self.default_response,
                'confidence': 0.0,
                'error': str(e),
                'used_llm': False
            }
    
    def _save_training_data(self):
        """Save training data to disk for faster startup"""
        try:
            data = {
                'questions': self.questions,
                'answers': self.answers,
                'embeddings': self.question_embeddings
            }
            
            with open('chatbot_training.pkl', 'wb') as f:
                pickle.dump(data, f)
            
            logger.info("Training data saved to disk")
            
        except Exception as e:
            logger.warning(f"Could not save training data: {str(e)}")
    
    def _load_training_data(self):
        """Load training data from disk if available"""
        try:
            if os.path.exists('chatbot_training.pkl'):
                logger.info("Loading existing training data...")
                
                with open('chatbot_training.pkl', 'rb') as f:
                    data = pickle.load(f)
                
                self.questions = data['questions']
                self.answers = data['answers']
                self.question_embeddings = data['embeddings']
                
                logger.info(f"✅ Loaded {len(self.questions)} trained questions from disk")
                
        except Exception as e:
            logger.info(f"No existing training data found (this is normal on first run)")
    
    def get_training_status(self):
        """
        Get information about the chatbot's training status
        
        Returns:
            dict: Training statistics
        """
        return {
            'total_questions': len(self.questions),
            'is_trained': len(self.questions) > 0,
            'model_name': self.model.get_sentence_embedding_dimension(),
            'similarity_threshold': self.similarity_threshold
        }
    
    def add_conversation(self, question, answer):
        """
        Add a new conversation pair and retrain
        
        Args:
            question: User question
            answer: Bot answer
        """
        try:
            self.questions.append(question)
            self.answers.append(answer)
            
            # Re-generate embeddings
            self.question_embeddings = self.model.encode(
                self.questions,
                convert_to_numpy=True
            )
            
            self._save_training_data()
            
            logger.info(f"Added new conversation. Total: {len(self.questions)}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding conversation: {str(e)}")
            return False

# Global chatbot instance
_chatbot_instance = None

def get_chatbot_instance():
    """
    Get or create the global chatbot instance (Singleton pattern)
    """
    global _chatbot_instance
    
    if _chatbot_instance is None:
        _chatbot_instance = ModernChatBotService()
    
    return _chatbot_instance
