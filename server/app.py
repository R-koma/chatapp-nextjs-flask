import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, send, emit
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

class Message(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user = db.Column(db.String(50), nullable=False)
  content = db.Column(db.String(200), nullable=False)

# データベースを初期化するための関数
def init_db():
  with app.app_context():
    db.create_all()

@socketio.on('message')
def handle_message(data):
  user = data['user']
  msg = data['message']
  try:
    new_message = Message(user=user, content=msg)
    db.session.add(new_message)
    db.session.commit()
    send({'user': user, 'message': msg}, broadcast=True)
  except Exception as e:
    print(f'Error: {e}')
    db.session.rollback()

@socketio.on('reconnect')
def handle_reconnect():
  messages = Message.query.all()
  messages_content = [{'user': msg.user, 'message': msg.content} for msg in messages]
  emit('reconnect_messages', messages_content)


if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  socketio.run(app, debug=True)