import mongoose from "mongoose";
import {
  postPublicValue,
  TOTAL_LIKE_WITH_SINGLE_POST,
} from "../../controller/post/config";
import {
  ILikesModelType,
  IPostModelType,
} from "../../controller/types/post.types";
import {
  likeUserPublicValue,
  userPublicValue,
} from "../../controller/user/userConfig";
import Like from "../../models/like.model";
import { LIKE_MODEL_NAME, USER_MODEL_NAME } from "../../models/modelConfig";
import Post from "../../models/post.model";

export const findSinglePost = async (postId: string) => {
  return Post.findOne({ _id: postId });
};

export const createPost = async (post: IPostModelType) => {
  const newPost = new Post(post);
  return newPost.save();
};

export const editPost = async (post: IPostModelType, postId: string) => {
  return Post.findOneAndUpdate({ _id: postId }, post);
};

export const removePost = async (postId: string) => {
  return Post.findOneAndDelete({ _id: postId });
};

export const createLike = async (like: ILikesModelType) => {
  const newLike = new Like(like);
  return newLike.save();
};
export const removeLike = async (likeId: string) => {
  return Like.findOneAndRemove({ _id: likeId });
};
export const editLike = async (like: ILikesModelType, likeId: string) => {
  return Like.findOneAndUpdate({ _id: likeId }, like);
};

export const fetchAllPost = async (
  userId: string,
  pagination?: { limit: number; skip: number }
) => {
  const postPipeline = [
    {
      $lookup: {
        from: LIKE_MODEL_NAME,
        let: {
          id: "$_id",
          user_id: new mongoose.Types.ObjectId(userId),
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$post"] },
            },
          },
          {
            $lookup: {
              from: USER_MODEL_NAME,
              let: {
                userId: "$user",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$$userId", "$_id"] },
                  },
                },
                {
                  $project: likeUserPublicValue,
                },
              ],
              as: "user",
            },
          },
          {
            $project: {
              _id: 1,
              user: { $arrayElemAt: ["$user", 0] },
              //here we need to
              reaction: 1,
              liked: {
                $eq: [{ $arrayElemAt: ["$user._id", 0] }, "$$user_id"],
              },
            },
          },
          {
            $limit: TOTAL_LIKE_WITH_SINGLE_POST,
          },
        ],
        as: "likes",
      },
    },
    {
      $lookup: {
        from: USER_MODEL_NAME, // The name of the collection to join with
        let: {
          id: "$_id",
          userId: "$user",
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$userId", "$_id"] },
            },
          },
          {
            $project: userPublicValue,
          },
        ],
        as: "user", // The name of the field to populate
      },
    },
    {
      $project: {
        ...postPublicValue,
        user: { $arrayElemAt: ["$user", 0] },
        // liked_by_user: { $anyElementTrue: "$likes.liked" },
        user_liked: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$likes",
                as: "like",
                cond: { $eq: ["$$like.liked", true] },
              },
            },
            0,
          ],
        },
      },
    },
  ];
  if (pagination?.skip || pagination?.limit) {
    postPipeline.push({
      //@ts-ignore
      $skip: pagination?.skip,
    });
    postPipeline.push({
      //@ts-ignore
      $limit: pagination?.limit,
    });
  }

  return Post.aggregate(postPipeline);
};
