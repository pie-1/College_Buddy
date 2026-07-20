# 🎓 CollegeBuddy

> **Share what you have. Borrow what you need.**

A community-driven lending platform that helps college students share books, tools, notes, games, and other resources.

---

![CollegeBuddy Logo](client/public/Buddy-logo.png)

---

# Features

## Authentication

- College Email Verification
- JWT Authentication
- Google OAuth

## Item Sharing

- List Items
- Browse Available Items
- Borrow & Return
- Search & Filters

## Community

- Real-time Chat
- College Events
- Project Showcase
- Find Teammates

## Responsive Design

Works on:

- Desktop
- Tablet
- Mobile

---

# Future Features

- ⭐ Rating System
- 🤖 AI Recommendations
- 📈 User Analytics
- 🔔 Notifications

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Real-time | Socket.io |
| Storage | Cloudinary |
| Email | Nodemailer |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

# Project Structure

```
collegebuddy/

├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── utils/
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── tests/
│
├── docs/
│
├── .github/
│
├── README.md
└── LICENSE
```

---

# Prerequisites

- Node.js 18+
- npm
- MongoDB

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/collegebuddy.git

cd collegebuddy
```

---

## Backend

```bash
cd server

npm install

cp .env.example .env

npm run dev
```

---

## Frontend

```bash
cd client

npm install

cp .env.example .env

npm run dev
```

---

## Seed Database

```bash
cd server

npm run seed
```

---

# Running

| Service | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |

---

# Environment Variables

## Backend

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:5173
```

---

## Frontend

```env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=
```

---

# Deployment

## Backend (Render)

1. Push code to GitHub
2. Create a Render Web Service
3. Connect repository
4. Add environment variables
5. Build Command

```bash
npm install
```

6. Start Command

```bash
npm start
```

---

## Frontend (Vercel)

1. Import GitHub Repository
2. Add Environment Variables
3. Deploy

---

# Contributing

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit
git commit -m "feat(auth): add login"

# Push
git push origin feature/feature-name
```

Open a Pull Request targeting the **dev** branch.

---

# Team

| Role | Responsibility |
|------|----------------|
| Project Lead | Architecture, Deployment |
| Frontend | React UI |
| Backend | API & Database |
| QA | Testing & Documentation |

---

# License

Licensed under the MIT License.

---

# Acknowledgements

- Faculty mentors
- Contributors
- College community

---

Made with ❤️ for students.