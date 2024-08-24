import { Message } from "./message-decorator";
import { MessageType } from "./message-type";

/** (Client -> Server) Chat message being sent from the client. */
@Message(MessageType.SendChatMesage)
export class SendChatMesage
{
    constructor(public content: string) { }
}

/** (Server -> Client) Used for replicating chat message. */
@Message(MessageType.UserChatMesssage)
export class UserChatMessage
{
    constructor(public userId: string, public content: string) { }
}

/** (Server -> Client) Global server message. */
@Message(MessageType.ServerChatMessage)
export class ServerChatMessage
{
    constructor(public content: string) { }
}

/** (Client -> Server)  Player joined event. */
@Message(MessageType.PlayerJoined)
export class PlayerJoined
{
    constructor(public userId: string, public displayName: string) { }
}

@Message(MessageType.MovePlayer)
export class MovePlayer
{
    constructor(public x: number, public y: number) { }
}

@Message(MessageType.PlayerMoved)
export class PlayerMoved
{
    constructor(public userId: string, public x: number, public y: number) { }    
}