const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  addMember,
  removeMember,
} = require("../controllers/projectController");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.post("/:id/members", authMiddleware, addMember);

router.delete(
  "/:id/members/:userId",
  authMiddleware,
  removeMember
);

module.exports = router;