import { AttackZombie, SendChatMesage, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { parseMessage, stringifyMessage } from "../../../common/src/messages/message-parser";
import { MessageType } from "../../../common/src/messages/message-type";
import { RecognizedString, WebSocket } from "uWebSockets.js";
import { Player } from "./player-controller";
import { UserData } from "../util/user";
import { Server } from "../server";
import EventEmitter from "events";
import { ServerLogType } from "./logs-controller";

const textDecoder = new TextDecoder();

export declare interface MessageController
{
    on(event: MessageType.UpdatePlayerHumanoid, listener: (sender: Player, message: UpdatePlayerHumanoid) => void): this
    on(event: MessageType.SendChatMesage, listener: (sender: Player, message: SendChatMesage) => void): this,
    on(event: MessageType.AttackZombie, listener: (sender: Player, message: AttackZombie) => void): this,
    on(event: string, listener: Function): this;
}

export class MessageController extends EventEmitter
{
    constructor(public server: Server) 
    { 
        super(); 

        server.on("message", (ws, msg) => 
        {
            this.handleMessage(ws, msg);
        });
    }

    sendMessage(player: Player, message: object)
    {
        player.websocket.send(stringifyMessage(message));
    }

    /**
     * Sends a message to all Players except a specificed (optional) player
     * @param message The message to be sent
     * @param filter The Player that will not receive the broadcasted message 
     */
    broadcastMessage(message: object, filter?: Player)
    {
        for (const player of this.server.players.getPlayers())
        { 
            if (player !== filter)
            {
                this.sendMessage(player, message); 
            }
        }
    }

    private handleMessage(sender: WebSocket<UserData>, messageBuffer: ArrayBuffer) 
    {
        try 
        {
            const player = this.server.players.getPlayerFromWebSocket(sender);

            if (player)
            {
                const [messageType, messageObject] = parseMessage(textDecoder.decode(messageBuffer)); 
                this.emit(messageType, player, messageObject);
            }
            else
            {
                throw new Error(`No player with user id >>${sender.getUserData().userId}<< was found`);
            }
            
        }
        catch(err)
        {
            this.server.logs.log(ServerLogType.ERROR, `Failed to handle WebSocket message. Error: >>${err}<<`);
        }
        
    }
}