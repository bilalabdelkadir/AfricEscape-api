import {
  createReview,
  deleteReview,
  updateReview,
  getReview,
  getAllReviews,
} from "../controller/review/ReviewController.js";
import authMiddleware from "../middleware/CheckTokenMiddleware.js";
import express from "express";
const router = express.Router();

router.post("/:id/create-review", authMiddleware, createReview);
router.delete("/:id/delete-review/:reviewId", authMiddleware, deleteReview);
router.patch("/:id/update-review/:reviewId", authMiddleware, updateReview);
router.get("/:id/reviews/:reviewId", getReview);
router.get("/:id/reviews", getAllReviews);

export default router;
