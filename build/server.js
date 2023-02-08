"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app_1 = require("./app");
var handleSocketEvent_1 = __importDefault(require("./lib/handleSocketEvent"));
var io = null;
exports.io = io;
var bootstrap = function () {
    var server = (0, http_1.createServer)(app_1.app);
    //config socket
    exports.io = io = new socket_io_1.Server(server);
    io.on("connection", function (socket) {
        console.log("New User Connected");
        var socketEvent = new handleSocketEvent_1.default(socket);
        socketEvent.handleSocketEvent();
    });
    server.listen(process.env.PORT, function () {
        console.log("Server Is Running On Port " + process.env.PORT);
    });
};
bootstrap();
