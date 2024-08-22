import { Message } from "./message-decorator";
import { MessageType } from "./message-type";

@Message(MessageType.ChatMesage)
export class ChatMessage
{
    constructor(public content: string)
    {

    }
}
