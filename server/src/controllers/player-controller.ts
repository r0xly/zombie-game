import { Server } from "../server";
import { WebSocket } from "uWebSockets.js";
import { UserData } from "../util/user";
import EventEmitter from "events";

interface Player
{
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
            websocket: websocket,
            userData: userData
        }
        
        this.emit("PlayerJoined", player);
        this.players[userData.userId] = player;
    }

    /**
     * Removes a pre-existing Player related to a WebSocket connection.
     * @param websocket 
     */
    unregisterPlayer(websocket: WebSocket<UserData>)
    {
        const player = this.players[websocket.getUserData().userId];

        if (!player)
            return;

        this.emit("PlayerLeft", player);
        delete this.players[websocket.getUserData().userId];
    }

    getPlayers()
    {
        return Object.values(this.players);
    }
}