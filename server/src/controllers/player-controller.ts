import { Server } from "../server";
import { WebSocket } from "uWebSockets.js";
import { UserData } from "../util/user";
import EventEmitter from "events";
import { PlayerJoined, PlayerLeft } from "../../../common/src/messages/message-objects";

export interface Player
{
    humanoid: { x: number, y: number },
    websocket: WebSocket<UserData>,
    userData: UserData,
}

// Defines the differnt event types for  intellisense.
export declare interface PlayerController
{
    on(event: string, listener: Function): this;
    on(event: "PlayerJoined", listener: (player: Player) => void);
    on(event: "PlayerLeft", listener: (player: Player) => void);
}

export class PlayerController extends EventEmitter
{
    /** A map of user IDs to their associated Player objects. */
    private players: Record<string, Player> = {};

    constructor(private server: Server)
    {
        super();
    }

    /**
     * Creates a Player object for a WebSocket connection.
     * @param websocket 
     */
    registerPlayer(websocket: WebSocket<UserData>)
    {
        const userData = websocket.getUserData();
        const player: Player = 
        {
            humanoid: { x: 0, y: 0 },
            websocket: websocket,
            userData: userData,
        }
        
        
        this.server.messageController.broadcastMessage(new PlayerJoined(player.userData.userId, player.userData.displayName));
        this.getPlayers().forEach(other => this.server.messageController.sendMessage(player, new PlayerJoined(other.userData.userId, other.userData.displayName)));
        this.emit("PlayerJoined", player);

        this.players[userData.userId] = player;
    }

    /**
     * Removes a pre-existing Player object for a WebSocket connection.
     * @param websocket 
     */
    unregisterPlayer(websocket: WebSocket<UserData>)
    {
        const player = this.getPlayerFromWebSocket(websocket);

        if (!player)
            return;

        delete this.players[websocket.getUserData().userId];

        this.server.messageController.broadcastMessage(new PlayerLeft(player.userData.userId));
        this.emit("PlayerLeft", player);
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