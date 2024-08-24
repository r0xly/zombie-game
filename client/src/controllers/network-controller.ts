import { Game } from "../game";
import { PlayerJoined, SendChatMesage } from "../../../common/src/messages/message-objects";
import { Humanoid } from "../objects/humanoid";
import { parseMessage } from "../../../common/src/messages/message-parser";
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
            this.sendMessage(new SendChatMesage("Hello, world!"));
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

            if (messageType === MessageType.PlayerMoved)
            {
                messageObject = messageObject as PlayerJoined;
                
                const p = this.players.get(messageObject.userId);

                if (p)
                {

                    p.humanoid.position.x = messageObject.x;
                    p.humanoid.position.y = messageObject.y;
                }
            }
        }
    }

    sendMessage(message: object)
    {
        message["type"] = Object.getPrototypeOf(message).type
        const msg = JSON.stringify(message);

        this.websocket.send(msg);
    }
}