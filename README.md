📌 Task Management System

## A full-stack Task Management Application built using:

1. Backend: Django REST Framework + JWT Authentication
2. Frontend: React (Vite)
3. Database: SQLite (default)
4. Features: User roles (Admin/Employee), Task assignment, Comments, Status updates, Due dates, Priority levels, Employee management, etc.

### Features
## Admin Features

1. Create / Edit / Delete tasks
2. Assign tasks to employees
3. Create new users (Admin or Employee)
4. View employee list
5. View all tasks

## Employee Features
1. View only their assigned tasks
2. Update status of assigned tasks
3. Add comments
4. View who assigned the task

## Task Features

* Title
* Description
* Priority (Low / Medium / High)
* Status (To Do / In Progress / Done)
* Due Date
* Creator & Assignee
* Comments

## Installation Guide
1. Clone the Repository
git clone https://github.com/vaisagh-mp/task-management-app.git
cd your-repository-name

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py migrate

# Start the Backend Server
python manage.py runserver


## Frontend Setup (React + Vite)

# Navigate to the frontend folder:
cd task-frontend

npm install

# Start React Development Server
npm run dev

