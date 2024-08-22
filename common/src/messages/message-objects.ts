import { Message } from "./message-decorator";
import { MessageType } from "./message-type";

@Message(MessageType.SendChatMesage)
export class SendChatMesage
{
    constructor(public content: string) { }
}

@Message(MessageType.UserChatMesssage)
export class UserChatMessage
{
    constructor(public userId: string, public content: string) { }
}

@Message(MessageType.ServerChatMessage)
export class ServerChatMessage
{
    constructor(public content: string) { }
}