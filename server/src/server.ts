import { HttpRequest, HttpResponse, TemplatedApp, us_socket_context_t, WebSocket } from "uWebSockets.js";
import { MessageController } from "./controllers/message-controller";
import { UserData } from "./util/user";
import { generateGuestUserData } from "./util/user";
import { PlayerController } from "./controllers/player-controller";

export class Server 
{
    messageController = new MessageController(this);
    playerController = new PlayerController(this);

    constructor(public app: TemplatedApp, port: number)
    {
        app.ws<UserData>("/*",
        {
            upgrade: (res, req, ctx) => this.handleUpgrade(res, req, ctx),
            message: (ws, msg) => this.messageController.handleMessage(ws, msg),
            close: (ws) => this.playerController.unregisterPlayer(ws),
            open: (ws) => this.playerController.registerPlayer(ws),
        });

        app.listen(port, (token: any) =>
        {
            if (!token)
                console.error(`Failed to listen to poart ${port}`);

            console.log(`Listenting to port ${port}...`)
        });

    }

    private handleUpgrade(res: HttpResponse, req: HttpRequest, ctx: us_socket_context_t) 
    {
        const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
        const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
        const secWebSocketKey = req.getHeader("sec-websocket-key");
        const displayName = req.getQuery("display-name");

        let upgradeAborted = false;

        res.onAborted(() => upgradeAborted = true);

        try 
        {
            const userData = generateGuestUserData(displayName || "undefined")
            
            if (upgradeAborted)
                return;

            res.cork(() => res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, ctx));
        }
        catch (error: any) 
        {
            res.writeStatus("400 Bad Request");
            res.end(error?.message);
        }
    }
}