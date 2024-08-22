import { io } from "socket.io-client";

const URL = import.meta.env.VITE_DOMAIN_SERVER;

export const socket = io(URL, {
  transports: ["websocket"],
});
