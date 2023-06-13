import express from "express";
import registerUser from "../controller/auth/RegisterController.js";
import loginUser from "../controller/auth/LoginController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
