import express from "express";
import { protect } from "../controllers/authController.js";
import { getAllOrder, createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.route("/").get(protect, getAllOrder).post(protect, createOrder);

export default router;
