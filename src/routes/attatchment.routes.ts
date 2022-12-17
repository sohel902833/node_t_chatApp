import { Router } from "express";
import * as attatchmentController from "../controller/attatchment/attatchmentController";
import { authGard } from "../middlewares/authGard";

export const router = Router();
router.post(
  "/:folderName",
  authGard(),
  attatchmentController.uploadFiles(20, "files"),
  attatchmentController.returnFiles
);

router.delete("/", authGard(), attatchmentController.deleteFile);
