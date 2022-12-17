import { NextFunction, Request, Response } from "express";
import { unlink } from "fs";
import multer from "multer";
import { IRequest } from "../../types/express";
import { rootPath } from "./attatchmentConfig";
import { createStorage } from "./file.upload";

export const uploadFiles = (max_length: number, field_name: string) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    const { folderName } = req.params;
    const attatchmentUpload = multer({
      storage: createStorage(folderName ? folderName : ""),
    });

    attatchmentUpload.array(field_name, max_length)(req, res, (err: any) => {
      if (err) {
        if (err?.code === "LIMIT_UNEXPECTED_FILE") {
          res.status(200).json({
            message: "Maximum " + max_length + " Image You Can Upload.",
          });
        }
      } else {
        //reduce image size
        next();
      }
    });
  };
};
export const returnFiles = async (req: Request, res: Response) => {
  const url = `${req.protocol}://${req.get("host")}/uploads/${
    req.params.folderName
  }/`;
  const files = req.files as any;
  if (files?.length > 0) {
    const newFiles = files?.map((file: any) => {
      return {
        fileName: `/${req.params.folderName}/${file.filename}`,
        uri: url + file.filename,
      };
    });
    res.status(201).json({
      message: "File Uploaded",
      files: newFiles,
    });
  } else {
    res.status(200).json({
      message: "No File Found For Upload",
    });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileNames: string[] = req.body.fileNames;
    if (fileNames.length > 0) {
      deleteFiles(fileNames, (err: any | null) => {
        if (err) {
          res.status(200).json({
            message: "File Delete Failed",
            error: err,
          });
        } else {
          res.status(201).json({
            message: "File Deleted.",
          });
        }
      });
    } else {
      res.status(200).json({
        message: "Nothing Found For Delete",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
    });
  }
};

const deleteFiles = (files: string[], callback: any) => {
  var i = files.length;
  files.forEach(function (filepath) {
    const dir = `${rootPath}/${filepath}`;
    unlink(dir, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
};
