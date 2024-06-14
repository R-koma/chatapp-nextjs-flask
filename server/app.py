import os
from flask import Flask
from flask_socketio import SocketIO, send
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
socketio = SocketIO(app, cors_allowed_origins="*") # TODO: ポート番号設定

@socketio.on('message')
def handle_message(msg):
  print('Message: ' + msg)
  send(msg, broadcast=True)

if __name__ == '__main__':
  socketio.run(app, debug=True)