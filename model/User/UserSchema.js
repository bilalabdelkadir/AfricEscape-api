import mongoose from "mongoose";
import Joi from "joi";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 2,
      max: 30,
    },
    lastName: {
      type: String,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [7, "You password should be at least 7 character"],
      select: false,
    },
    profilePicture: {
      name: {
        type: String,
        required: true,
        default: "default.jpg",
      },
      path: {
        type: String,
        required: true,
        default: "public/upload/profile",
      },
    },
    age: {
      type: Number,
      max: 110,
    },
    bio: {
      type: String,
      max: 500,
    },
    country: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    social: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      tiktok: {
        type: String,
      },
    },
    languages: {
      type: [String],
    },
    resetPasswordCode: {
      type: String,
      default: "",
      select: false,
    },
    resetPasswordCodeExpiration: {
      type: Date,
      default: null,
      select: false,
    },

    phoneNumber: {
      type: String,
      max: 15,
      min: 8,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: "",
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "guide", "lead-guide", "hotel-owner"],
      default: "user",
    },
    bookings: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Booking",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.register = async function (
  firstName,
  lastName,
  email,
  password,
  role
) {
  if (!firstName) {
    throw new Error("Please provide first name");
  }
  if (!lastName) {
    throw new Error("Please provide last name");
  }
  if (!email) {
    throw new Error("Please provide email");
  }
  if (!password) {
    throw new Error("Please provide password");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("An account with this email already exists");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please provide a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 7 characters, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email) {
    throw new Error("Please provide email");
  }
  if (!password) {
    throw new Error("Please provide password");
  }

  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw Error(
      "There is no account with this email or phone number. Please register now"
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

const userJoiSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
  phoneNumber: Joi.string().min(8).max(15),
  role: Joi.string()
    .valid("user", "admin", "guide", "lead-guide", "hotel-owner")
    .default("user"),
});

const validateUser = (user) => {
  return userJoiSchema.validate(user);
};

export default mongoose.model("User", userSchema);
export { validateUser };
