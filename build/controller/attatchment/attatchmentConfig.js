"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPath = void 0;
var path_1 = __importDefault(require("path"));
exports.rootPath = path_1.default.join(__dirname, "../../", "uploads");
