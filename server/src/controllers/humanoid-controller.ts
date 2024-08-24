import { SyncPlayerHumanoids, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";
import { HUMANOID_UPDATE_TICK } from "../config";
import { Server } from "../server";

export class HumanoidController
{
    constructor(private server: Server)
    {
        // Updates the a Player's Humanoid's state on the server.
        server.messageController.on(MessageType.UpdatePlayerHumanoid, (player, message) => 
        {
            player.humanoid.x = message.x;
            player.humanoid.y = message.y;
        });
        
        setInterval(() => this.tick(HUMANOID_UPDATE_TICK), HUMANOID_UPDATE_TICK);
    }

    tick(deltaTime: number)
    {
        // Replicates the state of Player Humanoids.
        const playerHumanoids = {}

        this.server.playerController.getPlayers().forEach(player => 
            playerHumanoids[player.userData.userId] = 
            {
                x: player.humanoid.x,
                y: player.humanoid.y
            }
        );

        this.server.messageController.broadcastMessage(new SyncPlayerHumanoids(playerHumanoids));
    }
}