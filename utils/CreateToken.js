import jwt from "jsonwebtoken";

const createToken = (_id, email, firstName, lastName, role) => {
  return jwt.sign(
    { _id, email, firstName, lastName, role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

export default createToken;
