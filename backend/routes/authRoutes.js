const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post(
  "/create-member",
  authMiddleware,
  adminMiddleware,
  authController.createMember
);
 
router.get(
  "/members",
  authMiddleware,
  authController.getMembers
);

module.exports = router;