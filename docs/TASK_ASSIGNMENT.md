# 📋 Task Assignment

> This document defines the responsibilities of each team member, the files they own, and the expected deliverables. Every contributor should primarily work within their assigned files and coordinate with the Project Lead before making changes outside their ownership.

---

# Team Responsibilities

| Role                  | Primary Responsibility                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| 🎯 Project Lead       | Project architecture, authentication, deployment, project management, code reviews |
| 💻 Frontend Developer | User interface, reusable components, pages, state management, API integration      |
| ⚙️ Backend Developer  | REST APIs, controllers, database models, business logic, Socket.io                 |
| 🧪 QA & Documentation | Testing, documentation, API verification, seed data                                |

---

# 🎯 Project Lead

## Primary Responsibilities

* Design the overall project architecture.
* Maintain coding standards.
* Configure backend services.
* Implement authentication.
* Manage deployments.
* Review and merge Pull Requests.
* Resolve merge conflicts.
* Help teammates when blocked.

---

## File Ownership

### Configuration

```text
server/src/config/

database.js
cloudinary.js
email.js
socket.js
```

### Services

```text
server/src/services/

authService.js
emailService.js
tokenService.js
```

### Middleware

```text
server/src/middleware/

auth.js
errorHandler.js
validation.js
```

### Other Files

```text
.github/workflows/ci.yml

docker-compose.yml

server/.env.example

README.md
```

---

## Deliverables

* MongoDB connection
* JWT Authentication
* Refresh Token System
* Email Verification
* Cloudinary Configuration
* Socket.io Setup
* CI/CD Pipeline
* Deployment Configuration
* Project Documentation Review

---

## Works Closely With

* Backend Developer
* QA Team

---

# 💻 Frontend Developer

## Primary Responsibilities

Develop the complete user interface using React, Tailwind CSS, and reusable components.

---

## File Ownership

### API

```text
client/src/api/

client.js
```

---

### Components

```text
client/src/components/common/

Navbar.jsx

Footer.jsx

Button.jsx

Input.jsx
```

```text
client/src/components/items/

ItemCard.jsx

ItemFilters.jsx
```

```text
client/src/components/layout/

RootLayout.jsx
```

---

### Context

```text
client/src/context/

AuthContext.jsx
```

---

### Hooks

```text
client/src/hooks/

useAuth.js
```

---

### Pages

```text
client/src/pages/

Home.jsx

Login.jsx

Register.jsx

Dashboard.jsx

Catalogue.jsx

Profile.jsx

Inbox.jsx

Events.jsx

Projects.jsx

AddItem.jsx
```

---

### Styling

```text
client/src/

App.jsx

main.jsx

index.css
```

---

## Deliverables

* Responsive UI
* Authentication Screens
* Dashboard
* Catalogue
* Item Details
* Add Item Page
* Profile Page
* Events
* Projects
* Chat Interface
* API Integration
* Responsive Design

---

## Dependencies

Requires completed APIs from the Backend Developer.

---

# ⚙️ Backend Developer

## Primary Responsibilities

Develop the REST API, database models, and business logic.

---

## File Ownership

### Models

```text
server/src/models/

User.js

Item.js

BorrowRequest.js

Conversation.js

Message.js

Event.js

Project.js
```

---

### Controllers

```text
server/src/controllers/

authController.js

userController.js

itemController.js

borrowController.js

messageController.js

eventController.js

projectController.js
```

---

### Routes

```text
server/src/routes/

authRoutes.js

userRoutes.js

itemRoutes.js

borrowRoutes.js

messageRoutes.js

eventRoutes.js

projectRoutes.js
```

---

### Utilities

```text
server/src/utils/

constants.js
```

---

## Deliverables

* Authentication APIs
* User APIs
* Item CRUD
* Borrow APIs
* Events CRUD
* Projects CRUD
* Chat APIs
* Database Models
* Validation
* Error Handling

---

## Dependencies

* MongoDB
* Authentication Middleware
* Cloudinary Configuration

---

# 🧪 QA & Documentation

## Primary Responsibilities

Maintain documentation, perform testing, verify APIs, and prepare seed data.

---

## File Ownership

### Tests

```text
server/tests/
```

Recommended Structure

```text
tests/

unit/

integration/

fixtures/

helpers/

README.md
```

---

### Seed Scripts

```text
server/src/scripts/

seed.js
```

---

### Documentation

```text
docs/

API.md

CONTRIBUTING.md

DEPLOYMENT.md

TEAM_GUIDE.md

TASK_ASSIGNMENT.md

DEVELOPMENT_PLAN.md

STUDY_RESOURCES.md
```

---

## Deliverables

* API Testing
* Unit Tests
* Integration Tests
* Test Data
* Documentation
* Bug Reports
* Postman Collection

---

# Shared Responsibilities

The following files may be modified by multiple team members when necessary.

```text
README.md

package.json

.env.example
```

Any changes should be discussed with the Project Lead before merging.

---

# Priority Order

## Phase 1

* Authentication
* Database
* Basic UI
* API Structure

---

## Phase 2

* Item Module
* Borrow Module
* User Profiles

---

## Phase 3

* Chat
* Events
* Projects

---

## Phase 4

* Testing
* Deployment
* Documentation

---

# Definition of Done

A task is complete only when all of the following are true:

* [ ] Code is implemented.
* [ ] Feature works as expected.
* [ ] No linting or build errors.
* [ ] Tested locally.
* [ ] Documentation updated (if required).
* [ ] Pull Request approved.
* [ ] Successfully merged into the `dev` branch.

---

# Collaboration Guidelines

* Work only within your assigned files whenever possible.
* Create a feature branch for every new task.
* Communicate before modifying another member's files.
* Keep commits small and meaningful.
* Review Pull Requests respectfully and provide constructive feedback.
* Ask for help early if blocked.

---

Following these responsibilities helps avoid merge conflicts, keeps the project organized, and ensures that every team member understands their role throughout the development process.
