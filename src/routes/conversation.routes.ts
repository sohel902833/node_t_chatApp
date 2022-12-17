import { Router } from "express";
import * as conversationController from "../controller/conversation/conversation.controller";
import { authGard } from "../middlewares/authGard";

export const router = Router();
router.post("/", authGard(), conversationController.createConversation);
router.get("/", authGard(), conversationController.getMyConversationsV2);
router.get("/v2", authGard(), conversationController.getMyConversationsV2);
router.get(
  "/message/:conversationId",
  authGard(),
  conversationController.getConversationMessage
);
router.post(
  "/send-message/:conversationId",
  authGard(),
  conversationController.sendMessage
);
router.put(
  "/:conversationId",
  authGard(),
  conversationController.deleteConversation
);
router.delete(
  "/message/:messageId",
  authGard(),
  conversationController.unsentMessage
);
router.delete(
  "/message/me/:messageId",
  authGard(),
  conversationController.removeForMe
);
