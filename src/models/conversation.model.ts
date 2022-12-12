import { model, Schema, Types } from "mongoose";
import {
  CONVERSATION_MODEL_NAME,
  MESSAGE_MODEL_NAME,
  USER_MODEL_NAME,
} from "./modelConfig";

export interface IConversation {
  _id?: Types.ObjectId;
  groupChat?: boolean;
  participents: IParticipent[];
  lastMessage?: Types.ObjectId;
  groupName?: string;
  timestamp?: number;
}

export interface IParticipent {
  participent: Types.ObjectId | string;
  nickName: string;
}

const ConversationSchema = new Schema<IConversation>(
  {
    groupChat: {
      type: Boolean,
      required: true,
      default: false,
    },
    participents: [
      {
        participent: {
          type: Types.ObjectId,
          ref: USER_MODEL_NAME,
        },
        nickName: String,
      },
    ],
    groupName: String,
    lastMessage: {
      type: Types.ObjectId,
      ref: MESSAGE_MODEL_NAME,
    },
    timestamp: {
      type: Number,
      default: new Date().getTime(),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = model<IConversation>(
  CONVERSATION_MODEL_NAME,
  ConversationSchema
);

export default Conversation;
