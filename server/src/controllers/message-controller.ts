import { SendChatMesage, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { parseMessage, stringifyMessage } from "../../../common/src/messages/message-parser";
import { MessageType } from "../../../common/src/messages/message-type";
import { RecognizedString, WebSocket } from "uWebSockets.js";
import { Player } from "./player-controller";
import { UserData } from "../util/user";
import { Server } from "../server";
import EventEmitter from "events";

const textDecoder = new TextDecoder();

export declare interface MessageController
{
    on(event: MessageType.UpdatePlayerHumanoid, listener: (sender: Player, message: UpdatePlayerHumanoid) => void): this
    on(event: MessageType.SendChatMesage, listener: (sender: Player, message: SendChatMesage) => void): this,
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

    handleMessage(sender: WebSocket<UserData>, messageBuffer: ArrayBuffer) 
    {
        try 
        {
            const player = this.server.players.getPlayerFromUserId(sender.getUserData().userId);
            const [messageType, messageObject] = parseMessage(textDecoder.decode(messageBuffer)); 
            
            if (!player)
                return;
            
            this.emit(messageType, player, messageObject);
        }
        catch(err)
        {
            console.log("Failed to handle message " + err);
        }
        
    }

    sendMessage(player: Player, message: object)
    {
        player.websocket.send(stringifyMessage(message));
    }

    broadcastMessage(message: object, filter?: Player)
    {
        this.server.players.getPlayers().forEach(player => { if (player !== filter) this.sendMessage(player, message) });
    }
}