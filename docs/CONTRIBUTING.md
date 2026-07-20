# Git Workflow

## First Time Setup

```bash
git clone https://github.com/yourusername/collegebuddy.git

cd collegebuddy

cd client
npm install

cd ../server
npm install
```

---

## Create Development Branch

```bash
git checkout -b dev

git push -u origin dev
```

---

# Daily Workflow

## Get Latest Code

```bash
git checkout dev

git pull origin dev
```

---

## Create Feature Branch

```bash
git checkout -b feature/login-page
```

---

## Commit Changes

```bash
git add .

git commit -m "feat(auth): add login page"
```

---

## Push Changes

```bash
git push -u origin feature/login-page
```

---

## Create Pull Request

Open GitHub:

Repository

→ Pull Requests

→ New Pull Request

→ Compare

```
feature/login-page
```

into

```
dev
```

---

# Merge Flow

```
feature/*
      │
      ▼
     dev
      │
      ▼
    main
```

Never push directly to **main**.