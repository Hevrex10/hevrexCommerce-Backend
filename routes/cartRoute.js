import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.delete("/:productId",protect, removeFromCart);

export default router;
