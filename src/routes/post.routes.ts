import { Router } from "express";
import * as postController from "../controller/post/post.controller";
import { authGard } from "../middlewares/authGard";
export const router = Router();

router.post("/", authGard(), postController.createNewPost);
router.put("/:postId", authGard(), postController.updatePost);
router.get("/", authGard(), postController.getAllPost);
router.get("/v2", authGard(), postController.getAllPostV2);
router.get("/:postId", authGard(), postController.getSinglePost);
router.delete("/:postId", authGard(), postController.deletePost);
router.post("/like/:postId", authGard(), postController.setLikeToPost);

//comment routes
router.post("/comment", authGard(), postController.commentToPost);
router.get("/comment/:postId", authGard(), postController.getComments);
router.put("/comment/:commentId", authGard(), postController.updateComment);
