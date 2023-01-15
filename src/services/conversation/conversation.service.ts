import mongoose from "mongoose";
import { messagePublicValue } from "../../controller/conversation/messageConfig";
import Conversation, { IConversation } from "../../models/conversation.model";
import Message, { IMessage } from "../../models/message.model";
import { MESSAGE_MODEL_NAME, USER_MODEL_NAME } from "../../models/modelConfig";
import { userPublicValue } from "./../../controller/user/userConfig";

export const insertConversation = async (conv: IConversation) => {
  const newConversation = new Conversation(conv);
  return newConversation.save();
};
export const setLastMessageInConversation = async (
  id: string,
  msgId: string
) => {
  return Conversation.findOneAndUpdate({ _id: id }, { lastMessage: msgId });
};

export const getConversation = async (id: string) => {
  return Conversation.findOne({ _id: id });
};
export const getMessage = async (id: string) => {
  return Message.findOne({ _id: id });
};

export const insertMessage = async (msg: IMessage) => {
  const newMessage = new Message(msg);
  return newMessage.save();
};

export const getMyConversationsWithUnreadCount = async (userId: string) => {
  return await Conversation.aggregate([
    {
      $match: {
        "participents.participent": new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: MESSAGE_MODEL_NAME,
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$conversationId"] },
              unreadFor: {
                $in: [new mongoose.Types.ObjectId(userId)],
              },
            },
          },
          { $count: "unreadCount" },
        ],
        as: "messages",
      },
    },
    {
      $lookup: {
        from: USER_MODEL_NAME,
        let: { participentId: "$participents.participent" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$participentId"] },
            },
          },
          {
            $project: userPublicValue,
          },
        ],
        as: "participents",
      },
    },
    {
      $lookup: {
        from: MESSAGE_MODEL_NAME,
        let: { id: "$lastMessage" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$_id"] },
            },
          },
          {
            $project: messagePublicValue,
          },
        ],
        as: "lastMessage",
      },
    },
    {
      $project: {
        unreadCount: {
          $cond: {
            if: { $gte: [{ $arrayElemAt: ["$messages.unreadCount", 0] }, 1] },
            then: { $arrayElemAt: ["$messages.unreadCount", 0] },
            else: 0,
          },
        },
        groupChat: 1,
        groupName: 1,
        timestamp: 1,
        createdAt: 1,
        updatedAt: 1,
        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        participents: 1,
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);
};

export const fetchSingleConversation = async (conversationId: string) => {
  return await Conversation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(conversationId),
      },
    },
    {
      $lookup: {
        from: USER_MODEL_NAME,
        let: { participentId: "$participents.participent" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$participentId"] },
            },
          },
          {
            $project: userPublicValue,
          },
        ],
        as: "participents",
      },
    },
    {
      $project: {
        groupChat: 1,
        groupName: 1,
        timestamp: 1,
        createdAt: 1,
        updatedAt: 1,
        participents: 1,
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);
};
