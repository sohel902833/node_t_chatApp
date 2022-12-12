import { Request } from "express";
import { IUser } from "../../models/user.model";
export interface IRequest extends Request {
  userId?: string;
  user?: IUser;
}
