import User from "../../model/User/UserSchema.js";

const deleteUser = async (req, res) => {
  const id = req.User._id;

  try {
    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
      throw Error("There is no user with this id");
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default deleteUser;
