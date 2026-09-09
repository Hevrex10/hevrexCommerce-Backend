import express from "express";
import {
  getAllProduct,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import productReviewRouter from "./productReviewRoute.js";
import {protect} from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(getAllProduct).post(protect, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(protect, updateProduct)
  .delete(protect, deleteProduct);

router.use("/:productId/reviews", productReviewRouter);

export default router;
