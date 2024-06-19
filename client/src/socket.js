import { io } from "socket.io-client";

const socket = io(process.env.SOCKET_URL || "http://127.0.0.1:5000");

export default socket;
