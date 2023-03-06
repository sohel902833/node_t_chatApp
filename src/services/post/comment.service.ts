import mongoose from "mongoose";
import { ICommentModelType } from "../../controller/types/post.types";
import Comment from "../../models/comment.model";
import { COMMENT_MODEL_NAME } from "../../models/modelConfig";

export const createComment = async (comment: ICommentModelType) => {
  const newComment = new Comment(comment);
  return newComment.save();
};
export const editComment = async (comment: any, commentId: string) => {
  return Comment.findOneAndUpdate({ _id: commentId }, comment);
};

export const addNewChildComment = async (
  commentId: string,
  childCommentId: string
) => {
  return Comment.updateOne(
    {
      _id: commentId,
    },
    {
      $addToSet: { childComments: childCommentId },
    }
  );
};

export const fetchAllComments = async (
  postId: string,
  parentCommentId?: string
) => {
  const findQueries = [{ post: new mongoose.Types.ObjectId(postId) }];
  if (parentCommentId) {
    findQueries.push({
      //@ts-ignore
      _id: new mongoose.Types.ObjectId(parentCommentId.toString()),
    });
  } else {
    findQueries.push({
      //@ts-ignore
      $or: [
        { parentComment: { $exists: false } },
        { parentComment: { $eq: "" } },
      ],
    });
  }
  return Comment.aggregate([
    {
      $match: {
        $and: findQueries,
      },
    },
    {
      $lookup: {
        from: COMMENT_MODEL_NAME,
        localField: "childComments",
        foreignField: "_id",
        as: "childComments",
      },
    },
    // {
    //   $lookup: {
    //     from: COMMENT_MODEL_NAME,
    //     let: {
    //       parentComment: "$_id",
    //     },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $eq: ["$$parentComment", "$_id"] },
    //         },
    //       },
    //     ],
    //     as: "childComments",
    //   },
    // },
  ]);
};
