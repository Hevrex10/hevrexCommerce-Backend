import express from "express";
import {
  getProductReviews,
  createReview,
} from "../controllers/reviewController.js";
import {protect} from '../controllers/authController.js'


const router = express.Router({ mergeParams: true });

router.route("/").get(getProductReviews).post(protect,createReview);

export default router;
