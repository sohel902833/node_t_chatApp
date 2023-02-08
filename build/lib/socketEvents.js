"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["MESSAGE_SENT"] = "MESSAGE_SENT";
    SocketEvent["DELETE_CONVERSATION"] = "DELETE_CONVERSATION";
    SocketEvent["REMOVE_MESSAGE_FOR_ME"] = "REMOVE_MESSAGE_FOR_ME";
    SocketEvent["UNSEND_MESSAGE"] = "UNSEND_MESSAGE";
    SocketEvent["UPDATE_ACTIVE_STATUS"] = "UPDATE_ACTIVE_STATUS";
    SocketEvent["USER_DISCONNECTED"] = "USER_DISCONNECTED";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
