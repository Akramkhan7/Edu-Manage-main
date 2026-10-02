# 🎓 EduManage

EduManage is a full-stack Learning Management System (LMS) built with React, Firebase, Express.js, and Node.js. It provides separate portals for Teachers and Students, enabling assignment management, submissions, plagiarism detection, grading, and announcements.

---

## ✨ Features

### 👨‍🏫 Teacher Panel

- Teacher Authentication
- Subject Management
- Assignment Management
- Unlock/Lock Assignments
- View Student Submissions
- Plagiarism Detection
- Grade & Review Assignments
- Announcements
- Dashboard & Analytics

### 👨‍🎓 Student Panel

- Student Authentication
- View Subjects & Assignments
- Submit Assignments (PDF)
- View Grades & Feedback
- Plagiarism Report
- Announcements
- Profile Management

---

## 🛠 Tech Stack

### Frontend

- React.js
- Redux Toolkit
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
(Firebase APIs)

### Database

- Firebase Realtime Database

### Storage

- Cloudinary

### Authentication

- Firebase Authentication (REST API)

---

## 📁 Project Structure

```
Edu-Manage/
│
├── teacher/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── student/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── server/
    ├── routes/
    ├── controllers/
    ├── config/
    └── package.json
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Edu-Manage.git
```

Move into the project

```bash
cd Edu-Manage
```

---

## ▶️ Run Teacher Panel

```bash
cd teacher
npm install
npm run dev
```

Runs on

```
http://localhost:5174
```

---

## ▶️ Run Student Panel

```bash
cd student
npm install
npm run dev
```

Runs on

```
http://localhost:5173
```

---

## ▶️ Run Backend

```bash
cd server
npm install
npm run dev
```

Runs on

```
http://localhost:8000
```

---

## 🔑 Environment Variables

### Teacher

Create `.env`

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
VITE_TEACHER_URL=http://localhost:5174
VITE_STUDENT_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:8000
```

### Student

Create `.env`

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
VITE_TEACHER_URL=http://localhost:5174
VITE_STUDENT_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:8000
```

### Server

Create `.env`

```env
PORT=8000
FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
FIREBASE_SERVICE_ACCOUNT_BASE64=YOUR_SERVICE_ACCOUNT_BASE64
```

---

## 🌐 Deployment

### Teacher Panel

Vercel

### Student Panel

Vercel

### Backend

Render

---

## 📸 Screenshots

Add screenshots of:

- Login
- Teacher Dashboard
- Student Dashboard
- Assignment Page
- Submission Review
- Grades

---

## 👨‍💻 Author

Akram Khan

GitHub: https://github.com/Akramkhan7