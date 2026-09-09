import express from "express";
import {
  getAllProduct,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import productReviewRouter from "./productReviewRoute.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProduct)
  .post(protect, restrictTo("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"),deleteProduct);

router.use("/:productId/reviews", productReviewRouter);

export default router;
