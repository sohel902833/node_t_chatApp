"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var modelConfig_1 = require("./modelConfig");
var verifycodeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: modelConfig_1.USER_MODEL_NAME,
        required: true,
    },
    code: {
        type: Number,
        required: true,
        trim: true,
    },
    expiry: {
        type: Number,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
var VerifyCode = (0, mongoose_1.model)(modelConfig_1.VERIFY_CODE_MODEL, verifycodeSchema);
exports.default = VerifyCode;
