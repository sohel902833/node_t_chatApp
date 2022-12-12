import { Router } from "express";
import * as authController from "../controller/auth/auth.controller";
import { authGard } from "../middlewares/authGard";
import {
  validateLoginInfo,
  validateRegisterInfo,
} from "./../validator/auth.validator";

export const router = Router();

router.post("/signup", validateRegisterInfo, authController.signupUser);
router.post("/login", validateLoginInfo, authController.loginUser);
router.post("/verify-request", authGard(), authController.sentVerifyRequest);
router.post("/verify/:token", authController.verifyEmail);
router.put("/reset-password", authGard(), authController.resetPassword);
router.put("/forget-password", authController.forgetPassword);
router.put("/set-new-password", authController.resetPasswordByVerifyCode);
