import jwt from "jsonwebtoken";

const createToken = (res, _id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "2d" });

  res.cookie("token", token, {
    httpOnly: true,
  });

  return token;
};

export default createToken;
