import { createServer } from "http";
import os from "os";
import { Server as SocketServer } from "socket.io";
import { app } from "./app";
import SocketEventHandler from "./lib/handleSocketEvent";

let io: any = null;
const bootstrap = () => {
  const server = createServer(app);

  //findout core of cpus
  const totalCore = os.cpus().length;
  //config socket
  io = new SocketServer(server);
  io.on("connection", (socket: any) => {
    console.log("New User Connected");
    const socketEvent = new SocketEventHandler(socket);
    socketEvent.handleSocketEvent();
  });

  server.listen(process.env.PORT, () => {
    console.log(
      `Server Is Running ${process.pid} On Port  ${process.env.PORT}`
    );
  });
  // if (cluster.isPrimary) {
  //   for (let i = 0; i < totalCore; i++) {
  //     cluster.fork();
  //   }
  // } else {
  //   server.listen(process.env.PORT, () => {
  //     console.log(
  //       `Server Is Running ${process.pid} On Port  ${process.env.PORT}`
  //     );
  //   });
  // }
};

bootstrap();
export { io };
