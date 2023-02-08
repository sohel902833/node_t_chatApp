import { NextFunction, Response } from "express";
import { getPaginationProperty } from "../../lib/pagination";
import { SocketEvent } from "../../lib/socketEvents";
import User from "../../models/user.model";
import { io } from "../../server";
import { updateUser } from "../../services/user/user.service";
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

export const setUserOnlineStatus = async (req: IRequest, res: Response) => {
  try {
    const userId = req.userId;
    const status = req.params.status;
    console.log(userId, status);
    const onlineStatus = status === "true";
    const updateUser = await User.updateOne(
      {
        _id: userId,
      },
      {
        online: onlineStatus,
        lastActive: new Date(),
      }
    );
    io.sockets.emit(SocketEvent.UPDATE_ACTIVE_STATUS, {
      receivers: "all",
      userId: userId,
      online: onlineStatus,
      lastActive: new Date(),
    });
    res.status(201).json({
      message: "User Is " + status,
      success: true,
    });
  } catch (er) {
    res.status(200).json({
      message: "Server Error Found.",
      success: false,
    });
  }
};

export const subscribePushNotification = async (
  req: IRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const subscription = req.body;
    const updatedUser = await updateUser(userId as string, {
      subscription: JSON.stringify(subscription),
    });
    res.status(201).json({
      message: "Subscription Saved.",
      success: true,
    });
  } catch (er) {
    res.status(200).json({
      message: "Server Error Found.",
      success: false,
    });
  }
};
