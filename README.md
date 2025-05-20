# 🏋️‍♂️ Workout Progress Tracker

A minimal, professional full-stack web application for logging, viewing, and managing workout progress.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Testing Strategy](#testing-strategy)
- [Setup & Usage](#setup--usage)
- [Key Design Decisions](#key-design-decisions)
- [Further Improvements](#further-improvements)

---

## 🚀 Project Overview

This project is part of my Virtuagym technical interview.  
It is designed to demonstrate best practices in modern web application development, including a layered backend architecture, dependency injection, containerization, end-to-end testing, and professional documentation.

The app allows users to:

- Create, view, update, and delete workouts (with multiple exercises per workout)
- See their workout history
- Experience a modern, clean, and responsive user interface

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, SQLite, routing-controllers, Docker
- **Frontend:** Vue 3 (Composition API), Vite, plain CSS
- **Testing:** Supertest + Jest (API, Integration and e2e)
- **Containerization:** Docker, Docker Compose

---

## 🧩 Architecture

- **Backend:**
  - Organized with controllers (class-based, decorator-driven), services (business logic), and dependency injection for modularity and testability.
  - Uses `routing-controllers` for a declarative, annotation-based approach.
  - Centralized application configuration (middleware, security, CORS, etc.) in `setupApp`.
  - All setup and infrastructure is containerized and production-ready.
- **Frontend:**
  - Modular, component-based Vue 3 architecture.
  - Clean UI logic with separation of concerns.
- **Testing:**
  - Dedicated test folders integration, and e2e tests.
  - Clear test scripts and coverage for critical flows.

---

## 🗄 Database Structure

**ORM:** Prisma  
**Database:** SQLite (easy to migrate to Postgres/MySQL)

### **Tables:**

- **Workout**
  - `id`: integer (PK)
  - `date`: datetime
- **Exercise**
  - `id`: integer (PK)
  - `workoutId`: integer (FK)
  - `name`: string
  - `reps`: integer
  - `sets`: integer
  - `weight`: integer

**See `prisma/schema.prisma` for full details.**

---

## 📚 API Endpoints

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | /api/workouts     | Get all workouts           |
| GET    | /api/workouts/:id | Get a workout by ID        |
| POST   | /api/workouts     | Create a new workout       |
| PUT    | /api/workouts/:id | Update an existing workout |
| DELETE | /api/workouts/:id | Delete a workout           |

Each workout includes an array of exercises.

---

## 🧪 Testing Strategy

Virtuagym requested demonstration of **unit, integration, and e2e tests**:

> Note: The current tests cover all primary API endpoints and user flows, ensuring core functionality and preventing regressions. Additional unit and edge case tests can be added as the codebase grows.

- **Integration tests**: Test API endpoints with real DB interaction (Jest + Supertest).
- **End-to-end tests (e2e)**: Simulate full user flows (Jest + Supertest).

### **How to Run Tests:**

**Backend (integration + e2e):**

```sh
cd backend
npm test
```

---

## 🐳 Containerization

The project supports full Docker and Docker Compose setup for easy local development and deployment:

- backend/Dockerfile (multi-stage/builder pattern)

- frontend/Dockerfile (multi-stage/builder pattern)

- docker-compose.yml to run both containers together

Start the project locally:

```sh
docker-compose up --build
```

---

## ⚡ Setup & Usage

### Local Development (without Docker):

After cloning the repo, create a `.env` file in the `backend` directory to set up environment variables, especially for the database connection string.

Example connection string for SQLite:

```sh
DATABASE_URL="file:./dev.db"
```

Backend:

```sh
cd backend
npm install --legacy-peer-deps
npx prisma migrate dev
npm run dev
```

> Note: `--legacy-peer-deps` is required for OpenAPI and class validators compatibility.

Backend API runs at: http://localhost:4000

Frontend:

```sh
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

With Docker:

```sh
docker-compose up --build
```

## 🗝️ Key Design Decisions

- Used class-based controllers and DI for testability and extensibility.
- SQLite is easy for local/dev work, and Prisma makes it trivial to migrate to Postgres or MySQL in production. Also the data model fits well with a SQL database, so there is no need for a NoSQL database (such as MongoDB).
- Used Prisma for safe, type-checked ORM/database access.
- Vue 3 for its simplicity and the gentle learning curve.
- Used Vite for fast development and build times.
- Followed best practices for security (helmet), logging (morgan).
- Kept UI and UX intentionally simple and clear for easy code review
- All code is commented and well-structured for interview demonstration

## 🔒 Security & Best Practices

This project demonstrates several security best practices suitable for MVPs and code review.  
**User authentication and authorization** are **not implemented yet** for simplicity, and are listed in Further Improvements.

- **CORS Restriction:** Backend API only accepts requests from trusted frontend domains in production.
- **Helmet:** Secure HTTP headers to minimize common vulnerabilities.
- **Secrets Handling:** Secrets are managed via environment variables, never hardcoded or stored in Docker images.
- **Database Safety:** Prisma ORM prevents SQL injection and other query attacks.
- **Error Handling:** No sensitive server errors are leaked to the client.

## 🚀 Further Improvements

- User authentication & registration
- Autherization, Role-based access control (admin/user)
- Update method can be improved to PATCH for partial updates
- Frontend state management (Vuex or Pinia)
- 'Delete' option for the edit form in the frontend
  -- Add more query params for the GET endpoint (e.g., filter by date)
- Database migration to Postgres or MySQL for production
- Advanced analytics and charts
- Persistent database volume for production
- CI/CD pipeline for automatic testing & deployment
- Rate Limiting: Protects the API from abuse and denial-of-service.
