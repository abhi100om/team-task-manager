const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

module.exports = router;