import { Game } from "../game";
import { PlayerJoined, SendChatMesage, SyncPlayerHumanoids } from "../../../common/src/messages/message-objects";
import { Humanoid } from "../objects/humanoid";
import { parseMessage, stringifyMessage } from "../../../common/src/messages/message-parser";
import { MessageType } from "../../../common/src/messages/message-type";

interface Player
{
    humanoid: Humanoid,
    userId: string,
    displayName: string
}

export class NetworkControler
{
    private websocket: WebSocket;
    private players = new Map<string, Player>();

    constructor(public game: Game, url: string, displayName: string)
    {
        this.websocket = new WebSocket(`${url}?display-name=${displayName}`);

        this.websocket.onopen = () => 
        {
            // ...
        }

        this.websocket.onmessage = (msg) =>
        {
            let [messageType, messageObject] = parseMessage(msg.data);

            if (messageType === MessageType.PlayerJoined)
            {
                messageObject = messageObject as PlayerJoined;
                
                const humanoid = new Humanoid();
                this.game.workspace.addChild(humanoid);

                this.players.set(messageObject.userId, {
                    userId: messageObject.userId,
                    displayName: messageObject.displayName, 
                    humanoid: humanoid
                });
            }

            if (messageType === MessageType.SyncPlayerHumanoids)
            {
                let message = messageObject as SyncPlayerHumanoids;

                for (const userId in message.players)
                {
                    const humanoidData = message.players[userId];
                    const player = this.players.get(userId);
                    
                    if (!player) 
                        continue;

                    player.humanoid.x = humanoidData.x;
                    player.humanoid.y = humanoidData.y;
                }
            }
        }
    }

    sendMessage(message: object)
    {
        this.websocket.send(stringifyMessage(message));
    }
}