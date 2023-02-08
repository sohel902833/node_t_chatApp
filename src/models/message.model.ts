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
  unreadFor: Types.ObjectId[] | string[];
  images?: [
    {
      _id?: string;
      url: string;
      fileName: string;
    }
  ];
  timestamp?: Date;
  unsent?: boolean;
  replideMessage?: Types.ObjectId;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: CONVERSATION_MODEL_NAME,
      required: true,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    authors: [
      {
        type: Types.ObjectId,
        ref: USER_MODEL_NAME,
      },
    ],
    unreadFor: [
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
      type: Date,
      default: new Date(),
      required: true,
    },
    replideMessage: {
      type: Types.ObjectId,
      ref: MESSAGE_MODEL_NAME,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage>(MESSAGE_MODEL_NAME, MessageSchema);

export default Message;
