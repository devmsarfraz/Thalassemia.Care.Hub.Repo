"""
Configuration settings for ChatterBot Flask service
"""
import os

class Config:
    """Base configuration"""
    # Flask settings
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # CORS settings - Allow ASP.NET Core backend
    CORS_ORIGINS = [
        'http://localhost:5176',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5176',
        'http://127.0.0.1:5173',
    ]
    
    # ChatterBot settings
    CHATBOT_NAME = 'ThalassemiaCareBot'
    DATABASE_URI = 'sqlite:///database.sqlite3'
    
    # Training settings
    ENABLE_AUTO_TRAINING = True
    TRAINING_DATA_PATH = 'training_data'
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = 'chatbot.log'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
