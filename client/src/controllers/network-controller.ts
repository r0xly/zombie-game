import { Game } from "../game";

export class NetworkControler
{
    private websocket: WebSocket;

    constructor(public game: Game, url: string, displayName: string)
    {
        this.websocket = new WebSocket(`${url}?display-name=${displayName}`);
    }

    
}