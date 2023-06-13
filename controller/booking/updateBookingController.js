import Booking from "../../model/book/bookSchema.js";

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { date, numberOfPeople, childAge, needTranslator, needHotel, needCar } =
    req.body;

  // Check if booking exists
  const booking = Booking.findById(id);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }
  //   check if the date is in the past

  if (new Date(date) < new Date()) {
    return res
      .status(400)
      .json({ success: false, message: "Date cannot be in the past" });
  }
  //   validate the data
  if (!date || !numberOfPeople) {
    return res
      .status(400)
      .json({ success: false, message: "Date and number of people required" });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        date,
        numberOfPeople,
        childAge,
        needTranslator,
        needHotel,
        needCar,
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default updateBooking;
