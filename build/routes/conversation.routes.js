"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var conversationController = __importStar(require("../controller/conversation/conversation.controller"));
var authGard_1 = require("../middlewares/authGard");
exports.router = (0, express_1.Router)();
exports.router.post("/", (0, authGard_1.authGard)(), conversationController.createConversation);
exports.router.get("/", (0, authGard_1.authGard)(), conversationController.getMyConversations);
exports.router.get("/:conversationId", (0, authGard_1.authGard)(), conversationController.getSingleConversation);
exports.router.get("/message/:conversationId", (0, authGard_1.authGard)(), conversationController.getConversationMessage);
exports.router.post("/send-message/:conversationId", (0, authGard_1.authGard)(), conversationController.sendMessage);
exports.router.put("/:conversationId", (0, authGard_1.authGard)(), conversationController.deleteConversation);
exports.router.delete("/message/:messageId", (0, authGard_1.authGard)(), conversationController.unsentMessage);
exports.router.delete("/message/me/:messageId", (0, authGard_1.authGard)(), conversationController.removeForMe);
