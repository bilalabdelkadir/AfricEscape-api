import { Destination } from "../../model/Destination/Destination.js";
import User from "../../model/User/User.js";

const createReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user = req.user._id;
  const userInfo = await User.findById(user);

  // check if user has already reviewed this destination
  if (!rating) {
    return res.status(400).json({ message: "Rating is required" });
  }

  try {
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    if (
      destination.reviews.find(
        (review) => review.user.toString() === user.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this destination" });
    }

    const newReview = {
      user,
      rating,
      comment,
    };

    destination.reviews.push(newReview);
    await destination.save();
    userInfo.reviews.push(newReview);
    await userInfo.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { id: destinationId, reviewId } = req.params;
  const user = req.user._id;
  const userInfo = await User.findById(user);

  try {
    const destination = await Destination.findById(destinationId).populate(
      "reviews.user"
    );

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const reviewIndex = destination.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    destination.reviews.splice(reviewIndex, 1);
    await destination.save();
    userInfo.reviews = userInfo.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );
    await userInfo.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  const { id: destinationId, reviewId } = req.params;
  const { rating, comment } = req.body;
  const user = req.user._id;

  try {
    const updatedReview = await Destination.findOneAndUpdate(
      { _id: destinationId, "reviews._id": reviewId, "reviews.user": user },
      { $set: { "reviews.$.rating": rating, "reviews.$.comment": comment } },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res
      .status(200)
      .json(
        updatedReview.reviews.find(
          (review) => review._id.toString() === reviewId
        )
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReview = async (req, res) => {
  const { id, reviewId } = req.params;
  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    const review = destination.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createReview, deleteReview, updateReview, getReview, getAllReviews };
