import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { rootPath } from "./attatchmentConfig";
const makeFileName = (file: any) => {
  const fileExt = path.extname(file.originalname);
  const fileName =
    file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") +
    "-" +
    Date.now();
  return fileName + fileExt;
};

export const createStorage = (folderName: string) => {
  const directory = path.join(rootPath, folderName);
  const folderExists = existsSync(directory);
  if (!folderExists) {
    mkdirSync(directory);
  }
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      const fileName = makeFileName(file);
      cb(null, fileName);
    },
  });
};

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
