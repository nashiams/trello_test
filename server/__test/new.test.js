const request = require("supertest");
const app = require("../app");
const { sequelize, Task } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Task.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /api/tasks", () => {
  it("should create a new task with default status 'To Do'", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Task", description: "Test Description" })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Task");
    expect(response.body.description).toBe("Test Description");
    expect(response.body.status).toBe("To Do");
  });

  it("should return 400 if title is missing", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ description: "No title" })
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Title is required");
  });

  it("should return 400 if title is empty string", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "   ", description: "Empty title" })
      .expect(400);

    expect(response.body.error).toBe("Title is required");
  });

  it("should create task without description", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Task without description" })
      .expect(201);

    expect(response.body.title).toBe("Task without description");
    expect(response.body.description).toBeNull();
  });
});

describe("GET /api/tasks", () => {
  it("should return empty groups when no tasks exist", async () => {
    const response = await request(app).get("/api/tasks").expect(200);

    expect(response.body).toEqual({
      "To Do": [],
      "In Progress": [],
      Done: [],
    });
  });

  it("should return tasks grouped by status", async () => {
    await Task.bulkCreate([
      { title: "Task 1", status: "To Do" },
      { title: "Task 2", status: "To Do" },
      { title: "Task 3", status: "In Progress" },
      { title: "Task 4", status: "Done" },
    ]);

    const response = await request(app).get("/api/tasks").expect(200);

    expect(response.body["To Do"]).toHaveLength(2);
    expect(response.body["In Progress"]).toHaveLength(1);
    expect(response.body["Done"]).toHaveLength(1);
  });
});

describe("PUT /api/tasks/:id", () => {
  it("should update task title", async () => {
    const task = await Task.create({ title: "Original Title" });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: "Updated Title" })
      .expect(200);

    expect(response.body.title).toBe("Updated Title");
  });

  it("should update task status", async () => {
    const task = await Task.create({ title: "Task" });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ status: "In Progress" })
      .expect(200);

    expect(response.body.status).toBe("In Progress");
  });

  it("should return 400 for invalid status", async () => {
    const task = await Task.create({ title: "Task" });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ status: "Invalid Status" })
      .expect(400);

    expect(response.body.error).toContain("Status must be one of");
  });

  it("should return 404 if task not found", async () => {
    const response = await request(app)
      .put("/api/tasks/99999")
      .send({ title: "Updated" })
      .expect(404);

    expect(response.body.error).toBe("Task not found");
  });

  it("should update multiple fields at once", async () => {
    const task = await Task.create({ title: "Task", description: "Old" });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        title: "New Title",
        description: "New Description",
        status: "Done",
      })
      .expect(200);

    expect(response.body.title).toBe("New Title");
    expect(response.body.description).toBe("New Description");
    expect(response.body.status).toBe("Done");
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("should delete a task", async () => {
    const task = await Task.create({ title: "To Delete" });

    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .expect(200);

    expect(response.body.message).toBe("Task deleted successfully");

    const deletedTask = await Task.findByPk(task.id);
    expect(deletedTask).toBeNull();
  });

  it("should return 404 if task not found", async () => {
    const response = await request(app).delete("/api/tasks/99999").expect(404);

    expect(response.body.error).toBe("Task not found");
  });
});
