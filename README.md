# Mini_bookStore_App


📚 BookStore Application

A full-stack web application to manage and explore books. Features user authentication, role-based access, and a responsive UI built with React and Tailwind CSS. The backend is powered by Flask with JWT authentication.

🛠 Features
User Roles

Admin

Perform CRUD operations on books.

Access admin panel for management.

User

View the list of books.

Search books by title or author.

View detailed information about each book.

Change own password and reset forgotten password.

Authentication

Register new users.

Login with JWT authentication.

Forgot password and reset password functionality.

Change password feature for logged-in users.

UI / UX

Responsive design with Tailwind CSS.

Book cards with availability status.

Book details modal for a clean user experience.

Search bar to filter books by title or author.

Navbar dynamically changes based on user login state.

🖥 Tech Stack

Frontend: React, React Router, Tailwind CSS, Lucide icons

Backend: Flask, SQLAlchemy, Flask-JWT-Extended

Database: SQLite / PostgreSQL / MySQL (configurable)

Authentication: JWT

HTTP Requests: Axios



⚙ Installation
Backend
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

Frontend
cd frontend
npm install
npm start


The frontend runs on http://localhost:3000 and communicates with the backend API on http://localhost:5000.

🔑 Usage

Register / Login as a user or admin.

Admin can:

Add, edit, delete books.

Access admin panel.

User can:

Browse all books.

Search and view book details.

Reset password or change own password.