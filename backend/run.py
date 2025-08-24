from app import create_app;
app = create_app()

@app.route('/')
def server_start():
    return "Server started!"

if __name__ == "__main__" :
    app.run(debug=True)
    
