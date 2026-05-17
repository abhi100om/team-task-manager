# Team Task Manager

A full-stack Team Task Management Web Application built using React, Node.js, Express, PostgreSQL, and Prisma.

## Features

### Authentication
- User Signup
- User Login
- JWT Authentication
- Protected Routes

### Project Management
- Create Projects
- View Projects
- Role-Based Access

### Task Management
- Create Tasks
- Assign Tasks
- Update Task Status
- Priority Levels
- Due Dates

### Dashboard Analytics
- Total Tasks
- Completed Tasks
- In Progress Tasks
- Todo Tasks
- Overdue Tasks

---

# Tech Stack

## Frontend
- React.js
- Axios
- TailwindCSS

## Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

# Folder Structure

team-task-manager/
│
├── frontend/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── prisma/
│ └── server.js

---

# Installation

## Clone Repository

```bash
git clone https://github.com/abhi100om/team-task-manager.git
```

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Deployment

- Backend: Railway
- Database: Railway PostgreSQL
- Frontend: Railway/Vercel

---

# API Endpoints

## Auth
- POST /api/auth/signup
- POST /api/auth/login

## Projects
- POST /api/projects
- GET /api/projects

## Tasks
- POST /api/tasks
- GET /api/tasks
- PUT /api/tasks/:id

## Dashboard
- GET /api/dashboard

---
This project is licensed under the [MIT License](LICENSE).
# Author

Abhishek Singh
