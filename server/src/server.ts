import { HttpRequest, HttpResponse, TemplatedApp, us_socket_context_t, WebSocket } from "uWebSockets.js";
import { UserController } from "./controllers/user-controller";
import { UserData } from "./types/user";
import { MessageController } from "./controllers/message-controller";

export class Server 
{
    userController = new UserController();
    messageController = new MessageController();

    constructor(public app: TemplatedApp, port: number)
    {
        app.ws<UserData>("/*",
        {
            upgrade: (res, req, ctx) => this.handleUpgrade(res, req, ctx),
            message: (ws, msg) => this.onMessage(ws, msg),
            open: (ws) => this.onOpen(ws),
        });

        app.listen(port, (token: any) =>
        {
            if (!token)
                console.error(`Failed to listen to poart ${port}`);

            console.log(`Listenting to port ${port}...`)
        });

    }

    private async onMessage(ws: WebSocket<UserData>, msg: ArrayBuffer) 
    {
        try 
        {
            this.messageController.handleMessage(ws, msg);
        }
        catch(err: any)
        {
            console.log("Failed to parse message");
        }
    }

    private async onOpen(ws: WebSocket<UserData>)
    {
        const userData = ws.getUserData();

        console.log(`${userData.displayName} (${userData.userId}) connected to the server.`);
    }

    private async handleUpgrade(res: HttpResponse, req: HttpRequest, ctx: us_socket_context_t) 
    {
        const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
        const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
        const secWebSocketKey = req.getHeader("sec-websocket-key");
        const displayName = req.getQuery("display-name");

        let upgradeAborted = false;

        res.onAborted(() => upgradeAborted = true);

        try 
        {
            const userData = this.userController.createUser(displayName || "Undefined");

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