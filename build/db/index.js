"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
var mongoose_1 = require("mongoose");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var url = process.env.MONGO_CONNECTION_STRING;
var connectDb = function () {
    (0, mongoose_1.set)("strictQuery", true);
    (0, mongoose_1.connect)(url, {})
        .then(function () {
        console.log("Database Connection Successful.");
    }).catch(function (err) {
        console.log(err);
    });
};
exports.connectDb = connectDb;
