import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids, WelcomeMessage } from "../../../../common/src/messages/message-objects";
import { MessageType } from "../../../../common/src/messages/message-type";
import { Humanoid } from "../../objects/humanoid";
import { NetworkController } from ".";

export interface Player
{
    humanoid: Humanoid
    displayName: string,
    userId: string,
}

export class Players 
{
    private players: Record<string, Player> = {};
    
    localPlayer = 
    {
        displayName: "undefined",
        userId: "undefined"
    }

    constructor(private networkController: NetworkController)
    {
        networkController.on(MessageType.SyncPlayerHumanoids, message => this.onSyncPlayerHumanoids(message));
        networkController.on(MessageType.PlayerJoined, message => this.onPlayerAdded(message));
        networkController.on(MessageType.PlayerLeft, message => this.onPlayerRemoved(message));
        networkController.on(MessageType.Welcome, message => this.onWelcome(message));
    }

    private onWelcome(message: WelcomeMessage)
    {
        this.localPlayer.displayName = message.localPlayer.displayName;
        this.localPlayer.userId = message.localPlayer.userId; 
    }

    private onSyncPlayerHumanoids(message: SyncPlayerHumanoids)
    {
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