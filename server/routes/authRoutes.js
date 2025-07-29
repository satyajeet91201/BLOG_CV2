import express from "express";
import { logout, register , login, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword} from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";

const authRouter = express.Router();

// authRouter.route('/register').post(register);
authRouter.post('/register', register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/emailOtp').post(userAuth,sendVerifyOtp);
authRouter.route('/verifyEmail').post(userAuth,verifyEmail);
authRouter.route('/is-auth').get(userAuth , isAuthenticated)
authRouter.route('/send-reset-8otp').post(userAuth ,sendResetOtp);
authRouter.route('/reset-password').post(resetPassword);


export default authRouter;