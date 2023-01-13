import { NextFunction, Response } from "express";
import { getPaginationProperty } from "../../lib/pagination";
import User from "../../models/user.model";
import { IRequest } from "../../types/express";
import { userPublicValue } from "./userConfig";

export const getUserProfile = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.userId;

    const user = await User.findOne({ _id: userId }, userPublicValue);

    res.status(201).json(user);
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found",
      error: err,
    });
  }
};
export const getAllUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;
    if (page && limit) {
      let {
        result,
        limit: lm,
        startIndex,
      } = await getPaginationProperty(Number(page), Number(limit), User, {});
      let users = await User.find({}, userPublicValue)
        .limit(lm)
        .skip(startIndex)
        .exec();
      result.data = users;
      res.status(201).json(result);
    } else {
      const users = await User.find({}, userPublicValue);
      res.status(201).json(users);
    }
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found",
      error: err,
    });
  }
};
