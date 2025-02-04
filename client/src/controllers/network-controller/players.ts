import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids, WelcomeMessage } from "../../../../common/src/messages/message-objects";
import { MessageType } from "../../../../common/src/messages/message-type";
import { Humanoid } from "../../objects/humanoid";
import { NetworkController, NetworkLogType } from ".";
import { WeaponData } from "../../data/weapon-data";
import { Weapon } from "../../objects/tools/weapon";
import { getTool } from "../../util/get-tool";

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
        this.networkController.game.playerController.spawnPlayer();

        message.otherPlayers.forEach(player => this.addPlayer(player.displayName, player.userId));
    }

    private onSyncPlayerHumanoids(message: SyncPlayerHumanoids)
    {
        for (const userId in message.players)
        {
            const player = this.players[userId];

            if (userId === this.localPlayer.userId)
            {
                // This is the data for our own character, so we should skip it
                continue;
            }
            else if (!player)
            {
                this.networkController.log(NetworkLogType.WARNING, `Failed to sync a player's humanoid. Player with id >>${userId}<< does not exist.`);
                continue;
            }

            const humanoidData = message.players[userId];
            player.humanoid.x = humanoidData.position.x;
            player.humanoid.y = humanoidData.position.y;

            const equippedTool = player.humanoid.equippedTool;

            if (equippedTool && !humanoidData.tool)
            {
                // The player has uneqiupped a tool
                player.humanoid.unequipTool();
            }   
            else if ((equippedTool && humanoidData.tool && humanoidData.tool.name !== equippedTool.constructor.name) || (!equippedTool && humanoidData.tool))
            {
                // The player has changed their tool or equipped a new one
                const newTool = getTool(humanoidData.tool.catagory, humanoidData.tool.name);

                if (newTool)
                {
                    player.humanoid.equipTool(newTool);
                    newTool.setRotation(humanoidData.tool.rotation);
                }
                else 
                {
                    console.warn(`Failed to equip tool called ${humanoidData.tool.name} (catagory: ${humanoidData.tool.catagory}) for player ${player.displayName} (${player.userId}). Tool does not exist.`)
                }
            }
            else if (equippedTool)
            {
                equippedTool.setRotation(humanoidData.tool.rotation);
            }

        }
    }

    private addPlayer(displayName: string, userId: string)
    {
        const humanoid = new Humanoid(displayName);

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