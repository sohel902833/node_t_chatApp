import { Router } from "express";
import * as userController from "../controller/user/user.controller";
import { authGard } from "../middlewares/authGard";

export const router = Router();
router.get("/", authGard(), userController.getUserProfile);
