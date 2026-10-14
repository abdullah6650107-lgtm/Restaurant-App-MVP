const express = require("express");
const { protect, managerOnly } = require("../middleware/auth");
const {
  getMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

router.get("/", getMenu);
router.get("/:id", getMenuById);
router.post("/", protect, managerOnly, createMenuItem);
router.patch("/:id", protect, managerOnly, updateMenuItem);
router.delete("/:id", protect, managerOnly, deleteMenuItem);

module.exports = router;
