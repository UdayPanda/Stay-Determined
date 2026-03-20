import { Router } from "express";
import {
  signup,
  login,
  googleLogin,
  forgotPassword,
  getMe,
  logout,
  refreshToken,
  updateProfile
} from "../controllers/AuthController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { search } from "../controllers/SearchController.js";

const authRoute = Router();

// ================= AUTH =================
authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/google", googleLogin);
authRoute.post("/forgot-password", forgotPassword);

// ================= USER =================
authRoute.get("/me", authMiddleware, getMe);
authRoute.post("/logout", logout);
authRoute.get("/refresh", refreshToken);
authRoute.put("/update", authMiddleware, updateProfile);

// ================= PROTECTED FEATURE =================
authRoute.get("/search", authMiddleware, search);

export default authRoute;