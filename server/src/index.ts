import { App } from "uWebSockets.js";
import { Server } from "./server";
import { MessageType } from "../../common/src/messages/message-type";

const app = App();

new Server(app, 9001).messageController.on(MessageType.ChatMesage, chatMessage => {
    console.log(chatMessage.content);
});