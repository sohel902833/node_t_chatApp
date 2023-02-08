"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var modelConfig_1 = require("./modelConfig");
var MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Types.ObjectId,
        ref: modelConfig_1.CONVERSATION_MODEL_NAME,
        required: true,
    },
    text: {
        type: String,
        required: false,
        default: "",
    },
    authors: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: modelConfig_1.USER_MODEL_NAME,
        },
    ],
    unreadFor: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: modelConfig_1.USER_MODEL_NAME,
        },
    ],
    sender: {
        type: mongoose_1.Types.ObjectId,
        ref: modelConfig_1.CONVERSATION_MODEL_NAME,
        required: true,
    },
    unsent: {
        type: Boolean,
        required: true,
        default: false,
    },
    images: [
        {
            url: String,
            fileName: String,
        },
    ],
    timestamp: {
        type: Date,
        default: new Date(),
        required: true,
    },
    replideMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: modelConfig_1.MESSAGE_MODEL_NAME,
    },
}, {
    timestamps: true,
});
var Message = (0, mongoose_1.model)(modelConfig_1.MESSAGE_MODEL_NAME, MessageSchema);
exports.default = Message;
