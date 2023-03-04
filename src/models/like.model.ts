import { model, Schema, Types } from "mongoose";
import { ILikesModelType } from "../controller/types/post.types";
import {
  LIKE_MODEL_NAME,
  POST_MODEL_NAME,
  USER_MODEL_NAME,
} from "./modelConfig";

const likeScheme = new Schema<ILikesModelType>(
  {
    post: {
      type: Types.ObjectId,
      ref: POST_MODEL_NAME,
    },
    user: {
      type: Types.ObjectId,
      ref: USER_MODEL_NAME,
    },
    reaction: String,
  },
  {
    timestamps: true,
  }
);

const Like = model<ILikesModelType>(LIKE_MODEL_NAME, likeScheme);

export default Like;
