import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { getAllOrder, createOrder } from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("admin"),getAllOrder)
  .post(protect, createOrder);

export default router;
