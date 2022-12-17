import { NextFunction, Response } from "express";
import { USER_MODEL_NAME } from "../../models/modelConfig";
import {
  getConversation,
  getMessage,
  getMyConversationsWithUnreadCount,
  insertConversation,
  insertMessage,
  setLastMessageInConversation,
} from "../../services/conversation/conversation.service";
import { userPublicValue } from "../user/userConfig";
import Conversation, {
  IConversation,
  IParticipent,
} from "./../../models/conversation.model";
import Message, { IMessage } from "./../../models/message.model";
import { IRequest } from "./../../types/express/index.d";

export const createConversation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { participents, groupName } = req.body;
    const userId = req.userId;
    if (!participents) {
      return res.status(200).json({
        message: "Participent not found.",
      });
    }
    let groupChat = false;

    //check current user exists on participent or not
    const filteredParticipent: string[] = participents.filter(
      (pt: string) => pt !== userId
    );

    //check participent exists or not after filter
    if (filteredParticipent.length === 0) {
      return res.status(200).json({
        message: "Participent Not Found.May You Select You In Participent",
      });
    }
    //participent exists ,, check is it group chat or single

    if (filteredParticipent.length > 1) {
      //its a group chat
      if (!groupName) {
        return res.status(200).json({
          message: "Enter Group Name",
        });
      }
      groupChat = true;
    }
    //push current user to the participent
    filteredParticipent.push(userId as string);
    //generate participents
    const finalParticipent: IParticipent[] = filteredParticipent.map(
      (pt: string) => {
        const prt: IParticipent = {
          nickName: "",
          participent: pt,
        };
        return prt;
      }
    );

    const conversation: IConversation = {
      participents: finalParticipent,
      groupChat: groupChat,
      groupName: groupChat ? groupName : "",
    };
    const createdConversation = await insertConversation(conversation);

    return res.status(201).json({
      message: "Conversation Created.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};

export const getMyConversations = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      "participents.participent": userId,
    })
      .populate({
        path: "participents.participent",
        model: USER_MODEL_NAME,
        select: userPublicValue,
      })
      .populate("lastMessage", userPublicValue)
      .sort({ updatedAt: -1 });

    if (conversations.length > 0) {
      return res.status(201).json({
        conversations,
      });
    }
    res.status(200).json({
      message: "Conversation Not Found.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};

export const getMyConversationsV2 = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversations = await getMyConversationsWithUnreadCount(
      userId as string
    );
    if (conversations.length > 0) {
      return res.status(201).json({
        conversations,
      });
    }
    res.status(200).json({
      message: "Conversation Not Found.",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};

export const sendMessage = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;
    const { text } = req.body;

    if (!text) {
      return res.status(200).json({
        message: "No Message Found",
      });
    }

    const conversation = await getConversation(conversationId);
    if (!conversation) {
      return res.status(200).json({
        message: "No Conversation Found.",
      });
    }
    const authors: string[] = conversation.participents.map((pt) =>
      pt.participent.toString()
    );
    const msg: IMessage = {
      authors: authors,
      // unreadFor: authors.filter((at) => at !== userId),
      unreadFor: authors,
      conversationId: conversation._id,
      sender: userId,
      text,
    };

    //save message
    const savedMessage = await insertMessage(msg);
    //update conversation
    const updateConversation = await setLastMessageInConversation(
      conversationId,
      savedMessage._id.toString()
    );

    //done
    res.status(201).json({
      message: "Message Sent.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};

export const getConversationMessage = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;

    const updateMessage = await Message.updateMany(
      { conversationId: conversationId },
      {
        $pull: { unreadFor: userId },
      }
    );

    const messages = await Message.find({
      $and: [
        {
          conversationId: conversationId,
        },
        {
          authors: { $in: [userId] },
        },
      ],
    })
      .populate({
        path: "sender",
        model: USER_MODEL_NAME,
        select: {
          firstName: 1,
          lastName: 1,
        },
      })
      .sort({ timestamp: -1 });

    if (messages.length > 0) {
      return res.status(201).json({
        messages,
      });
    }
    res.status(200).json({
      message: "Message Not Found.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};

export const deleteConversation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;

    const updateMessage = await Message.updateMany(
      { conversationId: conversationId },
      {
        $pull: { authors: userId },
      }
    );
    return res.status(201).json({
      message: "Conversation Deleted.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};
export const unsentMessage = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const messageId = req.params.messageId;

    const message = await getMessage(messageId);
    if (!message || message?.sender?.toString() !== userId) {
      return res.status(200).json({
        message: "Message Not Found.",
      });
    }
    //message exists and authorized user

    const updateMessage = await Message.updateOne(
      { _id: messageId },
      {
        text: "",
        images: [],
        unsent: true,
      }
    );

    return res.status(201).json({
      message: "Message Removed.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};
export const removeForMe = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const messageId = req.params.messageId;

    const message = await getMessage(messageId);
    if (!message || message?.sender?.toString() !== userId) {
      return res.status(200).json({
        message: "Message Not Found.",
      });
    }
    //message exists and authorized user
    const updateMessage = await Message.updateOne(
      { _id: messageId },
      {
        $pull: { authors: userId },
      }
    );

    return res.status(201).json({
      message: "Message Removed For You.",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
      error: err,
    });
  }
};
