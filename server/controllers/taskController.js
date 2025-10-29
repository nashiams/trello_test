const { Task } = require("../models");

const ALLOWED_STATUSES = ["To Do", "In Progress", "Done"];

class TaskController {
  // Create a new task. Status defaults to 'To Do'.
  static async createTask(req, res, next) {
    try {
      const { title, description } = req.body;

      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
      }

      const task = await Task.create({
        title: title.trim(),
        description: description || null,
      });

      return res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  // Get all tasks and group them by status for easy frontend rendering.
  static async getAllTasks(req, res, next) {
    try {
      const tasks = await Task.findAll({ order: [["createdAt", "ASC"]] });

      const grouped = {
        "To Do": [],
        "In Progress": [],
        Done: [],
      };

      tasks.forEach((t) => {
        const status = t.status || "To Do";
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(t);
      });

      return res.status(200).json(grouped);
    } catch (err) {
      next(err);
    }
  }

  // Update a task by id (title, description, status allowed)
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const updates = {};
      if (title !== undefined) updates.title = title.trim();
      if (description !== undefined) updates.description = description;
      if (status !== undefined) {
        if (!ALLOWED_STATUSES.includes(status)) {
          return res.status(400).json({
            error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
          });
        }
        updates.status = status;
      }

      await task.update(updates);

      return res.status(200).json(task);
    } catch (err) {
      // If Sequelize can't find/cast the ID, treat as not found
      if (err.name === "SequelizeDatabaseError") {
        return res.status(404).json({ error: "Task not found" });
      }
      next(err);
    }
  }

  // Delete a task by id
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      await task.destroy();
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      // If Sequelize can't find/cast the ID, treat as not found
      if (err.name === "SequelizeDatabaseError") {
        return res.status(404).json({ error: "Task not found" });
      }
      next(err);
    }
  }
}

module.exports = TaskController;
