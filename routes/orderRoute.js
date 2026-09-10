import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllOrder,
  createOrder,
  getUserOrder,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("admin"), getAllOrder)
  .post(protect, createOrder);

router.get("/my-orders", protect, getUserOrder);
router.patch("/:id/cancel", protect, cancelOrder);
router.get("/:id", protect, getOrder);
router.get("/:id", protect, restrictTo("admin"), updateOrderStatus);

export default router;
