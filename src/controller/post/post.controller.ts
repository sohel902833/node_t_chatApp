import { Response } from "express";
import { getPaginationProperty } from "../../lib/pagination";
import Like from "../../models/like.model";
import Post from "../../models/post.model";
import {
  addNewChildComment,
  createComment,
  editComment,
  fetchAllComments,
} from "../../services/post/comment.service";
import {
  createLike,
  createPost,
  editLike,
  editPost,
  fetchAllPost,
  findSinglePost,
  removeLike,
  removePost,
} from "../../services/post/post.service";
import { IRequest } from "../../types/express";
import {
  ICommentModelType,
  ILikesModelType,
  IPostModelType,
} from "../types/post.types";
import { userPublicValue } from "./../user/userConfig";

export const createNewPost = async (req: IRequest, res: Response) => {
  try {
    const { title, videoUrl, description, images } = req.body as IPostModelType;

    if (!title && !videoUrl && !description && !images) {
      return res.status(404).json({
        message: "Please Enter Some Data For Post",
      });
    }

    const userId = req.userId;
    const post: IPostModelType = {
      title: title ? title : "",
      videoUrl: videoUrl ? videoUrl : "",
      user: userId,
      description: description ? description : "",
      images,
    };
    const createdPost = await createPost(post);
    res.status(200).json({
      success: true,
      message: "New Post Created",
      meta: createdPost,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server error found.",
    });
  }
};
export const updatePost = async (req: IRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const { title, videoUrl, description, images } = req.body as IPostModelType;

    const post = await findSinglePost(postId);
    if (!post) {
      return res.status(202).json({
        message: "No Post Found For This Id",
        success: false,
      });
    }

    //post founded lets updated the post model

    const newPostMod: IPostModelType = {
      title: title ? title : post?.title,
      videoUrl: videoUrl ? videoUrl : post?.videoUrl,
      description: description ? description : post?.description,
      images: images && images?.length > 0 ? images : post.images,
    };
    const updatedPost = await editPost(newPostMod, postId);

    res.status(200).json({
      success: true,
      message: "Post Updated",
      meta: updatedPost,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server error found.",
    });
  }
};
export const deletePost = async (req: IRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const dbPost = await findSinglePost(postId);
    if (!dbPost) {
      return res.status(200).json({
        message: "No Post Found",
        success: false,
      });
    }

    //post founded check authorize
    if (dbPost.user?.toString() !== userId) {
      return res.status(200).json({
        message: "You Are Not Authorize to delete this post",
        success: false,
      });
    }
    //everything fine now delete the post

    const deletedPost = await removePost(postId);

    res.status(200).json({
      message: "Post Deleted",
      success: true,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server error found.",
    });
  }
};
export const getAllPost = async (req: IRequest, res: Response) => {
  try {
    const { page, limit } = req.query;
    if (page && limit) {
      let {
        result,
        limit: lm,
        startIndex,
      } = await getPaginationProperty(Number(page), Number(limit), Post, {});
      let posts = await Post.find()
        .populate("user", userPublicValue)
        .limit(lm)
        .skip(startIndex)
        .exec();
      result.data = posts;
      res.status(201).json(result);
    } else {
      const posts = await Post.find().populate("user", userPublicValue);
      res.status(201).json(posts);
    }
  } catch (err) {
    res.status(404).json({
      message: "Server error found.",
    });
  }
};
export const getAllPostV2 = async (req: IRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { page, limit } = req.query;
    if (page && limit) {
      let {
        result,
        limit: lm,
        startIndex,
      } = await getPaginationProperty(Number(page), Number(limit), Post, {});
      const data = await fetchAllPost(userId as string, {
        limit: lm,
        skip: startIndex,
      });
      result.data = data;
      res.status(201).json(result);
    } else {
      const data = await fetchAllPost(userId as string);
      res.status(201).json({ data });
    }
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found",
      success: false,
      err,
    });
  }
};
export const getSinglePost = async (req: IRequest, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "user",
      userPublicValue
    );
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({
      message: "Server error found.",
    });
  }
};

export const setLikeToPost = async (req: IRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { reaction } = req.body;

    const prevLike = await Like.findOne({
      $and: [{ post: postId }, { user: userId }],
    });
    if (prevLike) {
      //previously liked if reaction ===delete then delete like otherwise update with new reaction
      if (reaction === "delete") {
        //delete prevlike
        const deleteLike = await removeLike(prevLike?._id.toString());
        return res.status(203).json({
          success: true,
          message: "Like Removed.",
        });
      } else {
        //update like
        const newLike: ILikesModelType = {
          reaction: reaction,
        };
        const updatedLike = await editLike(newLike, prevLike?._id.toString());
        return res.status(202).json({
          success: true,
          message: "Like Updated",
        });
      }
    }

    const like: ILikesModelType = {
      user: userId,
      post: postId,
      reaction: reaction,
    };

    const createdLike = await createLike(like);

    return res.status(201).json({
      message: "You Liked This Post",
      success: true,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found",
    });
  }
};
export const commentToPost = async (req: IRequest, res: Response) => {
  try {
    const { postId, text, parentCommentId } = req.body;
    if (!postId && !text) {
      return res.status(404).json({
        success: false,
        message: "Nothing Found For Create Comment",
      });
    }
    const newComment: ICommentModelType = {
      text: text,
      post: postId,
      user: req.userId,
      parentComment: parentCommentId,
    };
    const createdComment = await createComment(newComment);
    //@ts-ignore
    const childCommentId = createdComment?._id?.toString();
    //update parent comment
    if (parentCommentId) {
      const addedNewChildComment = await addNewChildComment(
        parentCommentId,
        childCommentId
      );
    }
    return res.status(201).json({
      message: "Comment Created.",
      meta: createdComment,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
    });
  }
};
export const getComments = async (req: IRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const parentComment = req.query.parentComment;
    const comments = await fetchAllComments(
      postId,
      parentComment ? parentComment.toString() : ""
    );
    res.status(200).json({
      message: "All Comments",
      comments,
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
    });
  }
};

export const updateComment = async (req: IRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const text = req.body.text;
    if (!text) {
      return res.status(200).json({
        message: "Nothing Found for Update",
      });
    }
    const editedComment = await editComment({ text }, commentId);

    res.status(200).json({
      message: "Comment Updated",
    });
  } catch (err) {
    res.status(404).json({
      message: "Server Error Found.",
    });
  }
};
