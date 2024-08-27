import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids, WelcomeMessage } from "../../../../common/src/messages/message-objects";
import { parseMessage, stringifyMessage } from "../../../../common/src/messages/message-parser";
import { MessageType } from "../../../../common/src/messages/message-type";
import { EventEmitter } from "pixi.js";
import { Players } from "./players";
import { Game } from "../../game";


export declare interface NetworkController
{
    on(event: MessageType.SyncPlayerHumanoids, listener: (message: SyncPlayerHumanoids) => void): this
    on(event: MessageType.PlayerJoined, listener: (message: PlayerJoined) => void): this
    on(event: MessageType.PlayerLeft, listener: (message: PlayerLeft) => void): this
    on(event: MessageType.Welcome, listener: (message: WelcomeMessage) => void): this
    on(event: string, listener: Function): this;
}

export class NetworkController extends EventEmitter
{
    private websocket: WebSocket;

    players = new Players(this);

    constructor(public game: Game, url: string, displayName: string)
    {
        super();

        const websocket = new WebSocket(`${url}?display-name=${displayName}`);

        websocket.onmessage = (msg) => this.emit(...parseMessage(msg.data));
        websocket.onopen = () => console.log("WebSocket open.")
        websocket.onclose = () => console.log("WebSocket closed.")

        this.websocket = websocket;
    }

    sendMessage(message: object)
    {
        if (this.websocket.readyState !== WebSocket.OPEN)
            return console.warn(`Failed to send message ${message}. WebSocket is not open.`)

        try 
        {
            this.websocket.send(stringifyMessage(message));
        }
        catch (error)
        {
            console.error(`Failed to send message ${message}. Error: ${error}.`)
        }
    }
}