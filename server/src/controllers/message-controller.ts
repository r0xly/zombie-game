import "../../../common/src/messages/message-objects";
import { SendChatMesage, UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import EventEmitter from "events";
import { RecognizedString, WebSocket } from "uWebSockets.js";
import { MessageType } from "../../../common/src/messages/message-type";
import { parseMessage, stringifyMessage } from "../../../common/src/messages/message-parser";
import { UserData } from "../util/user";
import { Server } from "../server";
import { Player } from "./player-controller";

const textDecoder = new TextDecoder();

// Defines the differnt event types for intellisense.
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
    }

    handleMessage(sender: WebSocket<UserData>, messageBuffer: ArrayBuffer) 
    {
        try 
        {
            const player = this.server.playerController.getPlayerFromUserId(sender.getUserData().userId);
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
        this.server.playerController.getPlayers().forEach(player => { if (player !== filter) this.sendMessage(player, message) });
    }
}