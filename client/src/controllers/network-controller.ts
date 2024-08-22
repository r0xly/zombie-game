import { Game } from "../game";
import { SendChatMesage } from "../../../common/src/messages/message-objects";

export class NetworkControler
{
    private websocket: WebSocket;

    constructor(public game: Game, url: string, displayName: string)
    {
        this.websocket = new WebSocket(`${url}?display-name=${displayName}`);

        this.websocket.onopen = () => 
        {
            this.sendMessage(new SendChatMesage("Hello, world!"));
        }

        this.websocket.onmessage = message =>
        {
            console.log(message);
        }
    }

    sendMessage(message: object)
    {
        message["type"] = Object.getPrototypeOf(message).type
        const msg = JSON.stringify(message);

        this.websocket.send(msg);
    }
}