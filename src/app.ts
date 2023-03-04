import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDb } from "./db";
import { router as attatchmentRouter } from "./routes/attatchment.routes";
import { router as authRouter } from "./routes/auth.routes";
import { router as conversationRouter } from "./routes/conversation.routes";
import { router as postRouter } from "./routes/post.routes";
import { router as userRouter } from "./routes/user.routes";

const app = express();

dotenv.config();
connectDb();
//ignore cors policy
app.use(cors());
//to parse json data
app.use(express.json());
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req: any, res: any) => {
  res.status(200).json({
    message: "App running fine",
  });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.use("/attatchment", attatchmentRouter);
app.use("/post", postRouter);

//routers wil go here

export { app };
