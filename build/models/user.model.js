"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHONE_REGISTEREDE_TYPE = exports.EMAIL_REGISTERED_TYPE = void 0;
var mongoose_1 = require("mongoose");
var modelConfig_1 = require("./modelConfig");
exports.EMAIL_REGISTERED_TYPE = "email";
exports.PHONE_REGISTEREDE_TYPE = "phone";
var userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    birthdate: Date,
    phone: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        fileName: {
            type: String,
            default: "none",
        },
        url: {
            type: String,
            default: "none",
        },
    },
    cover: {
        fileName: {
            type: String,
            default: "none",
        },
        url: {
            type: String,
            default: "none",
        },
    },
    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    online: {
        type: Boolean,
        default: false,
    },
    lastActive: {
        type: String,
        default: new Date(),
    },
    tokens: [
        {
            device: {
                type: String,
            },
            token: {
                type: String,
            },
        },
    ],
    registeredBy: {
        type: String,
        required: true,
        default: exports.EMAIL_REGISTERED_TYPE,
        enum: [exports.EMAIL_REGISTERED_TYPE, exports.PHONE_REGISTEREDE_TYPE],
    },
    subscription: {
        type: String,
        required: false,
        default: "",
    },
}, {
    timestamps: true,
});
var User = (0, mongoose_1.model)(modelConfig_1.USER_MODEL_NAME, userSchema);
exports.default = User;
