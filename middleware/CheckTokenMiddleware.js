import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // split the token from bearer
  const token = req.cookies.token.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
