import "../../../common/src/messages/message-objects";
import { MovePlayer, SendChatMesage } from "../../../common/src/messages/message-objects";
import EventEmitter from "events";
import { RecognizedString, WebSocket } from "uWebSockets.js";
import { MessageType } from "../../../common/src/messages/message-type";
import { parseMessage, stringifyMessage } from "../../../common/src/messages/message-parser";
import { UserData } from "../util/user";
import { Server } from "../server";

const textDecoder = new TextDecoder();

// Defines the differnt event types for intellisense.
export declare interface MessageController
{
    on(event: string, listener: Function): this;
    on(event: MessageType.SendChatMesage, listener: (sender: WebSocket<UserData>, message: SendChatMesage) => void): this,
    on(event: MessageType.MovePlayer, listener: (sender: WebSocket<UserData>, message: MovePlayer) => void): this,
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
            const [messageType, messageObject] = parseMessage(textDecoder.decode(messageBuffer)); 

            this.emit(messageType, sender, messageObject);
        }
        catch(err)
        {
            console.log("Failed to handle message " + err);
        }
        
    }

    sendMessage(websocket: WebSocket<UserData>, message: object)
    {
        websocket.send(stringifyMessage(message));
    }

    broadcastMessage(message: object)
    {
        this.server.playerController.getPlayers().forEach(player => this.sendMessage(player.websocket, message))
    }
}