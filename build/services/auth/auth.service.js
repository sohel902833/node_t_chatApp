"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerifyMailToken = exports.getSignedToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var getSignedToken = function (userId) {
    var token = (0, jsonwebtoken_1.sign)({ userId: userId }, process.env.USER_JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
};
exports.getSignedToken = getSignedToken;
var getVerifyMailToken = function (userId) {
    var token = (0, jsonwebtoken_1.sign)({ userId: userId }, process.env.VERIFY_EMAIL_SECRET, {
        expiresIn: process.env.VERIFY_EMAIL_EXPIRY_TIME,
    });
    return token;
};
exports.getVerifyMailToken = getVerifyMailToken;
