import mongoose from "mongoose";
import reviewSchema from "../review/ReviewSchema.js";
import User from "../User/UserSchema.js";
import Joi from "joi";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    images: [
      {
        name: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    startsAt: {
      type: Date,
    },
    country: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    city: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// create a virtual property to get the average rating of a destination
destinationSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((acc, review) => {
    return acc + review.rating;
  }, 0);
  return totalRating / this.reviews.length;
});

// joi validation
const validateDestination = (destination) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(255).required(),
    price: Joi.number().min(0).max(1000000).required(),
    startsAt: Joi.date(),
    country: Joi.string().min(3).max(50).required(),
    city: Joi.string().min(3).max(50).required(),
    difficulty: Joi.string().valid("easy", "medium", "difficult").required(),
  });
  return schema.validate(destination);
};

const Destination = mongoose.model("Destination", destinationSchema);

export { Destination, validateDestination };
