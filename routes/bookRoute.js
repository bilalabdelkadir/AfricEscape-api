import express from "express";
import createBooking from "../controller/booking/createBookingController.js";
import updateBooking from "../controller/booking/updateBookingController.js";
import authMiddleware from "../middleware/chekUser.js";
import deleteBooking from "../controller/booking/deleteBookingController.js";

const router = express.Router();

router.post("/:destinationId/create-booking", authMiddleware, createBooking);
router.patch("/:id/update-booking", authMiddleware, updateBooking);
router.delete("/:id/delete-booking", authMiddleware, deleteBooking);

export default router;
