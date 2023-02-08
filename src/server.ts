import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { app } from "./app";
import SocketEventHandler from "./lib/handleSocketEvent";

let io: any = null;
const bootstrap = () => {
  const server = createServer(app);

  //config socket
  io = new SocketServer(server);
  io.on("connection", (socket: any) => {
    console.log("New User Connected");
    const socketEvent = new SocketEventHandler(socket);
    socketEvent.handleSocketEvent();
  });

  server.listen(process.env.PORT, () => {
    console.log("Server Is Running On Port " + process.env.PORT);
  });
};

bootstrap();
export { io };
