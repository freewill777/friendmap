import { io } from "socket.io-client";
import { host } from "../appData";

const socket = io(`192.168.0.17:4000`);

export default socket;