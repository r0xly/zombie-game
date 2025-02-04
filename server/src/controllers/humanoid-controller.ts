import { SyncPlayerHumanoids, SyncZombieHumanoids, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";
import { HUMANOID_UPDATE_TICK } from "../config";
import { Server } from "../server";

export class HumanoidController
{
    constructor(private server: Server)
    {
        server.messages.on(MessageType.UpdatePlayerHumanoid, (player, message) => 
        {
            player.humanoid.x = message.humandData.position.x;
            player.humanoid.y = message.humandData.position.y;
            player.humanoid.velocity.x = message.humandData.velocity.x;
            player.humanoid.velocity.y = message.humandData.velocity.y;
            player.humanoid.tool = message.humandData.tool;
        });
        
        setInterval(() => this.tick(HUMANOID_UPDATE_TICK), HUMANOID_UPDATE_TICK);
    }

    tick(deltaTime: number)
    {
        const playerHumanoids = {};
        const zombieHumanoids = {};

        for (const player of this.server.players.getPlayers())
        {
            playerHumanoids[player.userData.userId] = player.humanoid.getData()
        }

        for (const zombie of this.server.zombies.getZombies())
        {
            zombieHumanoids[zombie.id] = zombie.humanoid.getData();
        }

        this.server.messages.broadcastMessage(new SyncPlayerHumanoids(playerHumanoids));
        this.server.messages.broadcastMessage(new SyncZombieHumanoids(zombieHumanoids));
    }
}