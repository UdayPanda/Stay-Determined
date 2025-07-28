import { Router } from "express";
import { decodeTokenController, forgotPassword, googleLogin, login, signup } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRoute = Router()

authRoute.post('/',authMiddleware, login)
authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/google', googleLogin)
authRoute.post('/forgot-password', forgotPassword)
// For cookies
authRoute.post('/decode', decodeTokenController);


export default authRoute