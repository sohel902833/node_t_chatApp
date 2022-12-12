import Conversation, { IConversation } from "../../models/conversation.model";
import Message, { IMessage } from "../../models/message.model";

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
