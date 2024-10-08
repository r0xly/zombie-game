import { Server } from "../server";
import { WebSocket } from "uWebSockets.js";
import { UserData } from "../util/user";
import EventEmitter from "events";
import { PlayerJoined, PlayerLeft, WelcomeMessage } from "../../../common/src/messages/message-objects";
import { ServerLogType } from "./logs-controller";

export interface Player
{
    humanoid: { x: number, y: number },
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
    }

    private addPlayer(websocket: WebSocket<UserData>)
    {
        const userData = websocket.getUserData();
        const otherPlayers = [];    // A list of all other current players and their positions that will be sent to the client
        const localPlayer =         // The player data being sent to the client
        {
            displayName: userData.displayName,
            userId: userData.userId
        }
        const player: Player =      // The player object being stored on the server
        {
            humanoid: { x: 0, y: 0 },
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
        
        this.server.logs.log(ServerLogType.DEBUG, `(Player Added)   Id: >>${userData.userId}<<  Name: >>${userData.displayName}<<`);

        this.server.messages.sendMessage(player, new WelcomeMessage(localPlayer, otherPlayers));
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

            this.server.logs.log(ServerLogType.DEBUG, `(Player Removed) Id: >>${userData.userId}<<  Name: >>${userData.displayName}<<`);
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