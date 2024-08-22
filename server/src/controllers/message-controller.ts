import "../../../common/src/messages/message-objects";
import { SendChatMesage } from "../../../common/src/messages/message-objects";
import EventEmitter from "events";
import { WebSocket } from "uWebSockets.js";
import { MessageType } from "../../../common/src/messages/message-type";
import { parseMessage } from "../../../common/src/messages/message-parser";
import { UserData } from "../types/user";
import { messageRegistry } from "../../../common/src/messages/message-decorator";

const textDecoder = new TextDecoder();

export declare interface MessageController
{
    on(event: string, listener: Function): this;
    on(event: MessageType.SendChatMesage, listener: (sender: WebSocket<UserData>, message: SendChatMesage) => void): this,
}

export class MessageController extends EventEmitter
{
    async handleMessage(sender: WebSocket<UserData>, message: ArrayBuffer) 
    {
        try 
        {
            const [ messageType, messageObject ] = parseMessage(textDecoder.decode(message)); 

            this.emit(messageType, sender, messageObject);
        }
        catch(err)
        {
            console.log("could not do it handle message" + err)
        }
        
    }

    async sendMessage(websocket: WebSocket<UserData>, message: object)
    {
        websocket.send(JSON.stringify(message));
    }
}