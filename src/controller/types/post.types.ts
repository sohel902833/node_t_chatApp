import { Types } from "mongoose";

export interface IPostModelType {
  user?: Types.ObjectId | string;
  videoUrl: string;
  images?: [
    {
      _id?: string;
      url: string;
      fileName: string;
    }
  ];
  title: string;
  description?: string;
  likes?: string[];
}

export interface ILikesModelType {
  post?: Types.ObjectId | string;
  user?: Types.ObjectId | string;
  reaction?: "like" | "love" | "react" | "haha" | "angry";
}
