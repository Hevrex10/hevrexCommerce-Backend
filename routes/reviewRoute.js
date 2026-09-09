import express from "express";
import {
  getAllReview,
  getReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
import {protect} from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllReview);

router
  .route("/:id")
  .get(getReview)
  .patch(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
