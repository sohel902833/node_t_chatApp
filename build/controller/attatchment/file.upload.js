"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorage = void 0;
var fs_1 = require("fs");
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var attatchmentConfig_1 = require("./attatchmentConfig");
var makeFileName = function (file) {
    var fileExt = path_1.default.extname(file.originalname);
    var fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
        "-" +
        Date.now();
    return fileName + fileExt;
};
var createStorage = function (folderName) {
    var directory = path_1.default.join(attatchmentConfig_1.rootPath, folderName);
    var folderExists = (0, fs_1.existsSync)(directory);
    if (!folderExists) {
        (0, fs_1.mkdirSync)(directory);
    }
    return multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, directory);
        },
        filename: function (req, file, cb) {
            var fileName = makeFileName(file);
            cb(null, fileName);
        },
    });
};
exports.createStorage = createStorage;
// const compressImage = (dir_name, goNext) => {
//     const filePath = path.join(rootPath, dir_name);
//     return async (req, res, next) => {
//       if (req?.files?.length > 0) {
//         let done = 0;
//         await req.files?.map(async (file, index) => {
//           await sharp(file.path)
//             .webp({ quality: 20 })
//             .toFile(filePath + "/" + file?.filename + ".webp", (err, info) => {
//               if (err) {
//                 res.json({
//                   error: err,
//                 });
//               } else {
//                 const dFilePath = path.join(filePath, file.filename);
//                 try {
//                   fs.unlinkSync(dFilePath);
//                 } catch (err) {}
//                 done += 1;
//                 if (done === req.files.length) {
//                   next();
//                 }
//               }
//             });
//         });
//       } else {
//         if (goNext) {
//           next();
//         } else {
//           res.status(200).json({
//             message: "No Image Selected",
//           });
//         }
//       }
//     };
//   };
