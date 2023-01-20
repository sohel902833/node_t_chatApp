import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { SocketEvent } from "../../lib/socketEvents";
import { MESSAGE_MODEL_NAME, USER_MODEL_NAME } from "../../models/modelConfig";
import { io } from "../../server";
import {
  fetchSingleConversation,
  getConversation,
  getMessage,
  getMyConversationsWithUnreadCount,
  insertConversation,
  insertMessage,
  setLastMessageInConversation,
} from "../../services/conversation/conversation.service";
import Conversation, {
  IConversation,
  IParticipent,
} from "./../../models/conversation.model";
import Message, { IMessage } from "./../../models/message.model";
import { IRequest } from "./../../types/express/index.d";
import { messagePublicValue } from "./messageConfig";
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
        success: false,
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
        success: false,
      });
    }
    //participent exists ,, check is it group chat or single

    if (filteredParticipent.length > 1) {
      //its a group chat
      if (!groupName) {
        return res.status(200).json({
          message: "Enter Group Name",
          success: false,
        });
      }
      groupChat = true;
    }
    //check conversation already exists with this user
    if (!groupChat) {
      const prevParticipent = await Conversation.findOne({
        $and: [
          { "participents.participent": userId },
          { "participents.participent": filteredParticipent[0] },
        ],
      });
      if (prevParticipent) {
        return res.status(200).json({
          message: "Conversation Already Exists",
          conversation: prevParticipent,
          success: true,
        });
      }
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
      success: true,
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
export const getSingleConversation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;

    const conversations = await fetchSingleConversation(conversationId);

    //check conversation found or not
    if (conversations?.length === 0) {
      return res.status(200).json({
        message: "Conversation Not Found.",
        success: false,
        notFound: true,
      });
    }
    //conversation is there
    res.status(200).json({
      message: "Conversation Found.",
      success: true,
      conversation: conversations[0],
    });
  } catch (err) {
    return res.status(200).json({
      message: "Conversation Not Found.",
      success: false,
      notFound: true,
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
    const { text, replideMessage } = req.body;

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
      unreadFor: authors.filter((at) => at !== userId),
      conversationId: conversation._id,
      sender: userId,
      text,
      replideMessage: replideMessage && new Types.ObjectId(replideMessage),
    };

    //save message
    const savedMessage = await insertMessage(msg);
    //update conversation
    const updateConversation = await setLastMessageInConversation(
      conversationId,
      savedMessage._id.toString()
    );
    const newMessage = await Message.findOne({
      _id: savedMessage?._id?.toString(),
    })
      .populate({
        path: "sender",
        model: USER_MODEL_NAME,
        select: {
          firstName: 1,
          lastName: 1,
        },
      })
      .populate({
        path: "replideMessage",
        model: MESSAGE_MODEL_NAME,
        select: messagePublicValue,
      });
    //broadcust message
    io.sockets.emit(SocketEvent.MESSAGE_SENT, {
      receivers: authors,
      meta: newMessage,
    });
    //done
    res.status(201).json({
      message: "Message Sent.",
      data: newMessage,
    });
  } catch (err) {
    console.log("Error", err);
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
      .populate({
        path: "replideMessage",
        model: MESSAGE_MODEL_NAME,
        select: messagePublicValue,
      })
      .sort({ createdAt: 1 });

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
    io.sockets.emit(SocketEvent.DELETE_CONVERSATION, {
      receivers: userId,
      meta: {
        conversationId,
      },
    });
    return res.status(201).json({
      message: "Conversation Deleted.",
      success: true,
    });
  } catch (err) {
    res.status(200).json({
      message: "Server Error Found.",
      error: err,
      success: false,
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
    if (message?.sender?.toString() !== userId) {
      return res.status(200).json({
        message: "You Are Not Authorized To Perform This Action",
        success: false,
      });
    }

    const updateMessage = await Message.updateOne(
      { _id: messageId },
      {
        text: "",
        images: [],
        unsent: true,
      }
    );

    io.sockets.emit(SocketEvent.UNSEND_MESSAGE, {
      receivers: message?.authors,
      meta: {
        conversationId: message?.conversationId,
        messageId: message?._id,
      },
    });
    return res.status(201).json({
      message: "Message Removed.",
      success: true,
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
    if (!message) {
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
    io.sockets.emit(SocketEvent.REMOVE_MESSAGE_FOR_ME, {
      receivers: userId,
      meta: {
        messageId,
        conversationId: message?.conversationId,
      },
    });

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
