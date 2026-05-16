const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", authMiddleware, createTask);

router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectTasks
);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;