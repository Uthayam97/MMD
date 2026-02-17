const express = require("express");
const { checkout, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/order.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/my", authMiddleware, getMyOrders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.patch("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
