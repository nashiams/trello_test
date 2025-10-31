# Trello Clone - Kanban Board

A full-stack Kanban board application with drag-and-drop functionality, built with Atomic design structure.

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL

### Quick Start with Docker

1. Clone the repository:

```bash
git clone <repository-url>
cd trello_test
```

2. Create `.env` file in the root directory (see Environment Variables section)

3. Start all services:

```bash
docker compose up --build
```

4. Access the application:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **Database**: localhost:5433

### Local Development Setup

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client/trello_client
npm install
npm run dev
```

**Run Tests:**

```bash
cd server
npm test
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=trello_db
DB_HOST=127.0.0.1
DB_PORT=5433
```

**Note:** When running with Docker, the backend will automatically use `DB_HOST=db` and `DB_PORT=5432` internally.

---

## Tech Stack

### Frontend

- **React** 18 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **Zustand** - State management
- **Lucide React** - Icons

### Backend

- **Node.js** 18 - Runtime
- **Express** 5 - Web framework
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **Jest** - Testing framework
- **Supertest** - API testing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server (production)

---

## API Endpoints (API Documentation is in API_Docs.md inside backend folder)

### Base URL

```
http://localhost:3000
```

### 1. Create Task

**POST** `/api/tasks`

**Request Body:**

```json
{
  "title": "Task title",
  "description": "Task description (optional)"
}
```

**Response (201):**

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "To Do",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get All Tasks

**GET** `/api/tasks`

**Response (200):**

```json
{
  "To Do": [
    {
      "id": 1,
      "title": "Task A",
      "description": "Description A",
      "status": "To Do",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "In Progress": [],
  "Done": []
}
```

---

### 3. Update Task

**PUT** `/api/tasks/:id`

**Request Body (all fields optional):**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress"
}
```

**Valid Status Values:**

- `"To Do"`
- `"In Progress"`
- `"Done"`

**Response (200):**

```json
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T13:45:00.000Z"
}
```

---

### 4. Delete Task

**DELETE** `/api/tasks/:id`

**Response (200):**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Docker Commands

```bash
# Start all services
docker compose up -d

# Rebuild and start
docker compose up --build

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild only frontend
docker compose up -d --no-deps --build frontend

# Rebuild only backend
docker compose up -d --no-deps --build backend
```

---
