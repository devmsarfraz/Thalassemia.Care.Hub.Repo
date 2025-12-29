"""
Entry point for running the ChatterBot Flask service
"""
import sys
import logging
from app import app, Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Main entry point for the application"""
    try:
        logger.info("=" * 60)
        logger.info("🏥 Thalassemia Care Hub - ChatterBot Service")
        logger.info("=" * 60)
        logger.info(f"Host: {Config.HOST}")
        logger.info(f"Port: {Config.PORT}")
        logger.info(f"Debug: {Config.DEBUG}")
        logger.info(f"Database: {Config.DATABASE_URI}")
        logger.info("=" * 60)
        logger.info("Starting Flask server...")
        logger.info("Press CTRL+C to stop the server")
        logger.info("=" * 60)
        
        # Run Flask app
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            use_reloader=False  # Disable reloader to prevent double initialization
        )
        
    except KeyboardInterrupt:
        logger.info("\n👋 Shutting down gracefully...")
        sys.exit(0)
    except Exception as e:
        logger.error(f"❌ Fatal error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
