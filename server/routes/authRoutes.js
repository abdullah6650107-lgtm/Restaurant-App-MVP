const express = require("express");
const { register, login, profile, logout } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/profile", protect, profile);
router.get("/me", protect, profile);

module.exports = router;
