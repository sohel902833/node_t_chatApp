import { model, Schema, Types } from "mongoose";
import { IPostModelType } from "../controller/types/post.types";
import {
  LIKE_MODEL_NAME,
  POST_MODEL_NAME,
  USER_MODEL_NAME,
} from "./modelConfig";

const postScheme = new Schema<IPostModelType>(
  {
    user: {
      type: Types.ObjectId,
      ref: USER_MODEL_NAME,
    },
    description: {
      type: String,
    },
    images: [
      {
        url: String,
        fileName: String,
      },
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: LIKE_MODEL_NAME,
      },
    ],
    title: String,
    videoUrl: String,
  },
  {
    timestamps: true,
  }
);

const Post = model<IPostModelType>(POST_MODEL_NAME, postScheme);

export default Post;
