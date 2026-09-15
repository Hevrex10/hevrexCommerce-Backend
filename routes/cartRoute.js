import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.delete("/:cartItemId", protect, removeFromCart);
router.patch("/:productId", protect, updateCartQuantity);

export default router;
