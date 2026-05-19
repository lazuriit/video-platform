import os
from flask import Blueprint, jsonify, request, current_app, send_from_directory
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Video, Message

api = Blueprint('api', __name__)

@api.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Бэкенд YADRO успешно работает!"}), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('first_name') or not data.get('last_name'):
        return jsonify({"error": "Заполните все поля"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Пользователь с такой почтой уже существует"}), 400
    new_user = User(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Регистрация прошла успешно!"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Укажите почту и пароль"}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Неверная почта или пароль"}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Успешный вход",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }), 200

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/videos/upload', methods=['POST'])
@jwt_required()
def upload_video():
    current_user_id = get_jwt_identity()
    if 'video' not in request.files:
        return jsonify({"error": "Файл видео не найден в запросе"}), 400
    file = request.files['video']
    title = request.form.get('title', 'Без названия')
    if file.filename == '':
        return jsonify({"error": "Файл не выбран"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        new_video = Video(title=title, filename=filename, user_id=current_user_id)
        db.session.add(new_video)
        db.session.commit()
        return jsonify({"message": "Видео успешно загружено!", "filename": filename}), 201
    return jsonify({"error": "Недопустимый формат файла"}), 400

@api.route('/videos', methods=['GET'])
def get_videos():
    videos = Video.query.all()
    videos_list = []
    for v in videos:
        author = User.query.get(v.user_id)
        author_name = f"{author.first_name} {author.last_name}" if author else "Неизвестен"
        videos_list.append({
            "id": v.id,
            "title": v.title,
            "filename": v.filename,
            "author": author_name,
            "stream_url": f"https://video-platform-kqvw.onrender.com/videos/stream/{v.filename}"
        })
    return jsonify(videos_list), 200

@api.route('/videos/stream/<filename>', methods=['GET'])
def stream_video(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@api.route('/chat', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.timestamp.asc()).all()
    result = []
    for m in messages:
        author = User.query.get(m.user_id)
        author_name = f"{author.first_name}" if author else "Аноним"
        result.append({
            "id": m.id,
            "text": m.text,
            "author": author_name
        })
    return jsonify(result), 200

@api.route('/chat', methods=['POST'])
@jwt_required()
def post_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('text'):
        return jsonify({"error": "Пустое сообщение"}), 400
    new_message = Message(text=data['text'], user_id=current_user_id)
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Отправлено"}), 201