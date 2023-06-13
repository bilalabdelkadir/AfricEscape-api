import express from "express";
import authMiddleware from "../middleware/chekUser.js";
import checkRole from "../middleware/checkrole.js";
import createDestination from "../controller/destination/createDestinationController.js";
import updateDestination from "../controller/destination/updateDestinationController.js";
import getAllDestination from "../controller/destination/getAlldestinationController.js";
import getDestination from "../controller/destination/getDestination.js";
import deleteDestination from "../controller/destination/deleteDestination.js";

const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create-destination",
  authMiddleware,
  checkRole(["admin"]),
  upload.array("images", 10),
  createDestination
);
router.patch(
  "/update-destination/:id",
  authMiddleware,
  checkRole(["admin"]),
  upload.array("images", 10),
  updateDestination
);
router.get("/get-all-destination", getAllDestination);
router.get("/get-destination/:id", getDestination);
router.delete(
  "/delete-destination/:id",
  authMiddleware,
  checkRole(["admin"]),
  deleteDestination
);

export default router;
