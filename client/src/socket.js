import { io } from "socket.io-client";
//"http://127.0.0.1:5000"
const socket = io(process.env.SOCKET_URL);

export default socket;
