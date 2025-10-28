const express = require("express");
const TaskController = require("../controllers/taskController");
const router = express.Router();

router.post("/api/tasks", TaskController.createTask);
router.get("/api/tasks", TaskController.getAllTasks);
router.put("/api/tasks/:id", TaskController.updateTask);
router.delete("/api/tasks/:id", TaskController.deleteTask);

module.exports = router;
