import { Router } from "express";
import { decodeTokenController, forgotPassword, googleLogin, login, signup } from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { search } from "../controllers/SearchController.js";

const authRoute = Router()

authRoute.get('/',authMiddleware, login)
authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/google', googleLogin)
authRoute.post('/forgot-password', forgotPassword)
authRoute.get('/search',authMiddleware, search)    
// For cookies
authRoute.post('/decode', decodeTokenController);


export default authRoute