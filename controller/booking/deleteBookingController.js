import Booking from "../../model/book/bookSchema.js";
import { Destination } from "../../model/Destination/Destination.js";
import User from "../../model/User/User.js";

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  // check if the req user is the owner of the booking
  const userInfo = await User.findById(user);

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    if (booking.user.toString() !== user.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await booking.deleteOne();
    // remove the booking id from the user booking array
    userInfo.bookings = userInfo.bookings.filter(
      (bookingId) => bookingId.toString() !== id.toString()
    );
    await userInfo.save();

    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default deleteBooking;
