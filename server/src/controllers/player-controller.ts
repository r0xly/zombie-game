import { Server } from "../server";
import { WebSocket } from "uWebSockets.js";
import { UserData } from "../util/user";
import EventEmitter from "events";
import { PlayerJoined, PlayerLeft, TakeDamage, WelcomeMessage } from "../../../common/src/messages/message-objects";
import { ServerLogType } from "./logs-controller";
import { Humanoid } from "../objects/humanoid";
import { MessageType } from "../../../common/src/messages/message-type";

export interface Player
{
    humanoid: Humanoid,
    websocket: WebSocket<UserData>,
    userData: UserData,
}

export declare interface PlayerController               // Defines PlayerController's event types for intellisense.
{
    on(event: string, listener: Function): this;
    on(event: "PlayerJoined", listener: (player: Player) => void);
    on(event: "PlayerLeft", listener: (player: Player) => void);
}

export class PlayerController extends EventEmitter
{
    private players: Record<string, Player> = {};       // A map of user Ids to their associated Player objects

    constructor(private server: Server)
    {
        super();

        server.on("open", websocket => 
        {
            this.addPlayer(websocket);
        });

        server.on("close", websocket =>
        {
            this.removePlayer(websocket);
        });

        server.messages.on(MessageType.AttackPlayer, (player, message) => 
        {
            const targetPlayer = this.players[message.playerId];

            if (targetPlayer)
            {
                server.messages.sendMessage(targetPlayer, new TakeDamage(message.damage, message.knockbackForce, message.knockbackAngle));
            }
        });
    }

    private addPlayer(websocket: WebSocket<UserData>)
    {
        const userData = websocket.getUserData();
        const zombies = [];         // A list of all the current zombies
        const otherPlayers = [];    // A list of all other current players and their positions that will be sent to the client
        const localPlayer =         // The player data being sent to the client
        {
            displayName: userData.displayName,
            userId: userData.userId
        }
        const player: Player =      // The player object being stored on the server
        {
            humanoid: new Humanoid(),
            websocket: websocket,
            userData: userData,
        }

        this.getPlayers().forEach(player =>     // Generats a list of all other player's and their position
        {
            otherPlayers.push(
            { 
                displayName: player.userData.displayName, 
                userId: player.userData.userId,
                x: player.humanoid.x,
                y: player.humanoid.y
            });
        });

        for (const zombie of this.server.zombies.getZombies())     // Generates a list of all zombies
        {
            zombies.push(
            {
                zombieId: zombie.id,
                x: zombie.humanoid.x,
                y: zombie.humanoid.y
            });
        }
        
        this.server.logs.log(ServerLogType.DEBUG, `(Player Added)\n - Id:\t\t\t${userData.userId}\n - Display name:\t${userData.displayName}`);

        this.server.messages.sendMessage(player, new WelcomeMessage(localPlayer, otherPlayers, zombies));
        this.server.messages.broadcastMessage(new PlayerJoined(player.userData.userId, player.userData.displayName));

        this.emit("PlayerJoined", player);
        this.players[userData.userId] = player;
    }

    private removePlayer(websocket: WebSocket<UserData>)
    {
        const userData = websocket.getUserData();
        const player = this.getPlayerFromUserId(userData.userId);

        if (player)
        {
            delete this.players[userData.userId];
            this.server.messages.broadcastMessage(new PlayerLeft(userData.userId));
            this.emit("PlayerLeft", player);

            this.server.logs.log(ServerLogType.DEBUG, `(Player Removed)\n - Id:\t\t\t${userData.userId}\n - Display name:\t${userData.displayName}`);
        }
        else
        {
            this.server.logs.log(ServerLogType.ERROR, `Failed to remove player. Could not find player with user id: >>${userData.userId}<<`);
        }
    }

    getPlayers()
    {
        return Object.values(this.players);
    }

    getPlayerFromWebSocket(websocket: WebSocket<UserData>)
    {
        return this.players[websocket.getUserData().userId];
    }

    getPlayerFromUserId(userId: string)
    {
        return this.players[userId];
    }
}