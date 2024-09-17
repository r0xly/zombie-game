import { SyncPlayerHumanoids, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";
import { HUMANOID_UPDATE_TICK } from "../config";
import { Server } from "../server";

export class HumanoidController
{
    constructor(private server: Server)
    {
        server.messages.on(MessageType.UpdatePlayerHumanoid, (player, message) => 
        {
            player.humanoid.x = message.x;
            player.humanoid.y = message.y;
        });
        
        setInterval(() => this.tick(HUMANOID_UPDATE_TICK), HUMANOID_UPDATE_TICK);
    }

    tick(deltaTime: number)
    {
        const playerHumanoids = {}

        this.server.players.getPlayers().forEach(player => 
            playerHumanoids[player.userData.userId] = 
            {
                x: player.humanoid.x,
                y: player.humanoid.y
            }
        );

        this.server.messages.broadcastMessage(new SyncPlayerHumanoids(playerHumanoids));
    }
}