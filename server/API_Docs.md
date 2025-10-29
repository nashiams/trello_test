# Task Management API Documentation

Base URL: `http://localhost:3000`

---

## 1. Create Task

**Endpoint:** `POST /api/tasks`

**What it does:** Creates a new task with default status "To Do".

### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs for all endpoints"
}
```

**Fields:**

- `title` (string, required): Task title, cannot be empty
- `description` (string, optional): Detailed task description

### Responses

**Success (201 Created):**

```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs for all endpoints",
  "status": "To Do",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Error Responses

**400 Bad Request - Missing Title:**

```json
{
  "error": "Title is required"
}
```

**400 Bad Request - Empty Title:**

```json
{
  "error": "Title is required"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error"
}
```

---

## 2. Get All Tasks

**Endpoint:** `GET /api/tasks`

**What it does:** Retrieves all tasks grouped by their status (To Do, In Progress, Done).

### Request

No request body required.

### Responses

**Success (200 OK):**

```json
{
  "To Do": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "To Do",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Review pull requests",
      "description": null,
      "status": "To Do",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "In Progress": [
    {
      "id": 3,
      "title": "Implement authentication",
      "description": "Add JWT-based auth",
      "status": "In Progress",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "Done": [
    {
      "id": 4,
      "title": "Setup database",
      "description": "Configure PostgreSQL with Docker",
      "status": "Done",
      "createdAt": "2024-01-14T10:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

**Success (200 OK) - Empty:**

```json
{
  "To Do": [],
  "In Progress": [],
  "Done": []
}
```

### Error Responses

**500 Internal Server Error:**

```json
{
  "message": "Internal server error"
}
```

---

## 3. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**What it does:** Updates a task's title, description, and/or status. Can be used to move tasks between columns.

### Request

**Parameters:**

- `id` (integer, required): Task ID in URL path

**Headers:**

```
Content-Type: application/json
```

**Body (all fields optional):**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "In Progress"
}
```

**Fields:**

- `title` (string, optional): New task title
- `description` (string, optional): New task description
- `status` (string, optional): New status. Must be one of: "To Do", "In Progress", "Done"

### Responses

**Success (200 OK):**

```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "status": "In Progress",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T13:45:00.000Z"
}
```

### Error Responses

**400 Bad Request - Invalid Status:**

```json
{
  "error": "Status must be one of: To Do, In Progress, Done"
}
```

**404 Not Found:**

```json
{
  "error": "Task not found"
}
```

**404 Not Found - Invalid ID:**

```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error"
}
```

---

## 4. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**What it does:** Permanently deletes a task from the database.

### Request

**Parameters:**

- `id` (integer, required): Task ID in URL path

### Responses

**Success (200 OK):**

```json
{
  "message": "Task deleted successfully"
}
```

### Error Responses

**404 Not Found:**

```json
{
  "error": "Task not found"
}
```

**404 Not Found - Invalid ID:**

```json
{
  "error": "Task not found"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error"
}
```

---

## Status Values

Valid status values for tasks:

- `"To Do"` - Task is pending
- `"In Progress"` - Task is being worked on
- `"Done"` - Task is completed

---

## Example Usage

### Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task details"}'
```

### Get all tasks

```bash
curl http://localhost:3000/api/tasks
```

### Update task status

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Done"}'
```

### Delete a task

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```
