import express from "express";
import {
  getAllUser,
  updateMe,
  deleteMe,
  getUser,
} from "../controllers/userController.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} from "../controllers/authController.js";
import userReviewRouter from "./userReviewRoute.js";

const router = express.Router();

router.get("/getUsers", protect, getAllUser);
router.get("/:id", getUser);
router.patch("/:id", updateMe);
router.delete("/:id", deleteMe);

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updatePassword", protect, updatePassword);

router.use("/:userId/reviews/", userReviewRouter);

export default router;
