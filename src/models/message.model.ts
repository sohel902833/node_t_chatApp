import { model, Schema, Types } from "mongoose";
import {
  CONVERSATION_MODEL_NAME,
  MESSAGE_MODEL_NAME,
  USER_MODEL_NAME,
} from "./modelConfig";

export interface IMessage {
  _id?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  text?: string;
  authors: Types.ObjectId[] | string[];
  sender?: Types.ObjectId | string;
  readBy: Types.ObjectId[] | string[];
  images?: [
    {
      _id?: string;
      url: string;
      fileName: string;
    }
  ];
  timestamp?: number;
  unsent?: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: CONVERSATION_MODEL_NAME,
      required: true,
    },
    text: String,
    authors: [
      {
        type: Types.ObjectId,
        ref: USER_MODEL_NAME,
      },
    ],
    sender: {
      type: Types.ObjectId,
      ref: CONVERSATION_MODEL_NAME,
      required: true,
    },
    unsent: {
      type: Boolean,
      required: true,
      default: false,
    },
    images: [
      {
        url: String,
        fileName: String,
      },
    ],
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

const Message = model<IMessage>(MESSAGE_MODEL_NAME, MessageSchema);

export default Message;
