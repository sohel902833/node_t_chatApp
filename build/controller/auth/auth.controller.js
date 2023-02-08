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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markup = exports.resetPasswordByVerifyCode = exports.forgetPassword = exports.resetPassword = exports.verifyEmail = exports.sentVerifyRequest = exports.loginUser = exports.signupUser = void 0;
var bcrypt_1 = require("bcrypt");
var ip_1 = require("ip");
var jsonwebtoken_1 = require("jsonwebtoken");
var encryption_1 = require("../../lib/encryption");
var mailer_1 = require("../../lib/mailer");
var mailTemplate_1 = require("../../lib/mailTemplate");
var randomGenerator_1 = require("../../lib/randomGenerator");
var user_model_1 = __importStar(require("../../models/user.model"));
var verifycode_model_1 = __importDefault(require("../../models/verifycode.model"));
var auth_service_1 = require("../../services/auth/auth.service");
var signupUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, email, password, birthdate, phone, prevUser, registeredBy, hashedPassword, deviceId, user, newUser, createdUser, token, tokenId, updatedUser, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password, birthdate = _a.birthdate, phone = _a.phone;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                prevUser = _c.sent();
                if (prevUser) {
                    return [2 /*return*/, res.status(200).json({
                            message: "User Already Exists.",
                            errors: {
                                email: "Email Already Exists",
                            },
                        })];
                }
                registeredBy = email ? user_model_1.EMAIL_REGISTERED_TYPE : user_model_1.PHONE_REGISTEREDE_TYPE;
                return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
            case 2:
                hashedPassword = _c.sent();
                deviceId = (0, encryption_1.encryptText)((0, ip_1.address)()).toString();
                user = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                    birthdate: birthdate,
                    phone: phone,
                    avatar: {
                        url: "",
                        fileName: "",
                    },
                    cover: {
                        url: "",
                        fileName: "",
                    },
                    verified: false,
                    registeredBy: registeredBy,
                    tokens: [
                        {
                            device: deviceId,
                            token: "",
                        },
                    ],
                };
                newUser = new user_model_1.default(user);
                return [4 /*yield*/, newUser.save()];
            case 3:
                createdUser = _c.sent();
                token = (0, auth_service_1.getSignedToken)(createdUser._id.toString());
                tokenId = "";
                if ((createdUser === null || createdUser === void 0 ? void 0 : createdUser.tokens) && (createdUser === null || createdUser === void 0 ? void 0 : createdUser.tokens[0]._id)) {
                    tokenId = (_b = createdUser === null || createdUser === void 0 ? void 0 : createdUser.tokens[0]) === null || _b === void 0 ? void 0 : _b._id.toString();
                }
                return [4 /*yield*/, user_model_1.default.updateOne({ _id: createdUser === null || createdUser === void 0 ? void 0 : createdUser._id, "tokens._id": tokenId }, {
                        $set: {
                            "tokens.$.token": token,
                        },
                    })];
            case 4:
                updatedUser = _c.sent();
                //delete secure properties from user object to serve
                delete user.password;
                delete user.tokens;
                user._id = createdUser._id;
                res.status(201).json({
                    message: "User Register Successful.",
                    user: user,
                    token: token,
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _c.sent();
                return [2 /*return*/, res.status(404).json({
                        message: "Server Error Found.",
                        error: err_1,
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signupUser = signupUser;
var loginUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, dbUser, isValidPassword, reqDeviceId_1, isSameDevice_1, foundPosition_1, tokenId, token, updatedUser, user, token, newDevice, updatedUser, err_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                dbUser = _d.sent();
                //check user exists or not
                if (!dbUser) {
                    return [2 /*return*/, res.status(200).json({
                            message: "User Not Found.",
                        })];
                }
                return [4 /*yield*/, (0, bcrypt_1.compare)(password, dbUser === null || dbUser === void 0 ? void 0 : dbUser.password)];
            case 2:
                isValidPassword = _d.sent();
                //check password valid or not
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Password Doesn't Matched.",
                        })];
                }
                reqDeviceId_1 = (0, encryption_1.encryptText)((0, ip_1.address)()).toString();
                isSameDevice_1 = false;
                foundPosition_1 = 0;
                (_b = dbUser === null || dbUser === void 0 ? void 0 : dbUser.tokens) === null || _b === void 0 ? void 0 : _b.forEach(function (token, index) {
                    if (token.device === reqDeviceId_1) {
                        isSameDevice_1 = true;
                        foundPosition_1 = index;
                    }
                });
                tokenId = "";
                if (dbUser === null || dbUser === void 0 ? void 0 : dbUser.tokens) {
                    tokenId = (_c = dbUser === null || dbUser === void 0 ? void 0 : dbUser.tokens[foundPosition_1]._id) === null || _c === void 0 ? void 0 : _c.toString();
                }
                if (!isSameDevice_1) return [3 /*break*/, 4];
                token = (0, auth_service_1.getSignedToken)(dbUser._id.toString());
                return [4 /*yield*/, user_model_1.default.updateOne({ _id: dbUser === null || dbUser === void 0 ? void 0 : dbUser._id, "tokens._id": tokenId }, {
                        $set: {
                            "tokens.$.token": token,
                        },
                    })];
            case 3:
                updatedUser = _d.sent();
                user = {
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                    email: dbUser.email,
                    avatar: dbUser.avatar,
                    cover: dbUser.cover,
                    birthdate: dbUser.birthdate,
                    verified: dbUser.verified,
                    phone: dbUser.phone,
                    _id: dbUser._id,
                };
                //populate user
                return [2 /*return*/, res.status(201).json({
                        message: "Login Successful.",
                        user: user,
                        token: token,
                    })];
            case 4:
                token = (0, auth_service_1.getSignedToken)(dbUser._id.toString());
                newDevice = {
                    token: token,
                    device: reqDeviceId_1,
                };
                return [4 /*yield*/, user_model_1.default.updateOne({ _id: dbUser === null || dbUser === void 0 ? void 0 : dbUser._id, "tokens._id": tokenId }, {
                        $set: {
                            "tokens.$.token": token,
                            "tokens.$.device": reqDeviceId_1,
                        },
                    })];
            case 5:
                updatedUser = _d.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Login Successful.",
                        user: dbUser,
                        token: token,
                    })];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _d.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_2,
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
var sentVerifyRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, token, user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                token = (0, auth_service_1.getVerifyMailToken)(userId);
                return [4 /*yield*/, user_model_1.default.findOne({ _id: userId })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(402).json({
                            message: "User Not Found.",
                        })];
                }
                (0, mailer_1.sendMail)({
                    to: user.email,
                    html: (0, mailTemplate_1.getVerifyMailTemplate)("".concat(process.env.FRONTEND_EMAIL_VERIFY_URL, "/").concat(token), "Developed By:Md Sohrab Hossain"),
                    subject: "<b>Verify Your Account.</b>",
                });
                res.status(201).json({
                    message: "Check Your Email To Verify Your Account",
                    verifyToken: token,
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_3,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sentVerifyRequest = sentVerifyRequest;
var verifyEmail = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, userId, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.params.token;
                decoded = (0, jsonwebtoken_1.verify)(token, process.env.VERIFY_EMAIL_SECRET);
                userId = decoded.userId;
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: userId }, { verified: true })];
            case 1:
                user = _a.sent();
                res.status(201).json({
                    message: "Email Verified Successful.",
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(404).json({
                    message: "Session timeout.",
                    error: err_4,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifyEmail = verifyEmail;
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, prevPassword, newPassword, userId, user, isValidPassword, hashedPassword, updatedUser, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, prevPassword = _a.prevPassword, newPassword = _a.newPassword;
                if (!prevPassword || !newPassword) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Put All Info",
                        })];
                }
                userId = req.userId;
                return [4 /*yield*/, user_model_1.default.findOne({ _id: userId })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            message: "User Not Found.",
                        })];
                }
                return [4 /*yield*/, (0, bcrypt_1.compare)(prevPassword, user === null || user === void 0 ? void 0 : user.password)];
            case 2:
                isValidPassword = _b.sent();
                //check password valid or not
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Password Doesn't Matched.",
                        })];
                }
                return [4 /*yield*/, (0, bcrypt_1.hash)(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: userId }, { password: hashedPassword })];
            case 4:
                updatedUser = _b.sent();
                res.status(201).json({
                    message: "Password Updated Successful.",
                });
                return [3 /*break*/, 6];
            case 5:
                err_5 = _b.sent();
                res.status(404).json({
                    message: "Session timeout.",
                    error: err_5,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, verifyCode, newCode, prevVerifyCode, updatedCode, newVerifyCode, savedCode, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Email Not Found.",
                        })];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(200).json({
                            message: "User Doesn't Exists.",
                            success: false,
                        })];
                }
                verifyCode = (0, randomGenerator_1.getRandomNumber)();
                newCode = {
                    user: user._id,
                    code: verifyCode,
                    expiry: new Date().getTime(),
                };
                return [4 /*yield*/, verifycode_model_1.default.findOne({ user: user._id })];
            case 2:
                prevVerifyCode = _a.sent();
                //sent verify code to the mail
                (0, mailer_1.sendMail)({
                    to: user.email,
                    html: (0, mailTemplate_1.getPasswordResetCodeTemplate)(verifyCode, "Develop By: Md Sohrab Hossain"),
                    subject: "Reset Password",
                });
                if (!prevVerifyCode) return [3 /*break*/, 4];
                return [4 /*yield*/, verifycode_model_1.default.findOneAndUpdate({ _id: prevVerifyCode._id }, newCode)];
            case 3:
                updatedCode = _a.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Verify Code Sent To Your Email.",
                        success: true,
                    })];
            case 4:
                newVerifyCode = new verifycode_model_1.default(newCode);
                return [4 /*yield*/, newVerifyCode.save()];
            case 5:
                savedCode = _a.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Verify Code Sent To Your Email.",
                        success: true,
                    })];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_6 = _a.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_6,
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
var resetPasswordByVerifyCode = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, code, newPassword, user, verifyCode, hashedPassword, updatedUser, deletCode, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, email = _a.email, code = _a.code, newPassword = _a.newPassword;
                if (!email || !code || !newPassword) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Put All Info",
                            success: false,
                        })];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(200).json({
                            message: "User Not Found.",
                            success: false,
                        })];
                }
                return [4 /*yield*/, verifycode_model_1.default.findOne({ user: user._id })];
            case 2:
                verifyCode = _b.sent();
                if (!verifyCode || verifyCode.code !== Number(code)) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Verify Code Doesn't Matched.",
                            success: false,
                        })];
                }
                return [4 /*yield*/, (0, bcrypt_1.hash)(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: verifyCode.user }, { password: hashedPassword })];
            case 4:
                updatedUser = _b.sent();
                return [4 /*yield*/, verifycode_model_1.default.deleteMany({ user: user._id })];
            case 5:
                deletCode = _b.sent();
                res.status(201).json({
                    message: "Password Updated Successful.",
                    success: true,
                });
                return [3 /*break*/, 7];
            case 6:
                err_7 = _b.sent();
                res.status(404).json({
                    message: "Session timeout.",
                    success: false,
                    error: err_7,
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.resetPasswordByVerifyCode = resetPasswordByVerifyCode;
var markup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (err) {
            res.status(404).json({
                message: "Session timeout.",
                error: err,
            });
        }
        return [2 /*return*/];
    });
}); };
exports.markup = markup;
