"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var modelConfig_1 = require("./modelConfig");
var ConversationSchema = new mongoose_1.Schema({
    groupChat: {
        type: Boolean,
        required: true,
        default: false,
    },
    participents: [
        {
            participent: {
                type: mongoose_1.Types.ObjectId,
                ref: modelConfig_1.USER_MODEL_NAME,
            },
            nickName: String,
        },
    ],
    groupName: String,
    lastMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: modelConfig_1.MESSAGE_MODEL_NAME,
    },
    timestamp: {
        type: Number,
        default: new Date().getTime(),
        required: true,
    },
}, {
    timestamps: true,
});
var Conversation = (0, mongoose_1.model)(modelConfig_1.CONVERSATION_MODEL_NAME, ConversationSchema);
exports.default = Conversation;
