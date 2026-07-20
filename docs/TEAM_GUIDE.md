# 👥 CollegeBuddy Team Guide

> This document explains how our team communicates, collaborates, and contributes to the **CollegeBuddy** project. Every team member should read this before starting development.

---

# Team Members

| Role                      | Responsibility                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------- |
| 🎯 **Project Lead**       | Project architecture, authentication, deployment, code reviews, project management |
| 💻 **Frontend Developer** | React UI, pages, reusable components, state management, API integration            |
| ⚙️ **Backend Developer**  | REST APIs, database models, business logic, real-time communication                |
| 🧪 **QA & Documentation** | Testing, API verification, seed data, documentation, bug reporting                 |

> Replace the role names above with your team members once everyone is assigned.

---

# Communication

| Activity         | Platform                        | Frequency                |
| ---------------- | ------------------------------- | ------------------------ |
| Daily Discussion | Discord / WhatsApp              | Daily                    |
| Code Reviews     | GitHub Pull Requests            | Before every merge       |
| Task Tracking    | GitHub Issues / GitHub Projects | Throughout the project   |
| Documentation    | `docs/` folder                  | Whenever features change |

---

# Development Workflow

The project follows the Git Flow workflow.

```
main
│
├── dev
│
├── feature/auth
├── feature/items
├── feature/chat
├── feature/events
└── hotfix/*
```

## Branch Purpose

| Branch      | Description                |
| ----------- | -------------------------- |
| `main`      | Production-ready code      |
| `dev`       | Main development branch    |
| `feature/*` | Individual features        |
| `hotfix/*`  | Emergency production fixes |

---

# Git Workflow

## 1. Update Development Branch

```bash
git checkout dev

git pull origin dev
```

---

## 2. Create a Feature Branch

```bash
git checkout -b feature/feature-name
```

Example

```bash
git checkout -b feature/authentication
```

---

## 3. Work on Your Feature

Commit changes regularly.

```bash
git add .

git commit -m "feat(auth): add login API"
```

---

## 4. Push Your Branch

```bash
git push -u origin feature/authentication
```

---

## 5. Open Pull Request

Create a Pull Request from

```
feature/*
```

into

```
dev
```

The Project Lead will review and approve the changes.

---

# Commit Message Convention

Use the Conventional Commits format.

```
type(scope): short description
```

Examples

```text
feat(auth): add JWT authentication

fix(items): resolve item image upload

docs(readme): update installation guide

style(navbar): improve spacing

refactor(api): simplify controllers

test(auth): add login tests

chore(deps): update dependencies
```

---

# Pull Request Checklist

Before creating a Pull Request, make sure:

* [ ] Code compiles successfully.
* [ ] No unnecessary `console.log()` statements.
* [ ] Proper error handling is implemented.
* [ ] Documentation is updated (if required).
* [ ] Feature has been tested locally.
* [ ] Commit messages follow the project convention.
* [ ] Code follows the project structure.

---

# Code Review Checklist

The reviewer should verify:

* Code is readable.
* Naming conventions are consistent.
* No duplicated code.
* Security practices are followed.
* API responses are consistent.
* UI is responsive.
* Error messages are meaningful.

---

# Coding Standards

## General

* Use meaningful variable and function names.
* Keep functions small and focused.
* Reuse components whenever possible.
* Avoid duplicate code.
* Write comments only when necessary.

---

## Frontend

* Use functional React components.
* Use hooks instead of class components.
* Keep components reusable.
* Keep pages clean by moving repeated UI into components.
* Store API requests inside `src/api`.

---

## Backend

* Keep controllers lightweight.
* Move business logic into services.
* Validate every request.
* Use middleware for authentication.
* Handle errors centrally.

---

# Project Folder Ownership

| Folder                    | Primary Owner      |
| ------------------------- | ------------------ |
| `client/src/components/`  | Frontend Developer |
| `client/src/pages/`       | Frontend Developer |
| `client/src/context/`     | Frontend Developer |
| `client/src/api/`         | Frontend Developer |
| `server/src/controllers/` | Backend Developer  |
| `server/src/routes/`      | Backend Developer  |
| `server/src/models/`      | Backend Developer  |
| `server/src/services/`    | Project Lead       |
| `server/src/config/`      | Project Lead       |
| `server/tests/`           | QA & Documentation |
| `docs/`                   | QA & Documentation |
| `.github/`                | Project Lead       |

---

# Definition of Done

A task is considered complete only when:

* ✅ Feature is implemented.
* ✅ Code has been tested.
* ✅ Pull Request is approved.
* ✅ Documentation is updated.
* ✅ No merge conflicts exist.
* ✅ The feature works with the latest `dev` branch.

---

# Team Expectations

* Respect deadlines.
* Ask questions when blocked.
* Keep communication active.
* Review teammates' code constructively.
* Write clean and maintainable code.
* Help teammates whenever possible.

---

# Project Goal

The goal of **CollegeBuddy** is not only to build a working application but also to learn professional software development practices such as Git workflows, code reviews, testing, documentation, and team collaboration.

Let's build something we are proud of. 🚀
