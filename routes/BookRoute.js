import express from "express";
import createBooking from "../controller/booking/CreateBookingController.js";
import updateBooking from "../controller/booking/UpdateBookingController.js";
import authMiddleware from "../middleware/CheckTokenMiddleware.js";
import deleteBooking from "../controller/booking/DeleteBookingController.js";

const router = express.Router();

router.post("/:destinationId/create-booking", authMiddleware, createBooking);
router.patch("/:id/update-booking", authMiddleware, updateBooking);
router.delete("/:id/delete-booking", authMiddleware, deleteBooking);

export default router;
