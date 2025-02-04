import { HttpRequest, HttpResponse, TemplatedApp, us_socket_context_t, WebSocket } from "uWebSockets.js";
import { HumanoidController } from "./controllers/humanoid-controller";
import { MessageController } from "./controllers/message-controller";
import { PlayerController } from "./controllers/player-controller";
import { generateGuestUserData } from "./util/user";
import { UserData } from "./util/user";
import { EventEmitter } from "stream";
import { LogsController } from "./controllers/logs-controller";
import { ZombieController } from "./controllers/zombie-controller";

export declare interface Server 
{
    on(event: string, listener: Function): this;
    on(event: "open", listener: (webSocket: WebSocket<UserData>) => void);
    on(event: "close", listener: (webSocket: WebSocket<UserData>) => void);
    on(event: "message", listener: (webSocket: WebSocket<UserData>, message: ArrayBuffer) => void);
}

export class Server extends EventEmitter
{
    logs = new LogsController(this);
    messages = new MessageController(this);
    humanoids = new HumanoidController(this);
    players = new PlayerController(this);
    zombies = new ZombieController(this);

    constructor(public app: TemplatedApp, port: number)
    {
        super();

        app.ws<UserData>("/*",
        {
            upgrade: (res, req, ctx) => 
            { 
                this.handleUpgrade(res, req, ctx);
            },
            message: (ws, msg) => 
            { 
                this.emit("message", ws, msg);
            },
            close: (ws) => 
            { 
                this.emit("close", ws);
            },
            open: (ws) => 
            { 
                this.emit("open", ws);
            },
        });

        app.listen(port, (token: any) =>
        {
            if (!token)
            {
                console.error(`Failed to listen to poart ${port}`);
            }
            else 
            {
                console.log(`Listenting to port ${port}...`)
            }
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