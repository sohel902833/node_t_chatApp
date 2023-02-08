"use strict";
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
exports.deleteFile = exports.returnFiles = exports.uploadFiles = void 0;
var fs_1 = require("fs");
var multer_1 = __importDefault(require("multer"));
var attatchmentConfig_1 = require("./attatchmentConfig");
var file_upload_1 = require("./file.upload");
var uploadFiles = function (max_length, field_name) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var folderName, attatchmentUpload;
        return __generator(this, function (_a) {
            folderName = req.params.folderName;
            attatchmentUpload = (0, multer_1.default)({
                storage: (0, file_upload_1.createStorage)(folderName ? folderName : ""),
            });
            attatchmentUpload.array(field_name, max_length)(req, res, function (err) {
                if (err) {
                    if ((err === null || err === void 0 ? void 0 : err.code) === "LIMIT_UNEXPECTED_FILE") {
                        res.status(200).json({
                            message: "Maximum " + max_length + " Image You Can Upload.",
                        });
                    }
                }
                else {
                    //reduce image size
                    next();
                }
            });
            return [2 /*return*/];
        });
    }); };
};
exports.uploadFiles = uploadFiles;
var returnFiles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, files, newFiles;
    return __generator(this, function (_a) {
        url = "".concat(req.protocol, "://").concat(req.get("host"), "/uploads/").concat(req.params.folderName, "/");
        files = req.files;
        if ((files === null || files === void 0 ? void 0 : files.length) > 0) {
            newFiles = files === null || files === void 0 ? void 0 : files.map(function (file) {
                return {
                    fileName: "/".concat(req.params.folderName, "/").concat(file.filename),
                    uri: url + file.filename,
                };
            });
            res.status(201).json({
                message: "File Uploaded",
                files: newFiles,
            });
        }
        else {
            res.status(200).json({
                message: "No File Found For Upload",
            });
        }
        return [2 /*return*/];
    });
}); };
exports.returnFiles = returnFiles;
var deleteFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileNames;
    return __generator(this, function (_a) {
        try {
            fileNames = req.body.fileNames;
            if (fileNames.length > 0) {
                deleteFiles(fileNames, function (err) {
                    if (err) {
                        res.status(200).json({
                            message: "File Delete Failed",
                            error: err,
                        });
                    }
                    else {
                        res.status(201).json({
                            message: "File Deleted.",
                        });
                    }
                });
            }
            else {
                res.status(200).json({
                    message: "Nothing Found For Delete",
                });
            }
        }
        catch (err) {
            res.status(404).json({
                message: "Server Error Found.",
            });
        }
        return [2 /*return*/];
    });
}); };
exports.deleteFile = deleteFile;
var deleteFiles = function (files, callback) {
    var i = files.length;
    files.forEach(function (filepath) {
        var dir = "".concat(attatchmentConfig_1.rootPath, "/").concat(filepath);
        (0, fs_1.unlink)(dir, function (err) {
            i--;
            if (err) {
                callback(err);
                return;
            }
            else if (i <= 0) {
                callback(null);
            }
        });
    });
};
