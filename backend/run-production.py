from waitress import serve 
import os
import logging
from app import create_app

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger(__name__)

app = create_app()

if __name__=='__main__':
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting server on port {port} in production mode")
    serve(app, host="0.0.0.0", port=port )