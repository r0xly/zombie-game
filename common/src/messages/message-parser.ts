import { messageRegistry } from "./message-decorator";
import { MessageType } from "./message-type";

export const stringifyMessage = (message: object) =>
{
    message["type"] = Object.getPrototypeOf(message).type;

    return JSON.stringify(message);
}

export const parseMessage = (jsonString: string): [string, object] =>
{
    const jsonObject = JSON.parse(jsonString);
    const messageType = jsonObject.type;
    const MessageTypeClass = messageRegistry[messageType];

    if (!MessageTypeClass)
        throw new Error(`Unknown message type: ${messageType}`);

    // Validates Object Properties 
    const requiredProperties = Object.keys(new MessageTypeClass());
    const missingProperties = requiredProperties.filter(prop => !(prop in jsonObject));

    if (missingProperties.length > 0)
        throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);

    const message = Object.assign(new MessageTypeClass(), jsonObject);

    return [messageType, message];
}