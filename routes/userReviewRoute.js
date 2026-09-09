import express from "express";
import { getUserReview } from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getUserReview);
export default router;
