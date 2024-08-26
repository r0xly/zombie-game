import { Container } from "pixi.js";
import { NetworkController } from ".";
import { messageRegistry } from "../../../../common/src/messages/message-decorator";
import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids } from "../../../../common/src/messages/message-objects";
import { MessageType } from "../../../../common/src/messages/message-type";
import { Humanoid } from "../../objects/humanoid";

export interface Player
{
    humanoid: Humanoid
    displayName: string,
    userId: string,
}

export class Players 
{
    private players: Record<string, Player> = {};

    constructor(private networkController: NetworkController)
    {
        networkController.on(MessageType.SyncPlayerHumanoids, message => this.onSyncPlayerHumanoids(message));
        networkController.on(MessageType.PlayerJoined, message => this.onPlayerAdded(message));
        networkController.on(MessageType.PlayerLeft, message => this.onPlayerRemoved(message));
    }

    private onSyncPlayerHumanoids(message: SyncPlayerHumanoids)
    {
        console.log(message);
        for (const userId in message.players)
        {
            const player = this.players[userId];

            if (!player)
                continue;

            const { x, y } = message.players[userId];
            player.humanoid.x = x;
            player.humanoid.y = y;
        }
    }

    private onPlayerAdded(message: PlayerJoined)
    {
        const humanoid = new Humanoid();
        
        this.players[message.userId] =
        {
            displayName: message.displayName,
            userId: message.userId,
            humanoid: humanoid,
        }
        this.networkController.game.workspace.addChild(humanoid);
    }

    private onPlayerRemoved(message: PlayerLeft)
    {
        const player = this.players[message.userId];
        player.humanoid.destroy();

        delete this.players[message.userId];
    }
}