import EventEmitter from "events";
import { messageRegistry } from "../../../common/src/messages/message-decorator";
import { ChatMessage } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";

export declare interface MessageController
{
    on(event: string, listener: Function): this;
    on(event: MessageType.ChatMesage, listener: (message: ChatMessage) => void): this,
}

export class MessageController extends EventEmitter
{
    async handleMessage(jsonString: string) 
    {
        const jsonObject = JSON.parse(jsonString);
        const MessageTypeClass = messageRegistry[jsonObject.type];

        if (!MessageTypeClass)
            throw new Error(`Unknown message type: ${jsonObject.type}`);

        // Validate Object Properties 
        const requiredProperties = Object.keys(new MessageTypeClass());
        const missingProperties = requiredProperties.filter(prop => !(prop in jsonObject));

        if (missingProperties.length > 0) 
            throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);

        const messageObject = Object.assign(new MessageTypeClass(), jsonObject);

        this.emit(jsonObject.type, messageObject);
    }
}