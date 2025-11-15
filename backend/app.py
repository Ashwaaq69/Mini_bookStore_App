import os
import datetime
import jwt
import hashlib
from functools import wraps
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# ===== Flask Config =====
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# OR for specific origins
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# PostgreSQL connection string
# Update with your credentials: username, password, host, port, dbname
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:aothecode@localhost:5432/bookstore_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET'] = 'super_secret_key' 
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['JWT_EXPIRES_MINUTES'] = 60

db = SQLAlchemy(app)

# ===== Models =====
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    userEmail = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'admin' or 'user'

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    published_date = db.Column(db.String(50))
    available = db.Column(db.Boolean, default=True)


class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    token = db.Column(db.String(200), nullable=False, unique=True)
    expires_at = db.Column(db.DateTime, nullable=False)


# ===== JWT Utility Functions =====
def create_access_token(user_id, username, role):
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=app.config['JWT_EXPIRES_MINUTES'])
    payload = {"sub": str(user_id), "username": username, "role": role, "exp": exp}
    # payload = {"sub": user_id, "username": username, "role": role, "exp": exp}
    token = jwt.encode(payload, app.config['JWT_SECRET'], algorithm=app.config['JWT_ALGORITHM'])
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def decode_token(token):
    try:
        return jwt.decode(token, app.config['JWT_SECRET'], algorithms=[app.config['JWT_ALGORITHM']])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization header required"}), 401
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({"error": "Invalid Authorization format"}), 401

        token = parts[1]
        payload = decode_token(token)
        if not isinstance(payload, dict) or payload.get('error'):
            return jsonify({"error": payload.get('error', 'Invalid token')}), 401
        request.user = {"id": payload['sub'], "username": payload['username'], "role": payload['role']}
        return f(*args, **kwargs)
    return decorated


def require_role(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not getattr(request, 'user', None):
                return jsonify({"error": "Unauthorized"}), 401
            if request.user['role'] != role:
                return jsonify({"error": "Forbidden: Admins only"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator


# ===== Database Initialization =====
# ===== Database Initialization =====
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            userEmail='admin@example.com',
            password_hash=generate_password_hash('adminpass'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()


# ===== Routes =====

@app.route('/')
def home():
    return jsonify({"message": "📚 Welcome to the Bookstore API (PostgreSQL + JWT + Roles)"})


# --- AUTH ROUTES ---

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')  # FIXED
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "username, email, and password are required"}), 400

    if User.query.filter((User.username == username) | (User.userEmail == email)).first():
        return jsonify({"error": "Username or Email already exists"}), 400

    user = User(username=username, userEmail=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username, password = data.get('username'), data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(user.id, user.username, user.role)
    return jsonify({"message": "Login successful", "access_token": token, "role": user.role})


@app.route('/change_password', methods=['POST'])
@token_required
def change_password():
    data = request.get_json() or {}
    current_password, new_password = data.get('current_password'), data.get('new_password')

    user = User.query.get(request.user['id'])
    if not user or not user.check_password(current_password):
        return jsonify({"error": "Invalid current password"}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password changed successfully"})


@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    user = User.query.filter_by(userEmail=email).first()
    if not user:
        return jsonify({"error": "No account found for this email"}), 404

    raw = f"{user.id}:{datetime.datetime.utcnow()}:{app.config['JWT_SECRET']}"
    token = hashlib.sha256(raw.encode()).hexdigest()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)

    reset_token = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.session.add(reset_token)
    db.session.commit()

    return jsonify({
        "message": "Password reset token created (send via email in production)",
        "reset_token": token
    })


@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token, new_password = data.get('token'), data.get('new_password')

    reset_token = PasswordResetToken.query.filter_by(token=token).first()
    if not reset_token or reset_token.expires_at < datetime.datetime.utcnow():
        return jsonify({"error": "Invalid or expired reset token"}), 400

    user = User.query.get(reset_token.user_id)
    user.password_hash = generate_password_hash(new_password)

    PasswordResetToken.query.filter_by(user_id=user.id).delete()
    db.session.commit()

    return jsonify({"message": "Password reset successful"})


# --- BOOK ROUTES ---

@app.route('/books', methods=['POST'])
@token_required
@require_role('admin')
def create_book():
    data = request.get_json() or {}
    title, author = data.get('title'), data.get('author')
    published_date, available = data.get('published_date'), data.get('available', True)

    if not title or not author:
        return jsonify({"error": "Title and author are required"}), 400

    new_book = Book(title=title, author=author, published_date=published_date, available=available)
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully"}), 201


@app.route('/books', methods=['GET'])
@token_required
def get_books():
    all_books = Book.query.all()
    return jsonify([
        {
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "published_date": b.published_date,
            "available": b.available
        } for b in all_books
    ])

#get abook
@app.route('/books/<int:book_id>', methods=['GET'])
@token_required
def get_book(book_id):
    b = Book.query.get(book_id)
    if not b:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({
        "id": b.id,
        "title": b.title,
        "author": b.author,
        "published_date": b.published_date,
        "available": b.available
    })
    

#update abook 
@app.route('/books/<int:book_id>', methods=['PUT'])
@token_required
@require_role('admin')
def update_book(book_id):
    b = Book.query.get(book_id)
    if not b:
        return jsonify({"error": "Book not found"}), 404
    data = request.get_json() or {}
    b.title = data.get('title', b.title)
    b.author = data.get('author', b.author)
    b.published_date = data.get('published_date', b.published_date)
    b.available = data.get('available', b.available)
    db.session.commit()
    return jsonify({"message": "Book updated successfully"})

#delete a  book
@app.route('/books/<int:book_id>', methods=['DELETE'])
@token_required
@require_role('admin')
def delete_book(book_id):
    b = Book.query.get(book_id)
    if not b:
        return jsonify({"error": "Book not found"}), 404
    db.session.delete(b)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})


# ===== Run App =====
if __name__ == '__main__':
    app.run(debug=True)
