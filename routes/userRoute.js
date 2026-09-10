import express from "express";
import {
  getAllUser,
  updateMe,
  deleteMe,
  getUser,
  getMe,
} from "../controllers/userController.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} from "../controllers/authController.js";
import userReviewRouter from "./userReviewRoute.js";

const router = express.Router();

///Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

//Logged in
router.get("/me", protect, getMe, getUser);
router.patch("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);
router.patch("/updatePassword", protect, updatePassword);

//Admin
router.get("/getUsers", protect, restrictTo("admin"), getAllUser);

router.get("/:id", protect, getUser);

router.use("/:userId/reviews/", userReviewRouter);

export default router;
