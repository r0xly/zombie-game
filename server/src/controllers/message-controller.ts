import EventEmitter from "events";
import { WebSocket } from "uWebSockets.js";
import { MessageType } from "../../../common/src/messages/message-type";
import { SendChatMesage } from "../../../common/src/messages/message-objects";
import { parseMessage } from "../../../common/src/messages/message-parser";
import { UserData } from "../types/user";

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
        const [ messageType, messageObject ] = parseMessage(textDecoder.decode(message)); 
        
        this.emit(messageType, sender, messageObject);
    }
}