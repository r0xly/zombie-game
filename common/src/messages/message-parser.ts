import { messageRegistry } from "./message-decorator";

export function parseMessage(jsonString: string)
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

    return [ jsonObject.type, Object.assign(new MessageTypeClass(), jsonObject) ];
}