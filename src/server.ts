import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { app } from "./app";

let io: any = null;
const bootstrap = () => {
  const server = createServer(app);

  //config socket
  io = new SocketServer(server);
  io.on("connection", (socket: any) => {
    console.log("New User Connected");
  });

  server.listen(process.env.PORT, () => {
    console.log("Server Is Running On Port " + process.env.PORT);
  });
};

bootstrap();
export { io };
