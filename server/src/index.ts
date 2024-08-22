import { App } from "uWebSockets.js";
import { Server } from "./server";
import { MessageType } from "../../common/src/messages/message-type";
import { UserChatMessage } from "../../common/src/messages/message-objects";

const app = App();

const server = new Server(app, 9001)

server.messageController.on(MessageType.SendChatMesage, (sender, message) => 
{
    const userData = sender.getUserData();

    console.log(`${userData.displayName} (${userData.userId}): ${message.content}`);
    server.messageController.sendMessage(sender, new UserChatMessage(userData.displayName, message.content));
});