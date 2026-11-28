const express = require("express");
const { protect } = require("../middleware/auth");
const { getOrders, createOrder, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
