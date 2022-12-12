import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./db";
import { router as authRouter } from "./routes/auth.routes";
import { router as conversationRouter } from "./routes/conversation.routes";
import { router as userRouter } from "./routes/user.routes";

const app = express();
dotenv.config();
connectDb();
//to parse json data
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);

//routers wil go here

export { app };
