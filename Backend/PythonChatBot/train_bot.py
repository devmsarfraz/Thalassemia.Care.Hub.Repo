"""
Training script for the Modern Thalassemia Care Hub Chatbot
Run this script to train the chatbot with all available training data
"""
import logging
from chatbot_service import get_chatbot_instance
from training_data import ALL_TRAINING_DATA

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def train_chatbot():
    """Train the chatbot with all available training data"""
    try:
        logger.info("=" * 60)
        logger.info("🎓 Thalassemia Care Hub - Modern Chatbot Training")
        logger.info("=" * 60)
        
        # Get chatbot instance
        logger.info("Initializing chatbot...")
        chatbot = get_chatbot_instance()
        
        # Prepare training data
        logger.info(f"\n💉 Preparing {len(ALL_TRAINING_DATA)} thalassemia-specific conversations...")
        
        # Train the chatbot
        success = chatbot.train(ALL_TRAINING_DATA)
        
        if not success:
            logger.error("❌ Training failed!")
            return False
        
        # Get training status
        status = chatbot.get_training_status()
        
        logger.info("\n" + "=" * 60)
        logger.info("✅ Training completed successfully!")
        logger.info("=" * 60)
        logger.info(f"Total questions trained: {status['total_questions']}")
        logger.info(f"Model embedding dimension: {status['model_name']}")
        logger.info(f"Similarity threshold: {status['similarity_threshold']}")
        logger.info("=" * 60)
        
        # Test the chatbot
        logger.info("\n🧪 Testing chatbot with sample questions...")
        
        test_questions = [
            "What is thalassemia?",
            "Is it contagious?",
            "Can I exercise?",
        ]
        
        for question in test_questions:
            response = chatbot.get_response(question)
            logger.info(f"\nQ: {question}")
            logger.info(f"A: {response['response'][:100]}...")
            logger.info(f"Confidence: {response['confidence']:.2%}")
        
        logger.info("\n" + "=" * 60)
        logger.info("🚀 Chatbot is ready to use!")
        logger.info("Run 'python run.py' to start the Flask server")
        logger.info("=" * 60)
        
        return True
        
    except Exception as e:
        logger.error(f"\n❌ Training failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = train_chatbot()
    exit(0 if success else 1)
