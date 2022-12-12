import { NextFunction, Response } from "express";
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
