import { PlayerJoined, PlayerLeft, SyncPlayerHumanoids, WelcomeMessage } from "../../../../common/src/messages/message-objects";
import { parseMessage, stringifyMessage } from "../../../../common/src/messages/message-parser";
import { MessageType } from "../../../../common/src/messages/message-type";
import { EventEmitter } from "pixi.js";
import { Players } from "./players";
import { Game } from "../../game";

const SHOW_DEBUG_LOG = false;

export const enum NetworkLogType
{
    LOG="LOG",
    ERROR="ERROR",
    WARNING="WARNING",
    DEBUG="DEBUG"
}

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
        websocket.onopen = () => this.log(NetworkLogType.LOG, "WebSocket open");
        websocket.onclose = () => this.log(NetworkLogType.LOG, "WebSocket closed");

        this.websocket = websocket;
    }

    log(type: NetworkLogType, content: string)
    {
        const message = `(NETWORK ${type}) ${content}`;

        if (type === NetworkLogType.ERROR)
        {
            console.error(message);
        }
        else if (type === NetworkLogType.WARNING)
        {
            console.warn(message);
        }
        else if (type !== NetworkLogType.DEBUG || !SHOW_DEBUG_LOG)       // This prevents any debug messages from logging when SHOW_DEBUG_LOG is set to false
        {
            console.log(message);
        }
    }

    sendMessage(message: object)
    {
        if (this.websocket.readyState !== WebSocket.OPEN)
        {
            this.log(NetworkLogType.ERROR, `Failed to send message ${message}. WebSocket is not open.`);
            return;
        }

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