import { HumanoidData } from "../types/humanoid-data";
import { Message } from "./message-decorator";
import { MessageType } from "./message-type";

/** (Client -> Server) Chat message being sent from the client. */
@Message(MessageType.SendChatMesage)
export class SendChatMesage
{
    constructor(public content: string) { }
}

/** (Server -> Client) Used for replicating chat messages. */
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

/** A Server to Client messaged sent when a Player for initally joins the game. It contains infomration such as the Player's assigned userId and world data. */
@Message(MessageType.Welcome)
export class WelcomeMessage
{
    constructor(
        public localPlayer: { userId: string, displayName: string }, 
        public otherPlayers: { userId: string, displayName: string, x: number, y :number }[], 
        public zombies: { zombieId: string, x: number, y: number }[]
    ) { }
}

/** A Server to Client message used to notify Players that a new Player has joined. */
@Message(MessageType.PlayerJoined)
export class PlayerJoined
{
    constructor(public userId: string, public displayName: string) { }
}

/** A Server to Client message used to notify Players that a Player has left. */
@Message(MessageType.PlayerLeft)
export class PlayerLeft
{
    constructor(public userId: string) { }
}

/** A Server to Client message used for replicating the state of other Players' Humanoids on the client. */
@Message(MessageType.SyncPlayerHumanoids)
export class SyncPlayerHumanoids 
{
    constructor(public players: { [playerId: string]: HumanoidData }) { }    
}

/** A Client to Server message used for updating the state of the client's Humanoid on the server. */
@Message(MessageType.UpdatePlayerHumanoid)
export class UpdatePlayerHumanoid
{
    constructor(public humandData: HumanoidData) { }
}



/*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*
*   Tool Messages
* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

/** (TEMPORARY) A Client to Server message to notify the Server a zombie has been damaged. */
@Message(MessageType.AttackZombie)
export class AttackZombie
{
    constructor(public zombieId: string, public damage: number, public knockbackForce: number, public knockbackAngle: number) { }
}

/** (TEMPORARY) A Client to Server message to notify the Server a player has been damaged. */
@Message(MessageType.AttackPlayer)
export class AttackPlayer
{
    constructor(public playerId: string, public damage: number, public knockbackForce: number, public knockbackAngle: number) { }
}

/** A Server to Client message used to notify a player they have taken damage */
@Message(MessageType.TakeDamage)
export class TakeDamage 
{
    constructor(public damage: number, public knockbackForce: number, public knockbackAngle: number) { }
}


/*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*
*   Zombie Messages
* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

/** A Server to Client message used for sending updated zombie positions to the client. */
@Message(MessageType.SyncZombieHumanoids)
export class SyncZombieHumanoids 
{
    constructor(public zombies: { [zombieId: string]: HumanoidData }) { }    
}

/** A Server to Client message used for notifying the client a zombie has spawned. */
@Message(MessageType.ZombieSpawned)
export class ZombieSpawned
{
    constructor(public zombieId: string, public x: number, public y: number) { }
}

/** A Server to Client message used for notifying the client a zombie has despawned. */
@Message(MessageType.ZombieDespawned)
export class ZombieDespawned
{
    constructor(public zombieId: string) { }
}