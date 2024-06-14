import os
from flask import Flask
from flask_socketio import SocketIO, send
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@socketio.on('message')
def handle_message(msg):
  print('Message: ' + msg)
  send(msg, broadcast=True)

if __name__ == '__main__':
  socketio.run(app, debug=True)