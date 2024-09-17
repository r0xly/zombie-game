import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids, WelcomeMessage } from "../../../../common/src/messages/message-objects";
import { MessageType } from "../../../../common/src/messages/message-type";
import { Humanoid } from "../../objects/humanoid";
import { NetworkController, NetworkLogType } from ".";

export interface Player
{
    humanoid: Humanoid,
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
        networkController.on(MessageType.PlayerJoined, message => this.addPlayer(message.displayName, message.userId));
        networkController.on(MessageType.PlayerLeft, message => this.removePlayer(message.userId));
        networkController.on(MessageType.Welcome, message => this.onWelcome(message));
    }

    private onWelcome(message: WelcomeMessage)
    {
        this.localPlayer.displayName = message.localPlayer.displayName;
        this.localPlayer.userId = message.localPlayer.userId; 

        this.networkController.log(NetworkLogType.DEBUG, `LocalPlayer name: >>${message.localPlayer.displayName}<<`);
        this.networkController.log(NetworkLogType.DEBUG, `LocalPlayer id:   >>${message.localPlayer.userId}<<`);

        message.otherPlayers.forEach(player => this.addPlayer(player.displayName, player.userId));
    }

    private onSyncPlayerHumanoids(message: SyncPlayerHumanoids)
    {
        for (const userId in message.players)
        {
            const player = this.players[userId];

            if (userId === this.localPlayer.userId)
            {
                continue;
            }
            else if (!player)
            {
                this.networkController.log(NetworkLogType.WARNING, `Failed to sync a player's humanoid. Player with id >>${userId}<< does not exist.`);
                continue;
            }

            const humanoidData = message.players[userId];
            player.humanoid.x = humanoidData.x;
            player.humanoid.y = humanoidData.y;
        }
    }

    private addPlayer(displayName: string, userId: string)
    {
        const humanoid = new Humanoid();

        this.players[userId] = 
        {
            displayName: displayName,
            userId: userId,
            humanoid: humanoid
        }

        this.networkController.game.workspace.addChild(humanoid);
    }

    private removePlayer(userId: string)
    {
        const player = this.players[userId];

        if (player)
        {
            player.humanoid.destroy();
            delete this.players[userId];
        }
    }


}