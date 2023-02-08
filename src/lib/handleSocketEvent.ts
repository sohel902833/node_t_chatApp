import { IUserOnlineResponse } from "../controller/types/socket.types";
import User from "../models/user.model";
import { io } from "../server";
import { SocketEvent } from "./socketEvents";
class SocketEventHandler {
  socket: any = null;
  constructor(socket: any) {
    this.socket = socket;
  }

  handleSocketEvent = () => {
    this.socket.on(
      SocketEvent.UPDATE_ACTIVE_STATUS,
      (data: IUserOnlineResponse) => {
        this.updateUserOnlineStatus(data.userId, true);
        io.sockets.emit(SocketEvent.UPDATE_ACTIVE_STATUS, {
          receivers: "all",
          userId: data.userId,
          online: true,
          lastActive: new Date(),
        });
      }
    );
  };

  updateUserOnlineStatus = async (userId: string, online: boolean) => {
    // const updateUser=
    const updateUser = await User.updateOne(
      { _id: userId },
      {
        online: online,
        lastActive: new Date(),
      }
    );
  };
}

export default SocketEventHandler;
