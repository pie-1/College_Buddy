
```markdown
# 🤝 Contributing to CollegeBuddy

Welcome to the team! To keep our codebase clean and avoid merge conflicts, everyone must follow this workflow.

---

## 1. First Time Setup

Clone the repository and install dependencies for both the frontend and backend:

```bash
git clone https://github.com/pie-1/College_Buddy.git
cd College_Buddy

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## 2. Branching Rules

* **`main`** is for production (the live website). **NEVER push directly to `main`.**
* **`dev`** is for integration (combining everyone's work). All Pull Requests must target `dev`.
* **`feature/...`** is your personal workspace.

### Create a new feature branch
Always branch off `dev`, never off `main`.
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

---

## 3. Daily Workflow

### Step 1: Write Code & Commit
```bash
git add .
git commit -m "feat(auth): add login page" # Use clear commit messages
```

### Step 2: Push to GitHub
```bash
git push -u origin feature/your-feature-name
```

---

## 4. Creating a Pull Request (PR)

1. Go to the repository on GitHub.
2. Click the green **Compare & pull request** button.
3. **CRITICAL STEP:** Look at the branch dropdowns at the top.
   * **Base branch** MUST be `dev`.
   * **Compare branch** MUST be your `feature/...` branch.
4. Add a clear title and description.
5. **Link the Issue:** In the description, type `Closes #<issue-number>` (e.g., `Closes #12`). This will automatically move the issue to the "Done" column when merged.
6. Click **Create pull request**.
7. Wait for the CI checks (GitHub Actions) to turn **Green ✅**.

---

## 5. Merging & Code Review

* **Do not merge your own PR immediately.** Ask a teammate to review it.
* Once the CI is green and a teammate approves it, click **Merge pull request**.
* After merging, click **Delete branch** (to keep the repository clean).

### Merge Flow Rules
```
feature/your-branch  ➔  dev  ➔  main
```
*(Only the Project Lead merges `dev` into `main` when it's time for a final release).*

---

## 6. Issue Tracking & Testing

We use GitHub Issues to track work. 
1. **Claim an Issue:** Assign yourself to an issue before you start coding.
2. **Test Your Work:** Before opening a PR, test your code locally (e.g., use Postman or run the frontend). 
3. **Provide Proof:** Paste screenshots of successful tests or API responses in your PR description.
4. **Close Issues:** DO NOT manually close issues unless necessary. Using `Closes #issue-number` in your PR description will close it automatically upon merge.
```
```
