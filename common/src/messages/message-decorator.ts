import { MessageType } from "./message-type";

export const messageRegistry: Record<string, any> = {};

export const Message = (type: MessageType) =>
{
    return (constructor: Function) =>
    {
        messageRegistry[type] = constructor;
        constructor.prototype.type = type;
    }
} 