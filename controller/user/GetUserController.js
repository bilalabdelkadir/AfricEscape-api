import User from "../../model/User/UserSchema.js";

const getUser = async (req, res) => {
  const id = req.user._id;

  try {
    const user = await User.findById(id).populate("bookings");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default getUser;
