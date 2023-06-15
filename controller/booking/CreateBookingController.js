import Booking from "../../model/book/BookSchema.js";
import { Destination } from "../../model/destination/DestinationSchema.js";
import User from "../../model/User/UserSchema.js";

const createBooking = async (req, res) => {
  const { destinationId } = req.params;
  const { date, numberOfPeople, childAge, needTranslator, needHotel, needCar } =
    req.body;
  const user = req.user._id;
  // userInfo
  const userInfo = await User.findById(user);
  // check if the user already booked the destination
  const alreadyBooked = await Booking.findOne({
    user,
    destination: destinationId,
  });
  if (alreadyBooked) {
    return res.status(400).json({ message: "Already booked" });
  }

  if (!date || !numberOfPeople) {
    return res
      .status(400)
      .json({ message: "Date and number of people required" });
  }
  // check if date is in the past
  if (new Date(date) < new Date()) {
    return res.status(400).json({ message: "Date cannot be in the past" });
  }

  try {
    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const booking = new Booking({
      user,
      destination: destinationId,
      date,
      numberOfPeople,
      childAge,
      needTranslator,
      needHotel,
      needCar,
    });

    await booking.save();
    // add the booking id to the user booking array
    userInfo.bookings.push(booking._id);
    await userInfo.save();

    res.status(201).json({
      success: true,
      message: "Destination Created succesfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default createBooking;
