from app import create_app;
import logging
app = create_app()

@app.route('/')
def server_start():
    return "Server started!"

def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

if __name__ == "__main__" :
    configure_logging()
    app.run(debug=True)
    


    
