# 📚 Study Resources

> This guide provides a learning roadmap for each team member. Follow the resources in order and focus on the topics related to your assigned responsibilities. All links below are official documentation unless otherwise noted.

---

# How to Use This Guide

Priority levels:

* 🟢 **Must Learn** – Required before starting development.
* 🟡 **Learn During Development** – Learn while implementing features.
* ⚪ **Optional** – Helpful for improving your skills but not required for project completion.

---

# 🎯 Project Lead

## Responsibilities

* Project architecture
* Authentication
* Deployment
* Code reviews
* CI/CD
* Backend configuration

---

## Project Files

```text
server/src/config/
server/src/services/
server/src/middleware/
.github/workflows/
docker-compose.yml
README.md
```

---

## Learning Roadmap

| Priority | Topic                 | Why You Need It                                  |
| -------- | --------------------- | ------------------------------------------------ |
| 🟢       | Git & GitHub          | Manage branches, reviews, and collaboration      |
| 🟢       | Express.js            | Understand backend architecture                  |
| 🟢       | JWT Authentication    | Secure user authentication                       |
| 🟢       | Environment Variables | Manage project configuration securely            |
| 🟡       | Socket.io             | Configure real-time communication                |
| 🟡       | Cloudinary            | Store uploaded images                            |
| 🟡       | Nodemailer            | Email verification and notifications             |
| 🟡       | GitHub Actions        | Automate testing and deployment                  |
| ⚪        | Docker                | Run the project consistently across environments |

### Official Documentation

* Git — https://git-scm.com/doc
* GitHub Docs — https://docs.github.com/
* Express.js — https://expressjs.com/
* JWT Introduction — https://jwt.io/introduction
* Socket.IO — https://socket.io/docs/v4/
* Cloudinary Docs — https://cloudinary.com/documentation
* Nodemailer — https://nodemailer.com/
* GitHub Actions — https://docs.github.com/actions
* Docker — https://docs.docker.com/

---

# 💻 Frontend Developer

## Responsibilities

* Build the user interface
* Create reusable React components
* Connect frontend with backend APIs
* Implement responsive layouts

---

## Project Files

```text
client/src/components/
client/src/pages/
client/src/context/
client/src/hooks/
client/src/api/client.js
client/src/App.jsx
client/src/main.jsx
client/src/index.css
```

---

## Learning Roadmap

| Priority | Topic              | Why You Need It                 |
| -------- | ------------------ | ------------------------------- |
| 🟢       | React              | Build application UI            |
| 🟢       | JSX                | Create React components         |
| 🟢       | React Hooks        | Manage state and lifecycle      |
| 🟢       | React Router       | Page navigation                 |
| 🟢       | Tailwind CSS       | Application styling             |
| 🟢       | Axios              | Communicate with backend APIs   |
| 🟢       | Context API        | Authentication and global state |
| 🟡       | Forms & Validation | User input handling             |
| 🟡       | Responsive Design  | Mobile-friendly UI              |
| ⚪        | React Performance  | Optimize rendering              |

### Official Documentation

* React — https://react.dev/
* React Learn — https://react.dev/learn
* React Router — https://reactrouter.com/
* Vite — https://vite.dev/guide/
* Tailwind CSS — https://tailwindcss.com/docs
* Axios — https://axios-http.com/docs/intro
* HTML — https://developer.mozilla.org/docs/Web/HTML
* CSS — https://developer.mozilla.org/docs/Web/CSS

---

# ⚙️ Backend Developer

## Responsibilities

* Build REST APIs
* Design database models
* Implement business logic
* Create chat APIs
* Handle image uploads

---

## Project Files

```text
server/src/models/
server/src/controllers/
server/src/routes/
server/src/utils/
server/src/server.js
```

---

## Learning Roadmap

| Priority | Topic               | Why You Need It           |
| -------- | ------------------- | ------------------------- |
| 🟢       | Node.js             | Backend runtime           |
| 🟢       | Express.js          | API development           |
| 🟢       | MongoDB             | Database                  |
| 🟢       | Mongoose            | MongoDB ODM               |
| 🟢       | REST API Design     | API development           |
| 🟢       | Express Routing     | API endpoints             |
| 🟢       | Request Validation  | Secure APIs               |
| 🟡       | Socket.IO           | Real-time chat            |
| 🟡       | Cloudinary          | Image uploads             |
| 🟡       | Error Handling      | Better API responses      |
| ⚪        | MongoDB Aggregation | Advanced database queries |

### Official Documentation

* Node.js — https://nodejs.org/docs/latest/api/
* Express.js — https://expressjs.com/
* MongoDB — https://www.mongodb.com/docs/
* Mongoose — https://mongoosejs.com/docs/
* Socket.IO — https://socket.io/docs/v4/
* Cloudinary — https://cloudinary.com/documentation

---

# 🧪 QA & Documentation

## Responsibilities

* Test application features
* Verify APIs
* Write documentation
* Prepare seed data
* Report bugs

---

## Project Files

```text
server/tests/
server/src/scripts/
docs/
README.md
```

---

## Learning Roadmap

| Priority | Topic               | Why You Need It             |
| -------- | ------------------- | --------------------------- |
| 🟢       | GitHub              | Review Pull Requests        |
| 🟢       | Postman             | Test APIs                   |
| 🟢       | Markdown            | Write documentation         |
| 🟢       | REST APIs           | Verify endpoints            |
| 🟢       | MongoDB             | Verify database records     |
| 🟡       | Jest                | Unit testing                |
| 🟡       | Supertest           | API testing                 |
| ⚪        | Performance Testing | Improve application quality |

### Official Documentation

* Postman — https://learning.postman.com/
* Markdown Guide — https://www.markdownguide.org/
* Jest — https://jestjs.io/docs/getting-started
* Supertest — https://github.com/ladjs/supertest
* MongoDB — https://www.mongodb.com/docs/

---

# Common Technologies (Everyone Should Know)

| Technology            | Why It Matters       |
| --------------------- | -------------------- |
| Git                   | Version control      |
| GitHub                | Team collaboration   |
| VS Code               | Code editor          |
| npm                   | Package management   |
| Environment Variables | Secure configuration |
| JSON                  | API communication    |

### Official Documentation

* VS Code — https://code.visualstudio.com/docs
* npm — https://docs.npmjs.com/
* JSON — https://developer.mozilla.org/docs/Learn/JavaScript/Objects/JSON

---

# Suggested Learning Order

## Week 1

* Git & GitHub
* JavaScript (ES6+)
* React (Frontend)
* Node.js & Express (Backend)
* MongoDB
* REST APIs

---

## Week 2

* JWT Authentication
* Axios
* React Context
* Mongoose
* CRUD Operations

---

## Week 3

* Socket.IO
* Cloudinary
* Nodemailer
* Testing (Jest & Supertest)

---

## Week 4

* Deployment
* GitHub Actions
* Docker (Optional)
* Performance Optimization

---

# Tips for the Team

* Learn only the topics related to your assigned role first.
* Read the official documentation before watching tutorials.
* Build features while learning instead of waiting until you've finished every tutorial.
* Commit small, meaningful changes frequently.
* Ask questions early if you're blocked.
* Keep documentation updated as the project evolves.

---

# Final Recommendation

This project is designed to help you learn modern full-stack development. Focus on understanding **why** a technology is used, not just **how** to use it. By the end of the project, every team member should be comfortable collaborating with Git, building features in their area, and contributing to a production-style workflow.
