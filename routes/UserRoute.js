import express from "express";
import getUser from "../controller/user/GetUserController.js";
import updateUser from "../controller/user/UpdateUserController.js";
import deleteUser from "../controller/user/DeleteUserController.js";
import authMiddleware from "../middleware/CheckTokenMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/profile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/me", authMiddleware, getUser);
router.patch(
  "/update-me",
  upload.single("profilePicture"),
  authMiddleware,
  updateUser
);
router.delete("/delete-me", authMiddleware, deleteUser);

export default router;
