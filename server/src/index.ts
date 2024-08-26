import { App } from "uWebSockets.js";
import { Server } from "./server";

import "../../common/src/messages/message-objects";

const app = App();
const server = new Server(app, 9001);

server.playerController.on("PlayerJoined", player =>
{
    console.log(`${player.userData.displayName} (${player.userData.userId}) joined the game.`);
});
        
server.playerController.on("PlayerLeft", player =>
{
    console.log(`${player.userData.displayName} (${player.userData.userId}) left the game.`);
});