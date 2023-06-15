import User from "../../model/User/UserSchema.js";
import { validateUser } from "../../model/User/UserSchema.js";
import createToken from "../../utils/CreateToken.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    validateUser({ email, password });
    const user = await User.login(email, password);
    if (!user) {
      throw Error("Couldn't sign in");
    }
    const token = createToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

export default loginUser;
