import express from "express";
import { getUser, login, signup, updateUser, logout } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.get("/user", authenticate, getUser);
router.post("/user", authenticate, getUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
