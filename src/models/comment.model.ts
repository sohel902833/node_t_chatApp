import { model, Schema, Types } from "mongoose";
import { ICommentModelType } from "../controller/types/post.types";
import {
  COMMENT_MODEL_NAME,
  POST_MODEL_NAME,
  USER_MODEL_NAME,
} from "./modelConfig";

const commentScheme = new Schema<ICommentModelType>(
  {
    post: {
      type: Types.ObjectId,
      ref: POST_MODEL_NAME,
    },
    user: {
      type: Types.ObjectId,
      ref: USER_MODEL_NAME,
    },
    text: String,
    parentComment: {
      type: Types.ObjectId,
      ref: COMMENT_MODEL_NAME,
    },
    childComments: [
      {
        type: Types.ObjectId,
        ref: COMMENT_MODEL_NAME,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = model<ICommentModelType>(COMMENT_MODEL_NAME, commentScheme);

export default Comment;
