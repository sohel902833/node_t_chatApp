"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.sendNotification = exports.removeForMe = exports.unsentMessage = exports.deleteConversation = exports.getConversationMessage = exports.sendMessage = exports.getSingleConversation = exports.getMyConversations = exports.createConversation = void 0;
var mongoose_1 = require("mongoose");
var handlePushNotification_1 = require("../../lib/handlePushNotification");
var socketEvents_1 = require("../../lib/socketEvents");
var modelConfig_1 = require("../../models/modelConfig");
var server_1 = require("../../server");
var conversation_service_1 = require("../../services/conversation/conversation.service");
var user_service_1 = require("../../services/user/user.service");
var conversation_model_1 = __importDefault(require("./../../models/conversation.model"));
var message_model_1 = __importDefault(require("./../../models/message.model"));
var messageConfig_1 = require("./messageConfig");
var createConversation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, participents, groupName, userId_1, groupChat, filteredParticipent, prevParticipent, finalParticipent, conversation, createdConversation, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, participents = _a.participents, groupName = _a.groupName;
                userId_1 = req.userId;
                if (!participents) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Participent not found.",
                            success: false,
                        })];
                }
                groupChat = false;
                filteredParticipent = participents.filter(function (pt) { return pt !== userId_1; });
                //check participent exists or not after filter
                if (filteredParticipent.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Participent Not Found.May You Select You In Participent",
                            success: false,
                        })];
                }
                //participent exists ,, check is it group chat or single
                if (filteredParticipent.length > 1) {
                    //its a group chat
                    if (!groupName) {
                        return [2 /*return*/, res.status(200).json({
                                message: "Enter Group Name",
                                success: false,
                            })];
                    }
                    groupChat = true;
                }
                if (!!groupChat) return [3 /*break*/, 2];
                return [4 /*yield*/, conversation_model_1.default.findOne({
                        $and: [
                            { "participents.participent": userId_1 },
                            { "participents.participent": filteredParticipent[0] },
                        ],
                    })];
            case 1:
                prevParticipent = _b.sent();
                if (prevParticipent) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Conversation Already Exists",
                            conversation: prevParticipent,
                            success: true,
                        })];
                }
                _b.label = 2;
            case 2:
                //push current user to the participent
                filteredParticipent.push(userId_1);
                finalParticipent = filteredParticipent.map(function (pt) {
                    var prt = {
                        nickName: "",
                        participent: pt,
                    };
                    return prt;
                });
                conversation = {
                    participents: finalParticipent,
                    groupChat: groupChat,
                    groupName: groupChat ? groupName : "",
                };
                return [4 /*yield*/, (0, conversation_service_1.insertConversation)(conversation)];
            case 3:
                createdConversation = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Conversation Created.",
                        success: true,
                    })];
            case 4:
                err_1 = _b.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_1,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createConversation = createConversation;
var getMyConversations = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, conversations, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                return [4 /*yield*/, (0, conversation_service_1.getMyConversationsWithUnreadCount)(userId)];
            case 1:
                conversations = _a.sent();
                if (conversations.length > 0) {
                    return [2 /*return*/, res.status(201).json({
                            conversations: conversations,
                        })];
                }
                res.status(200).json({
                    message: "Conversation Not Found.",
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_2,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyConversations = getMyConversations;
var getSingleConversation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, conversationId, conversations, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                conversationId = req.params.conversationId;
                return [4 /*yield*/, (0, conversation_service_1.fetchSingleConversation)(conversationId)];
            case 1:
                conversations = _a.sent();
                //check conversation found or not
                if ((conversations === null || conversations === void 0 ? void 0 : conversations.length) === 0) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Conversation Not Found.",
                            success: false,
                            notFound: true,
                        })];
                }
                //conversation is there
                res.status(200).json({
                    message: "Conversation Found.",
                    success: true,
                    conversation: conversations[0],
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Conversation Not Found.",
                        success: false,
                        notFound: true,
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleConversation = getSingleConversation;
var sendMessage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, conversationId, _a, text, replideMessage, images, conversation, authors, msg, savedMessage, updateConversation, newMessage, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                userId_2 = req.userId;
                conversationId = req.params.conversationId;
                _a = req.body, text = _a.text, replideMessage = _a.replideMessage, images = _a.images;
                if (!text && !images) {
                    return [2 /*return*/, res.status(200).json({
                            message: "No Message Found",
                        })];
                }
                return [4 /*yield*/, (0, conversation_service_1.getConversation)(conversationId)];
            case 1:
                conversation = _c.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(200).json({
                            message: "No Conversation Found.",
                        })];
                }
                authors = conversation.participents.map(function (pt) {
                    return pt.participent.toString();
                });
                msg = {
                    authors: authors,
                    unreadFor: authors.filter(function (at) { return at !== userId_2; }),
                    conversationId: conversation._id,
                    sender: userId_2,
                    text: text,
                    replideMessage: replideMessage && new mongoose_1.Types.ObjectId(replideMessage),
                    images: (images === null || images === void 0 ? void 0 : images.length) > 0
                        ? images.map(function (img) { return (__assign(__assign({}, img), { url: img === null || img === void 0 ? void 0 : img.uri })); })
                        : [],
                };
                return [4 /*yield*/, (0, conversation_service_1.insertMessage)(msg)];
            case 2:
                savedMessage = _c.sent();
                return [4 /*yield*/, (0, conversation_service_1.setLastMessageInConversation)(conversationId, savedMessage._id.toString())];
            case 3:
                updateConversation = _c.sent();
                return [4 /*yield*/, message_model_1.default.findOne({
                        _id: (_b = savedMessage === null || savedMessage === void 0 ? void 0 : savedMessage._id) === null || _b === void 0 ? void 0 : _b.toString(),
                    })
                        .populate({
                        path: "sender",
                        model: modelConfig_1.USER_MODEL_NAME,
                        select: {
                            firstName: 1,
                            lastName: 1,
                        },
                    })
                        .populate({
                        path: "replideMessage",
                        model: modelConfig_1.MESSAGE_MODEL_NAME,
                        select: messageConfig_1.messagePublicValue,
                    })];
            case 4:
                newMessage = _c.sent();
                //broadcust message
                server_1.io.sockets.emit(socketEvents_1.SocketEvent.MESSAGE_SENT, {
                    receivers: authors,
                    meta: newMessage,
                });
                //done
                //sent notification
                (0, exports.sendNotification)(authors === null || authors === void 0 ? void 0 : authors.filter(function (id) { return id !== userId_2; }), text, images, 
                //@ts-ignore
                newMessage === null || newMessage === void 0 ? void 0 : newMessage.sender);
                res.status(201).json({
                    message: "Message Sent.",
                    data: newMessage,
                });
                return [3 /*break*/, 6];
            case 5:
                err_4 = _c.sent();
                console.log("Error", err_4);
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_4,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
var getConversationMessage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, conversationId, updateMessage, messages, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.userId;
                conversationId = req.params.conversationId;
                return [4 /*yield*/, message_model_1.default.updateMany({ conversationId: conversationId }, {
                        $pull: { unreadFor: userId },
                    })];
            case 1:
                updateMessage = _a.sent();
                return [4 /*yield*/, message_model_1.default.find({
                        $and: [
                            {
                                conversationId: conversationId,
                            },
                            {
                                authors: { $in: [userId] },
                            },
                        ],
                    })
                        .populate({
                        path: "sender",
                        model: modelConfig_1.USER_MODEL_NAME,
                        select: {
                            firstName: 1,
                            lastName: 1,
                        },
                    })
                        .populate({
                        path: "replideMessage",
                        model: modelConfig_1.MESSAGE_MODEL_NAME,
                        select: messageConfig_1.messagePublicValue,
                    })
                        .sort({ createdAt: 1 })];
            case 2:
                messages = _a.sent();
                if (messages.length > 0) {
                    return [2 /*return*/, res.status(201).json({
                            messages: messages,
                        })];
                }
                res.status(200).json({
                    message: "Message Not Found.",
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_5,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getConversationMessage = getConversationMessage;
var deleteConversation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, conversationId, updateMessage, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                conversationId = req.params.conversationId;
                return [4 /*yield*/, message_model_1.default.updateMany({ conversationId: conversationId }, {
                        $pull: { authors: userId },
                    })];
            case 1:
                updateMessage = _a.sent();
                server_1.io.sockets.emit(socketEvents_1.SocketEvent.DELETE_CONVERSATION, {
                    receivers: userId,
                    meta: {
                        conversationId: conversationId,
                    },
                });
                return [2 /*return*/, res.status(201).json({
                        message: "Conversation Deleted.",
                        success: true,
                    })];
            case 2:
                err_6 = _a.sent();
                res.status(200).json({
                    message: "Server Error Found.",
                    error: err_6,
                    success: false,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteConversation = deleteConversation;
var unsentMessage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, messageId, message, updateMessage, err_7;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                userId = req.userId;
                messageId = req.params.messageId;
                return [4 /*yield*/, (0, conversation_service_1.getMessage)(messageId)];
            case 1:
                message = _c.sent();
                if (!message || ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Message Not Found.",
                        })];
                }
                //message exists and authorized user
                if (((_b = message === null || message === void 0 ? void 0 : message.sender) === null || _b === void 0 ? void 0 : _b.toString()) !== userId) {
                    return [2 /*return*/, res.status(200).json({
                            message: "You Are Not Authorized To Perform This Action",
                            success: false,
                        })];
                }
                return [4 /*yield*/, message_model_1.default.updateOne({ _id: messageId }, {
                        text: "",
                        images: [],
                        unsent: true,
                    })];
            case 2:
                updateMessage = _c.sent();
                server_1.io.sockets.emit(socketEvents_1.SocketEvent.UNSEND_MESSAGE, {
                    receivers: message === null || message === void 0 ? void 0 : message.authors,
                    meta: {
                        conversationId: message === null || message === void 0 ? void 0 : message.conversationId,
                        messageId: message === null || message === void 0 ? void 0 : message._id,
                    },
                });
                return [2 /*return*/, res.status(201).json({
                        message: "Message Removed.",
                        success: true,
                    })];
            case 3:
                err_7 = _c.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_7,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.unsentMessage = unsentMessage;
var removeForMe = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, messageId, message, updateMessage, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.userId;
                messageId = req.params.messageId;
                return [4 /*yield*/, (0, conversation_service_1.getMessage)(messageId)];
            case 1:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res.status(200).json({
                            message: "Message Not Found.",
                        })];
                }
                return [4 /*yield*/, message_model_1.default.updateOne({ _id: messageId }, {
                        $pull: { authors: userId },
                    })];
            case 2:
                updateMessage = _a.sent();
                server_1.io.sockets.emit(socketEvents_1.SocketEvent.REMOVE_MESSAGE_FOR_ME, {
                    receivers: userId,
                    meta: {
                        messageId: messageId,
                        conversationId: message === null || message === void 0 ? void 0 : message.conversationId,
                    },
                });
                return [2 /*return*/, res.status(201).json({
                        message: "Message Removed For You.",
                    })];
            case 3:
                err_8 = _a.sent();
                res.status(404).json({
                    message: "Server Error Found.",
                    error: err_8,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeForMe = removeForMe;
var sendNotification = function (users, message, images, sender) { return __awaiter(void 0, void 0, void 0, function () {
    var title, body, allReceivers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = "New Message From ".concat(sender === null || sender === void 0 ? void 0 : sender.firstName, " ").concat(sender === null || sender === void 0 ? void 0 : sender.lastName);
                body = "New Message";
                if (message) {
                    body = message;
                }
                else if ((images === null || images === void 0 ? void 0 : images.length) > 0) {
                    body = "".concat(sender === null || sender === void 0 ? void 0 : sender.firstName, " ").concat(sender === null || sender === void 0 ? void 0 : sender.lastName, " Sent ").concat(images === null || images === void 0 ? void 0 : images.length, " Images");
                }
                return [4 /*yield*/, (0, user_service_1.getAllUserSubscription)(users)];
            case 1:
                allReceivers = _a.sent();
                if ((allReceivers === null || allReceivers === void 0 ? void 0 : allReceivers.length) > 0) {
                    console.log(allReceivers, sender === null || sender === void 0 ? void 0 : sender._id);
                    allReceivers === null || allReceivers === void 0 ? void 0 : allReceivers.forEach(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        var subscription;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    subscription = JSON.parse(user === null || user === void 0 ? void 0 : user.subscription);
                                    if (!(subscription === null || subscription === void 0 ? void 0 : subscription.endpoint)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, handlePushNotification_1.sendPushNotification)(subscription, JSON.stringify({
                                            message: message,
                                            title: title,
                                            body: body,
                                        }))];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.sendNotification = sendNotification;
